import React, { useState, useEffect, useMemo } from 'react';
import LeadSourceForm from './Sub-Components/leadSourceForm';
import { useLeadSourceController } from './leadSourceController';
import formatDate from '../../../utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';

const LeadSource = ({ companyId, onBack }) => {
  const { 
    leadSource, 
    fetchLeadSource, 
    deleteLeadSource, 
    loading, 
    error,
    clearError 
  } = useLeadSourceController();

  // State for filtering by company
//   const [selectedCompany, setSelectedCompany] = useState(company);
  // State for form visibility and mode
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  // Pagination state

  const [itemsPerPage] = useState(10);
  const [success, setSuccess] = useState(null);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearError();
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const showMessage = (message, type = 'error') => {
    if (type === 'error') {
      // Error is now handled by the controller
    } else {
      setSuccess(message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeadSource();
  }, []);

  // Generate unique list of companies
  const companies = useMemo(() => {
    if (!leadSource || leadSource.length === 0) return [];
    return [...new Set(leadSource.map(source => source.company?.cCompany_name || "Unknown Company"))];
  }, [leadSource]);

  // Filter lead sources based on selected company
    // const filteredLeadSource = useMemo(() => {
    //     if (!leadSource || leadSource.length === 0) return [];
    //     if (!companyId) return leadSource; 
    //     return leadSource.filter(source => source.icompany_id === companyId);
    // }, [leadSource, companyId]);

const filteredLeadSource = useMemo(() => {
    if (!leadSource || leadSource.length === 0) return [];

    const filtered = !companyId
        ? leadSource
        : leadSource.filter(
            source => source.icompany_id === companyId
          );

    // latest updated / created first
    return [...filtered].sort((a, b) => {
        return new Date(b.updated_at || b.created_at).getTime() -
               new Date(a.updated_at || a.created_at).getTime();
    });

}, [leadSource, companyId]);

 const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
  indexOfFirstItem,
} = usePagination(filteredLeadSource, itemsPerPage);

const leadSourceColumns = [
  {
    header: "Source Name",
    render: (row) => row.source_name || "Unknown",
  },
  {
    header: "Description",
    render: (row) => row.description || "-",
  },
  {
    header: "Created At",
    render: (row) =>
      formatDate(row.updated_at || row.created_at) || "Unknown Date",
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleEdit(row)}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-indigo-600" />
        </button>

        <button
          onClick={() =>
            handleDelete(row.source_id, row.source_name)
          }
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLeadSource.length]);



  // Handle Edit
  const handleEdit = (source) => {
    setEditingSource(source);
    setShowForm(true);
  };

  // Handle Delete 
  const handleDelete = async (sourceId, sourceName) => {
    if (window.confirm(`Are you sure you want to delete "${sourceName}"?`)) {
      const result = await deleteLeadSource(sourceId);
      if (result.success) {
        setSuccess(`"${sourceName}" deleted successfully`);
        console.log('Lead source deleted successfully');
      } else {
        console.error('Delete failed:', result.error);
      }
    }
  };

  // Handle Form Close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingSource(null);
    clearError();
  };

  // Handle Form Success
  // const handleFormSuccess = (message) => {
  //   setShowForm(false);
  //   setEditingSource(null);
  //   if (message) setSuccess(message);
  //   fetchLeadSource(); 
  // };

  const handleFormSuccess = (message) => {
  setShowForm(false);
  setEditingSource(null);
  setCurrentPage(1);   
  if (message) setSuccess(message);
  fetchLeadSource();
};


  // Clear error manually
  const handleClearError = () => {
    clearError();
  };

  // Clear success manually
  const handleClearSuccess = () => {
    setSuccess(null);
  };

  //  Loading and Error States 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead source data...</p>
      </div>
    );
  }

  return (
            <div className={companyId ? "font-sans antialiased" : "min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased"}>
      <div className="max-w-9xl mx-auto ">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          {companyId ? (
            <CommonBackButton title="Lead Sources" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">Lead Sources</h1>
          )}

          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(true)}
          >
           + Add Lead Source
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
              onClick={handleClearError}
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
              onClick={handleClearSuccess}
              className="text-green-600 hover:text-green-800 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

      

        {/* Form Modal */}

        {showForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
            onClick={handleFormClose}  
          >
            <div
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()} 
            >
              <LeadSourceForm 
                onClose={handleFormClose} 
                onSuccess={handleFormSuccess}
                editData={editingSource}
                companyId={companyId}
              />
            </div>
          </div>
        )}

        {/* Lead Source Table */}
        <CommonTable
          columns={leadSourceColumns}
          data={currentItems}
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

export default LeadSource;


