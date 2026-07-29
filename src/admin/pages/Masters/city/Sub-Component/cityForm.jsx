import React, { useState, useEffect } from 'react';
import useCitiesController from '../cityController';

const CityForm = ({
  onClose,
  onSuccess,
  initialData = null,
  district = [],
  loading
}) => {
  const { createCities, updateCities, deleteCities } = useCitiesController();

  const [formData, setFormData] = useState({
    cCity_name: '',
    iDistric_id: '',
    bactive: true
  });

  const [districtError, setDistrictError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Debug countries data
  useEffect(() => {
    console.log('Received countries:', district);
  }, [district]);

  // Initialize form if editing
useEffect(() => {
  if (initialData) {
    setFormData({
      cCity_name: initialData.cCity_name || '',
      // Try both possible property names for district ID
      iDistric_id: initialData.iDistric_id?.toString() || 
                  initialData.iDistric_id?.toString() || 
                  initialData.district?.iDistric_id?.toString() || 
                  '',
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
        iDistric_id: parseInt(formData.iDistric_id)
      };

      if (initialData?.icity_id) {
        payload.icity_id = initialData.icity_id;
        await updateCities(payload);
        setSuccessMessage('District updated successfully!');
      } else {
        await createCities(payload);
        setSuccessMessage('Cities created successfully!');
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
    if (!initialData?.icity_id) return;
    
    if (window.confirm('Are you sure you want to delete this cities?')) {
      clearMessages();
      try {
        await deleteCities(initialData.icity_id);
        setSuccessMessage('City deleted successfully!');
        setTimeout(() => {
          clearMessages();
          onSuccess?.();
          onClose?.();
        }, 3000);
      } catch (error) {
        console.error("Delete failed:", error);
        setErrorMessage(error.response?.data?.message || 'Failed to delete city.');
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
        {initialData ? 'Edit city' : 'Add New city'}
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
        {/* district Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <select
            name="iDistric_id"
            value={formData.iDistric_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            disabled={loading || district.length === 0}
          >
            <option value="">
              {district.length === 0 ? 'No city available' : 'Select Cities'}
            </option>
            {district.map(district => (
              <option
                key={district.iDistric_id ||district.iDistric_id}
                value={district.iDistric_id || district.iDistric_id}
              >
                {district.cDistrict_name || district.name || 'Unnamed cities'}
              </option>
            ))}
          </select>
          {districtError && (
            <p className="mt-1 text-sm text-red-600">
              Failed to load districts: {districtError.message}
            </p>
          )}
        </div>

        {/* cities Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cities Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cCity_name"
            value={formData.cCity_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            disabled={loading}
            placeholder="Enter City name"
            maxLength={50}
          />
          {formData.cCity_name?.length === 50 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 50 characters
            </p>
          )}
        </div>

        {/* Active Status Checkbox (only in edit mode) */}
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
            disabled={loading || district.length === 0}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              loading || district.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
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

export default CityForm;


// import React, { useState, useEffect } from 'react';
// import useCitiesController from '../cityController';

// const CityForm = ({
//   onClose,
//   onSuccess,
//   initialData = null,
//   district = [],
//   loading
// }) => {
//   const { createCities, updateCities, deleteCities } = useCitiesController();

//   const [formData, setFormData] = useState({
//     cCity_name: '',
//     iDistric_id: '',
//     bactive: true
//   });

//   const [districtError, setDistrictError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Debug countries data
//   useEffect(() => {
//     console.log('Received countries:', district);
//   }, [district]);

//   // Initialize form if editing
// useEffect(() => {
//   if (initialData) {
//     setFormData({
//       cCity_name: initialData.cCity_name || '',
//       // Try both possible property names for district ID
//       iDistric_id: initialData.iDistric_id?.toString() || 
//                   initialData.iDistric_id?.toString() || 
//                   initialData.district?.iDistric_id?.toString() || 
//                   '',
//       bactive: initialData.bactive !== false
//     });
//   }
// }, [initialData]);

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
//         iDistric_id: parseInt(formData.iDistric_id)
//       };

//       if (initialData?.icity_id) {
//         payload.icity_id = initialData.icity_id;
//         await updateCities(payload);
//         setSuccessMessage('District updated successfully!');
//       } else {
//         await createCities(payload);
//         setSuccessMessage('Cities created successfully!');
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
//     if (!initialData?.icity_id) return;
    
//     if (window.confirm('Are you sure you want to delete this cities?')) {
//       clearMessages();
//       try {
//         await deleteCities(initialData.icity_id);
//         setSuccessMessage('City deleted successfully!');
//         setTimeout(() => {
//           clearMessages();
//           onSuccess?.();
//           onClose?.();
//         }, 3000);
//       } catch (error) {
//         console.error("Delete failed:", error);
//         setErrorMessage(error.response?.data?.message || 'Failed to delete city.');
//       }
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//       <h2 className="text-xl font-bold mb-4">
//         {initialData ? 'Edit city' : 'Add New city'}
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
//         {/* district Selection Dropdown */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             District
//           </label>
//           <select
//             name="iDistric_id"
//             value={formData.iDistric_id}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//             required
//             disabled={loading || district.length === 0}
//           >
//             <option value="">
//               {district.length === 0 ? 'No city available' : 'Select Cities'}
//             </option>
//             {district.map(district => (
//               <option
//                 key={district.iDistric_id ||district.iDistric_id}
//                 value={district.iDistric_id || district.iDistric_id}
//               >
//                 {district.cDistrict_name || district.name || 'Unnamed cities'}
//               </option>
//             ))}
//           </select>
//           {districtError && (
//             <p className="mt-1 text-sm text-red-600">
//               Failed to load districts: {districtError.message}
//             </p>
//           )}
//         </div>

//         {/* cities Name Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Cities Name
//           </label>
//           <input
//             type="text"
//             name="cCity_name"
//             value={formData.cCity_name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//             required
//             disabled={loading}
//             placeholder="Enter City name"
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
//             disabled={loading || district.length === 0}
//             className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
//               loading || district.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CityForm;