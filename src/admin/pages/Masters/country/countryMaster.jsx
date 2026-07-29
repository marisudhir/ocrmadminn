import React, { useState, useEffect } from 'react';
import useCountryController from './countryController';
import CountryForm from './Sub-Component/countryForm';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import AddNewButton from '../../../context/commonbutton/AddNewButton';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';
import CommonSearchBar from '../../../context/commonsearchbar/searchbar';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString('en-GB', options);
  } catch (e) {
    console.error('Date formatting error:', e);
    return dateString;
  }
};

const CountryMaster = () => {
  const { 
    countries: rawCountries = [], 
    fetchCountries, 
    addNewCountry,
    updateCountry,
    deleteCountry,
    loading, 
    error 
  } = useCountryController();
  
  const [showForm, setShowForm] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 


  // Ensure countries is always an array
  const countries = Array.isArray(rawCountries) ? rawCountries : [];

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleEdit = (country) => {
    setCurrentCountry(country);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentCountry(null);
    setShowForm(true);
  };

  const filteredCountries = countries.filter((country) =>
    country.cCountry_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredCountries, itemsPerPage);


const countryColumns = [
  {
    header: "Country Name",
 
    render: (row) => row.cCountry_name,
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
    header: "Created At",
  
    render: (row) => formatDate(row.cCreate_dt),
  },
  {
    header: "Actions",
    
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button onClick={() => handleEdit(row)}>
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button onClick={() => handleDelete(row.iCountry_id)}>
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];



const handleFormSubmit = async (formData) => {
  try {
    let success = false;
    if (formData.iCountry_id) {
      success = await updateCountry(formData.iCountry_id, formData);
    } else {
      success = await addNewCountry(formData);
    }

    if (success) {
      setSuccessMessage(
        formData.iCountry_id
          ? 'Country updated successfully!'
          : 'Country added successfully!'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowForm(false);
      fetchCountries();
    }
  } catch (err) {
    console.error('Form submission error:', err);
  }
};




  const handleDelete = async (countryId) => {
    if (window.confirm('Are you sure you want to deactivate this Country?')) {
      await deleteCountry(countryId);
      fetchCountries();
    }
  };




  if (loading && countries.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
        <button onClick={fetchCountries} className="ml-2 underline">
          Retry
        </button>
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
                title="Country Master"
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
                  setCurrentPage(1); 
                }}
                placeholder="Search Countries..."
                className="max-w-full"
              />
            </div>
            
            <div className="flex justify-start lg:justify-end lg:min-w-fit">
              <AddNewButton
                label="+ Add New Country"
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
            <CountryForm
              initialData={currentCountry || {}}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading}
            />
          </div>
        )}

        {/* Empty State - EXACT same as StateMaster */}
        {filteredCountries.length === 0 && !loading ? (
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
            <h3 className="text-xl font-semibold mb-2">No Countries Found</h3>
            <p className="text-md text-center max-w-sm mb-6">
              {searchQuery 
                ? `No countries match your search for "${searchQuery}".` 
                : `There are currently no countries in the system. Click the button above to add a new one.`
              }
            </p>
            {!searchQuery && (
              <AddNewButton
                label="Add New Country"
                onClick={handleAdd}
                className="py-2"
              />
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow"> 
             
              <CommonTable
                columns={countryColumns}
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

export default CountryMaster;
