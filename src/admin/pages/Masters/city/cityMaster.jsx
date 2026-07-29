import React, { useState, useEffect } from 'react';
import { getAllDistrict } from '../../Masters/district/districtModel';
import useCitiesController from './cityController';
import CityForm from '../city/Sub-Component/cityForm';
// import formatDate from '../../../utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import AddNewButton from '../../../context/commonbutton/AddNewButton';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';
import CommonSearchBar from '../../../context/commonsearchbar/searchbar';

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

const CityMaster = () => {
  const { 
    cities: rawCities = [], 
    fetchCities, 
    createCities,
    updateCities,
    deleteCities,
    loading, 
    error 
  } = useCitiesController();

  const [districts, setDistricts] = useState([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [districtError, setDistrictError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDistrict = async () => {
      setDistrictLoading(true);
      setDistrictError(null);
      try {
        const data = await getAllDistrict();
        setDistricts(data);
      } catch (err) {
        console.error('Failed to fetch districts:', err);
        setDistrictError(err);
        setDistricts([]);
      } finally {
        setDistrictLoading(false);
      }
    };

    fetchDistrict();
    fetchCities();
  }, [fetchCities]);
  
  const [showForm, setShowForm] = useState(false);

  const [currentCity, setCurrentCity] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const cities = Array.isArray(rawCities) ? rawCities : [];
   const filteredCities = cities.filter((city) =>
    city.cCity_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredCities, itemsPerPage);



const cityColumns = [
  {
    header: "City Name",
 
    render: (row) => row.cCity_name,
  },
  {
    header: "District Name",
  
    render: (row) => {
      const district = districts.find(
        d => d.iDistric_id === row.iDistric_id
      );
      return district?.cDistrict_name || `ID: ${row.iDistric_id}`;
    },
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

        <button onClick={() => handleDelete(row.icity_id)}>
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];

  const handleEdit = (city) => {
    setCurrentCity(city);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentCity(null);
    setShowForm(true);
  };

 const handleFormSubmit = async (formData) => {
    try {
      let success;
      if (formData.icity_id) {
        success = await updateCities({
          ...formData,
          icity_id: formData.icity_id
        });
      } else {
        success = await createCities(formData);
      }

      if (success) {
        setSuccessMessage(
          formData.icity_id 
            ? 'cities updated successfully!' 
            : 'cities added successfully!'
        );
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowForm(false);
        fetchCities();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async (citiesId) => {
    if (window.confirm('Are you sure you want to deactivate this city?')) {
      await deleteCities(citiesId);
      fetchCities();
    }
  };

  // Pagination

  if (loading && cities.length === 0) {
    return <div className="text-center py-8">Loading cities...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
        <button onClick={fetchCities} className="ml-2 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans"> {/*  Modern design */}
      <div className="max-w-9xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-6 border-b pb-4"> {/* Better header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 lg:min-w-fit">
              <CommonBackButton
                to="/masters"
                title="Cities Master"
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
                  setCurrentPage(1); // Reset pagination
                }}
                placeholder="Search Cities..."
                className="max-w-full"
              />
            </div>

            <div className="flex justify-start lg:justify-end lg:min-w-fit">
              <AddNewButton
                label="+ Add New City"
                onClick={handleAdd}
                disabled={loading}
                className="py-2"
              />
            </div>
          </div>
        
        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 border-l-4 border-green-500 rounded-md shadow-sm">
            {successMessage}
          </div>
        )}

        </div>
        {showForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <CityForm
              initialData={currentCity || {}}
              onSuccess={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading || districtLoading}
              district={districts}
            />
          </div>
        )}

        {/*  EMPTY STATE */}

        {filteredCities.length === 0 && !loading ? (
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
            <h3 className="text-xl font-semibold mb-2">No Cities Found</h3>
            <p className="text-md text-center max-w-sm mb-6">
              {searchQuery 
                ? `No cities match your search for "${searchQuery}".` 
                : `There are currently no cities in the system. Click the button above to add a new one.`
              }
            </p>
            {!searchQuery && (
              <AddNewButton
                label="Add New City"
                onClick={handleAdd}
                className="py-2"
              />
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <CommonTable
  columns={cityColumns}
  data={currentItems}
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
/>

            </div>
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

export default CityMaster;

