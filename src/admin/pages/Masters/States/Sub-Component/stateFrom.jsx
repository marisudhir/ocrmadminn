import { useState, useEffect } from 'react';
import useStateController from '../../States/stateController';

const StateForm = ({
  onClose,
  onSuccess,
  initialData = null,
  countries = [],
  loading
}) => {
  const { createState, updateState, deleteState } = useStateController();

  const [formData, setFormData] = useState({
    cState_name: '',
    iCountry_id: '',
    bactive: true
  });

  const [countriesError, setCountriesError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Debug countries data
  useEffect(() => {
  }, [countries]);

  // Initialize form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        cState_name: initialData.cState_name || '',
        iCountry_id: initialData.iCountry_id?.toString() || '',
        bactive: initialData.bactive !== false
      });
    }
  }, [initialData]);

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleChange = (e) => {
    
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    try {
      const payload = {
        ...formData,
        iCountry_id: parseInt(formData.iCountry_id)
      };

      if (initialData?.iState_id) {
        payload.iState_id = initialData.iState_id;
        await updateState(payload);
        setSuccessMessage('State updated successfully!');
      } else {
        await createState(payload);
        setSuccessMessage('State created successfully!');
      }

      setTimeout(() => {
        clearMessages();
        onSuccess?.();
        onClose?.();
      }, 3000);

    } catch (error) {
      console.error("Form submission failed:", error);
      setErrorMessage(error.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!initialData?.iState_id) return;
    
    if (window.confirm('Are you sure you want to delete this state?')) {
      clearMessages();
      try {
        await deleteState(initialData.iState_id);
        setSuccessMessage('State deleted successfully!');
        setTimeout(() => {
          clearMessages();
          onSuccess?.();
          onClose?.();
        }, 3000);
      } catch (error) {
        console.error("Delete failed:", error);
        setErrorMessage(error.response?.data?.message || 'Failed to delete state.');
      }
    }
  };

  return (

      <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}   
  >
     <div
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {formData.iCountry_id ? 'Edit Country' : 'Add Country'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
    {/* <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"> */}
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Edit State' : 'Add New State'}
      </h2>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className='text-red-500'>*</span>
          </label>
          <select
            name="iCountry_id"
            value={formData.iCountry_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            disabled={loading || countries.length === 0}
          >
            <option value="">
              {countries.length === 0 ? 'No countries available' : 'Select Country'}
            </option>
            {countries.map(country => (
              <option
                key={country.iCountry_id || country.id}
                value={country.iCountry_id || country.id}
              >
                {country.cCountry_name || country.name || 'Unnamed Country'}
              </option>
            ))}
          </select>
          {countriesError && (
            <p className="mt-1 text-sm text-red-600">
              Failed to load countries: {countriesError.message}
            </p>
          )}
        </div>

        {/* State Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State Name <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            name="cState_name"
            value={formData.cState_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            disabled={loading}
            placeholder="Enter state name"
            maxLength={50}
          />
          {formData.cState_name.length=== 50 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 50 characters
            </p>
          )}
        </div>

        {/* Active Status Checkbox  */}
        {initialData && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bactive"
                name="bactive"
                checked={formData.bactive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="bactive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
            {/* <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800"
              disabled={loading}
            >
              Delete State
            </button> */}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              clearMessages();
              typeof onClose === 'function' && onClose();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || countries.length === 0}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              loading || countries.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
    </div>
    // </div>
  );
};

export default StateForm;









// import { useState, useEffect } from 'react';
// import useStateController from '../../States/stateController';

// const StateForm = ({
//   onClose,
//   onSuccess,
//   initialData = null,
//   countries = [],
//   loading
// }) => {
//   const { createState, updateState, deleteState } = useStateController();

//   const [formData, setFormData] = useState({
//     cState_name: '',
//     iCountry_id: '',
//     bactive: true
//   });

//   const [countriesError, setCountriesError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Debug countries data
//   useEffect(() => {
//   }, [countries]);

//   // Initialize form if editing
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         cState_name: initialData.cState_name || '',
//         iCountry_id: initialData.iCountry_id?.toString() || '',
//         bactive: initialData.bactive !== false
//       });
//     }
//   }, [initialData]);

//   const clearMessages = () => {
//     setSuccessMessage('');
//     setErrorMessage('');
//   };

//   const handleChange = (e) => {
    
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     clearMessages();

//     try {
//       const payload = {
//         ...formData,
//         iCountry_id: parseInt(formData.iCountry_id)
//       };

//       if (initialData?.iState_id) {
//         payload.iState_id = initialData.iState_id;
//         await updateState(payload);
//         setSuccessMessage('State updated successfully!');
//       } else {
//         await createState(payload);
//         setSuccessMessage('State created successfully!');
//       }

//       setTimeout(() => {
//         clearMessages();
//         onSuccess?.();
//         onClose?.();
//       }, 3000);

//     } catch (error) {
//       console.error("Form submission failed:", error);
//       setErrorMessage(error.response?.data?.message || 'Operation failed. Please try again.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!initialData?.iState_id) return;
    
//     if (window.confirm('Are you sure you want to delete this state?')) {
//       clearMessages();
//       try {
//         await deleteState(initialData.iState_id);
//         setSuccessMessage('State deleted successfully!');
//         setTimeout(() => {
//           clearMessages();
//           onSuccess?.();
//           onClose?.();
//         }, 3000);
//       } catch (error) {
//         console.error("Delete failed:", error);
//         setErrorMessage(error.response?.data?.message || 'Failed to delete state.');
//       }
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//       <h2 className="text-xl font-bold mb-4">
//         {initialData ? 'Edit State' : 'Add New State'}
//       </h2>

//       {/* Success and Error Messages */}
//       {successMessage && (
//         <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
//           {errorMessage}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Country Selection Dropdown */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Country
//           </label>
//           <select
//             name="iCountry_id"
//             value={formData.iCountry_id}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//             required
//             disabled={loading || countries.length === 0}
//           >
//             <option value="">
//               {countries.length === 0 ? 'No countries available' : 'Select Country'}
//             </option>
//             {countries.map(country => (
//               <option
//                 key={country.iCountry_id || country.id}
//                 value={country.iCountry_id || country.id}
//               >
//                 {country.cCountry_name || country.name || 'Unnamed Country'}
//               </option>
//             ))}
//           </select>
//           {countriesError && (
//             <p className="mt-1 text-sm text-red-600">
//               Failed to load countries: {countriesError.message}
//             </p>
//           )}
//         </div>

//         {/* State Name Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             State Name
//           </label>
//           <input
//             type="text"
//             name="cState_name"
//             value={formData.cState_name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//             required
//             disabled={loading}
//             placeholder="Enter state name"
//           />
//         </div>

//         {/* Active Status Checkbox (only in edit mode) */}
//         {initialData && (
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="bactive"
//                 name="bactive"
//                 checked={formData.bactive}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                 disabled={loading}
//               />
//               <label htmlFor="bactive" className="ml-2 block text-sm text-gray-700">
//                 Active
//               </label>
//             </div>
//             {/* <button
//               type="button"
//               onClick={handleDelete}
//               className="text-sm text-red-600 hover:text-red-800"
//               disabled={loading}
//             >
//               Delete State
//             </button> */}
//           </div>
//         )}

//         {/* Form Actions */}
//         <div className="flex justify-end space-x-3 pt-4">
//           <button
//             type="button"
//             onClick={() => {
//               clearMessages();
//               typeof onClose === 'function' && onClose();
//             }}
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading || countries.length === 0}
//             className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
//               loading || countries.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default StateForm;