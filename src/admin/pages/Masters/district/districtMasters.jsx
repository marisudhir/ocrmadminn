import  { useState, useEffect } from 'react';
import { getAllState } from '../../Masters/States/stateModel';
import useDistrictController from './districtContoller';
import DistrictForm from '../district/Sub-Component/districtForm';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import AddNewButton from '../../../context/commonbutton/AddNewButton';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';
import CommonSearchBar from '../../../context/commonsearchbar/searchbar';

// Custom Confirmation Modal component to replace window.confirm
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};

const DistrictMaster = () => {
  // Destructure state and actions from the controller
  const { 
    district: rawDistrict = [], 
    fetchDistrict, 
    createDistrict,
    updateDistrict,
    deleteDistrict,
    loading, 
    error 
  } = useDistrictController();

  // State for states data (used in the form)
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [statesError, setStatesError] = useState(null);

  // UI state management
  const [showForm, setShowForm] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch states and districts on component mount

    const fetchStates = async () => {
      setStatesLoading(true);
      setStatesError(null);
      try {
        const data = await getAllState();
        setStates(data);
      } catch (err) {
        setStatesError(err);
        setStates([]);
      } finally {
        setStatesLoading(false);
      }
    };

    useEffect(() => {
    fetchDistrict();
  }, [fetchDistrict]);

  // Filter districts based on search query
  const filteredDistricts = Array.isArray(rawDistrict)
    ? rawDistrict.filter(district =>
        district.cDistrict_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredDistricts, itemsPerPage);

const districtColumns = [
  {
    header: "District Name",
    render: (row) => row.cDistrict_name,
  },
  {
    header: "State",
    render: (row) =>
      row?.state?.cState_name
        ? row.state.cState_name.trim().replace(/\n/g, " ")
        : "-",
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.bactive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.bactive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button onClick={() => handleEdit(row)}>
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button
          onClick={() => handleDeactivateClick(row.iDistric_id)}
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  // Handler to open the form for editing an existing district
  const handleEdit = (district) => {
    setCurrentDistrict(district);
    setShowForm(true);
    fetchStates();
  };

  // Handler to open the form for adding a new district
  const handleAdd = () => {
    setCurrentDistrict(null);
    fetchStates();
    setShowForm(true);
  };

  // Handler for form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      let success;
      if (formData.iDistric_id) {
        success = await updateDistrict({
          ...formData,
          iDistric_id: formData.iDistric_id
        });
      } else {
        success = await createDistrict(formData);
      }

      if (success) {
        setSuccessMessage(
          formData.iDistric_id 
            ? 'District updated successfully! 🎉' 
            : 'District added successfully! 🎉'
        );
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowForm(false);
        fetchDistrict();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  // Handler to trigger the confirmation modal for deactivation
  const handleDeactivateClick = (districtId) => {
    setDistrictToDelete(districtId);
    setShowDeleteConfirm(true);
  };

  // Handler for the actual deactivation logic after confirmation
  const handleConfirmDeactivate = async () => {
    if (districtToDelete) {
      await deleteDistrict(districtToDelete);
      fetchDistrict();
    }
    setShowDeleteConfirm(false);
    setDistrictToDelete(null);
  };



  // Render different states based on data fetching
  if (loading && rawDistrict.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-blue-600 font-semibold text-lg animate-pulse">
          Loading districts...
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-600 font-medium mb-4">Error: {error.message}</p>
          <button 
            onClick={fetchDistrict}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-9xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-6 border-b pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 lg:min-w-fit">
              <CommonBackButton
                to="/masters"
                title="District Master"
                className="mb-0"
                buttonClassName="border border-gray-300 px-2 py-1 hover:bg-gray-100"
                titleClassName="text-3xl font-extrabold text-gray-800"
              />
            </div>
            <div className="w-full lg:max-w-xl">
              <CommonSearchBar
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                placeholder="Search Districts..."
                className="max-w-full"
              />
            </div>
            <div className="flex justify-start lg:justify-end lg:min-w-fit">
              <AddNewButton
                label="+ Add New District"
                onClick={handleAdd}
                disabled={loading}
                className="py-2"
              />
            </div>
          </div>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 border-l-4 border-green-500 rounded-md shadow-sm">
            {successMessage}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <DistrictForm
              initialData={currentDistrict || {}}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading || statesLoading}
              states={states}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setShowDeleteConfirm(false)}
          message="Are you sure you want to deactivate this district? This action cannot be undone."
        />

        {filteredDistricts.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg 
              className="w-20 h-20 mb-4 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Districts Found</h3>
            <p className="text-md text-center max-w-sm mb-6">
              {searchQuery ? `No districts match your search for "${searchQuery}".` : `There are currently no districts in the system. Click the button above to add a new one.`}
            </p>
            {!searchQuery && (
              <AddNewButton
                label="Add New District"
                onClick={handleAdd}
                className="py-2"
              />
            )}
          </div>
        ) : (
          <>
            <CommonTable
              columns={districtColumns}
              data={currentItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />

                 <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
          </>
        )}
      </div>
    </div>
  );
};

export default DistrictMaster;


