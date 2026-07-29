import React, { useState, useEffect, useMemo } from 'react';
import { useIndustryController } from './industryController';
import IndustryForm from './Sub-Components/industryFormData';
import formatDate from '../../../utils/formatDate';
import { useSharedController } from '../../../api/shared/controller';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';

const LeadIndustry = ({ companyId, onBack }) => {
  const { industries, fetchIndustryData, updateIndustry, deleteIndustry, error: controllerError } = useIndustryController();
  const [showForm, setShowForm] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  // const { companies, fetchCompanies } = useSharedController();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Also clear controller errors
  useEffect(() => {
    if (controllerError) {
      setError(controllerError);
    }
  }, [controllerError]);

  const showMessage = (message, type = 'error') => {
    if (type === 'error') {
      setError(message);
    } else {
      setSuccess(message);
    }
  };

  const handleFetchData = async () => {
  if (!companyId) {
    showMessage('Company not found');
    return;
  }

  setLoading(true);
  try {
    await fetchIndustryData(companyId);
  } finally {
    setLoading(false);
  }
};

  // useEffect(() => {
  //   handleFetchData();
  // }, []);


  useEffect(() => {
  if (companyId) {
    handleFetchData();
    setCurrentPage(1);
  }
}, [companyId]);



  const filteredIndustries = useMemo(() => {
    if (!industries || !companyId) return [];
      const filtered = industries.filter(
    status =>
      status.bactive === true &&
      status.icompany_id === companyId
  );

    return [...filtered].sort((a, b) => {
    return new Date(b.dcreated_dt).getTime() -
           new Date(a.dcreated_dt).getTime();
  });

}, [industries, companyId]);
  
  const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentIndustries,
} = usePagination(filteredIndustries, itemsPerPage);

const industryColumns = [
  {
    header: "Lead Industry",
    render: (row) => row.cindustry_name || "Unknown",
  },
  {
    header: "Created Date",
    render: (row) => formatDate(row.dcreated_dt) || "-",
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleEdit(row)}
          disabled={loading}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button
          onClick={() => handleDelete(row)}
          disabled={loading}
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('Authentication token not found! Please log in.');
      return { userId: null, companyId: null };
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return {
        userId: payload.user_id || null,
        companyId: payload.company_id || null,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      showMessage('Invalid authentication token! Please log in again.');
      return { userId: null, companyId: null };
    }
  };

  const handleEdit = (industry) => {
    setEditingIndustry(industry);
    setShowForm(true);
  };
const handleUpdate = async (formData) => {
  const { userId } = getUserFromToken();
  
  if (!userId) {
    showMessage('User info missing! Please log in.');
    return false;
  }

  if (!formData.icompany_id) {
    showMessage('Company ID is required for updating industry.');
    return false;
  }

  const payload = {
    cindustry_name: formData.cindustry_name.trim(),
    dupdated_dt: new Date().toISOString(),
    icompany_id: formData.icompany_id, // Use company ID from form data
    updated_by: userId,
  };

  try {
    setLoading(true);
    setError(null);
    
    const success = await updateIndustry(editingIndustry.iindustry_id, payload);
    
    if (success) {
      showMessage('Industry updated successfully!', 'success');
      setEditingIndustry(null);
      setShowForm(false);
      await handleFetchData();
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (industry) => {
  if (!window.confirm(`Are you sure you want to delete "${industry.cindustry_name}"?`)) {
    return;
  }

  const { userId, companyId } = getUserFromToken();
  
  if (!userId || !companyId) {
    showMessage('User or company info missing! Please log in.');
    return;
  }

  const payload = {
    bactive: false,
    dupdated_dt: new Date().toISOString(),
    icompany_id: companyId,
    updated_by: userId,
  };

  try {
    setLoading(true);
    setError(null);
    
    await deleteIndustry(industry.iindustry_id, payload);
    
    showMessage('Industry deleted successfully!', 'success');
    await handleFetchData();
    
  } catch (err) {
    console.error('Full error object in handleDelete:', err);
    
    // Extract the actual backend error message
    const backendError = err.response?.data?.error || 
                        err.response?.data?.message || 
                        err.message || 
                        'Failed to delete industry';
    
    console.log('Backend error message:', backendError);
    showMessage(backendError);
  } finally {
    setLoading(false);
  }
};

  return (
     <div className={companyId ? "font-sans antialiased" : "min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased"}>
      <div className="max-w-9xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          {companyId ? (
            <CommonBackButton title="Lead Industries" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Lead Industries </h1>
          )}
          <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(true)}
          >
           + Add Lead Industry
          </button>
        </div>
       

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">{success}</span>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-600 hover:text-green-800 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {/* Showing {filteredIndustries.length} of {industries.length} industries
          {companyId && ` for your company`} */}

          {loading && ' (Loading...)'}
        </div>


        {showForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
            onClick={() => {
              setShowForm(false);
              setEditingIndustry(null);
            }}   
          >
            <div className=" rounded-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()} >
              <IndustryForm 
                onClose={() => {
                  setShowForm(false);
                  setEditingIndustry(null);
                }} 
                onSuccess={handleFetchData}
                industry={editingIndustry}
                onUpdate={handleUpdate}
                loading={loading}
                companyId={companyId}
              />
            </div>
          </div>
        )}


        {/* Rest of your table and pagination remains the same */}
       <CommonTable
        columns={industryColumns}
        data={currentIndustries}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />


            <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      </div>
    </div>
  );
};

export default LeadIndustry;


