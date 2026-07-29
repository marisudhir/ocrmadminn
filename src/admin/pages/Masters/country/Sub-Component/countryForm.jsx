import React, { useState, useEffect } from 'react';

const CountryForm = ({ initialData, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    cCountry_name: '',
    bactive: true,
    iCountry_id: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        cCountry_name: initialData.cCountry_name || '',
        bactive: initialData.bactive !== false,
        iCountry_id: initialData.iCountry_id || null
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cCountry_name.trim()) {
      newErrors.cCountry_name = 'Country name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country Name <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            name="cCountry_name"
            value={formData.cCountry_name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.cCountry_name ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
            maxLength={50}
          />
          {formData.cCountry_name.length===50&&(
            <p className="text-red-500 text-xs mt-1">
              Max length 50 characters
            </p>
          )}
          {errors.cCountry_name && (
            <p className="text-red-500 text-xs mt-1">{errors.cCountry_name}</p>
          )}
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="bactive"
            name="bactive"
            checked={formData.bactive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="bactive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CountryForm;


// import React, { useState, useEffect } from 'react';

// const CountryForm = ({ initialData, onSubmit, onClose, loading }) => {
//   const [formData, setFormData] = useState({
//     cCountry_name: '',
//     bactive: true,
//     iCountry_id: null
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         cCountry_name: initialData.cCountry_name || '',
//         bactive: initialData.bactive !== false,
//         iCountry_id: initialData.iCountry_id || null
//       });
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.cCountry_name.trim()) {
//       newErrors.cCountry_name = 'Country name is required';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     onSubmit(formData);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">
//           {formData.iCountry_id ? 'Edit Country' : 'Add Country'}
//         </h2>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           ✕
//         </button>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Country Name *
//           </label>
//           <input
//             type="text"
//             name="cCountry_name"
//             value={formData.cCountry_name}
//             onChange={handleChange}
//             className={`w-full p-2 border rounded ${errors.cCountry_name ? 'border-red-500' : 'border-gray-300'}`}
//             disabled={loading}
//           />
//           {errors.cCountry_name && (
//             <p className="text-red-500 text-xs mt-1">{errors.cCountry_name}</p>
//           )}
//         </div>

//         <div className="mb-4 flex items-center">
//           <input
//             type="checkbox"
//             id="bactive"
//             name="bactive"
//             checked={formData.bactive}
//             onChange={handleChange}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             disabled={loading}
//           />
//           <label htmlFor="bactive" className="ml-2 block text-sm text-gray-700">
//             Active
//           </label>
//         </div>

//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CountryForm;