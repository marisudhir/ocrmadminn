import React, { useState, useEffect } from 'react';
import useCurrencyController from './currencyController';
import CurrencyForm from './Sub-Components/currencyForm';
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

const CurrencyMaster = () => {
  const {
    currencies: rawCurrencies,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    loading,
    error
  } = useCurrencyController();


//log the currency here 
  const [showForm, setShowForm] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);


const filteredCurrencies = Array.isArray(rawCurrencies)
  ? rawCurrencies.filter(currency => 
      currency?.bactive === true && 
      (!searchQuery.trim() || 
        currency.currency_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.currency_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.country_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  : [];

  const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredCurrencies, itemsPerPage);

const currencyColumns = [
  {
    header: "Country Name",
   
    render: (row) => row.country_name,
  },
  {
    header: "Currency Code",
    
    render: (row) => row.currency_code,
  },
  {
    header: "Currency Name",

    render: (row) => row.currency_name,
  },
  {
    header: "Symbol",
    
    render: (row) => row.symbol,
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
          onClick={() => handleDeactivateClick(row.icurrency_id)}
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  const handleEdit = (currency) => {
    setCurrentCurrency(currency);
    setShowForm(true);
  };


  const handleAdd = () => {
    setCurrentCurrency(null);
    setShowForm(true);
  };


  const handleFormSubmit = async (formData) => {
    try {
      let success;
      if (formData.icurrency_id) {
        success = await updateCurrency(formData);
      } else {
        success = await createCurrency(formData);
      }


      if (success) {
        setSuccessMessage(
          formData.icurrency_id
            ? 'Currency updated successfully! 🎉'
            : 'Currency added successfully! 🎉'
        );
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowForm(false);
        fetchCurrencies();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };


  const handleDeactivateClick = (currencyId) => {
    setCurrencyToDelete(currencyId);
    setShowDeleteConfirm(true);
  };


  const handleConfirmDeactivate = async () => {
    if (currencyToDelete) {
      await deleteCurrency(currencyToDelete);
      fetchCurrencies();
    }
    setShowDeleteConfirm(false);
    setCurrencyToDelete(null);
  };



  if (loading && rawCurrencies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-blue-600 font-semibold text-lg animate-pulse">
          Loading currencies...
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
            onClick={fetchCurrencies}
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
                title="Currency Master"
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
                placeholder="Search currencies..."
                className="max-w-full"
              />
            </div>
            <div className="flex justify-start lg:justify-end lg:min-w-fit">
              <AddNewButton
                label="+ Add New Currency"
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
            <CurrencyForm
              initialData={currentCurrency || {}}
              onSuccess={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setShowDeleteConfirm(false)}
          message="Are you sure you want to deactivate this currency? This action cannot be undone."
        />

        {filteredCurrencies.length === 0 && !loading ? (


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
            <h3 className="text-xl font-semibold mb-2">No Currencies Found</h3>
            <p className="text-md text-center max-w-sm mb-6">
              {searchQuery ? `No currencies match your search for "${searchQuery}".` : `There are currently no currencies in the system. Click the button above to add a new one.`}
            </p>
            {!searchQuery && (
              <AddNewButton
                label="Add New Currency"
                onClick={handleAdd}
                className="py-2"
              />
            )}
          </div>
        ) : (
          <>
            
              <CommonTable
                columns={currencyColumns}
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


export default CurrencyMaster;

