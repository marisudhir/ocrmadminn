import React, { useState, useEffect } from 'react';

const CurrencyForm = ({ onClose, onSuccess, initialData = null, loading }) => {
  const [formData, setFormData] = useState({
    country_name: '',
    currency_code: '',
    currency_name: '',
    symbol: '',
    bactive: true
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form if editing
  useEffect(() => {
    if (initialData && initialData.icurrency_id) {
      setFormData({
        icurrency_id: initialData.icurrency_id,
        country_name: initialData.country_name || '',
        currency_code: initialData.currency_code || '',
        currency_name: initialData.currency_name || '',
        symbol: initialData.symbol || '',
      });
    } else {
      setFormData({
        country_name: '',
        currency_code: '',
        currency_name: '',
        // currency_name: '',
        symbol: '',
      });
    }
  }, [initialData]);

  const clearMessages = () => {
    setSuccessMessage('');
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country_name?.trim()) {
      newErrors.country_name = 'Country Name is mandatory.';
    } else if (formData.country_name.length > 50) {
      newErrors.country_name = 'Country Name cannot exceed 50 characters.';
    }

    if (!formData.currency_code?.trim()) {
      newErrors.currency_code = 'Currency Code is mandatory.';
    } else if (formData.currency_code.length > 50) {
      newErrors.currency_code = 'Currency Code cannot exceed 50 characters.';
    }

    if (!formData.currency_name?.trim()) {
      newErrors.currency_name = 'Currency Name is mandatory.';
    } else if (formData.currency_name.length > 50) {
      newErrors.currency_name = 'Currency Name cannot exceed 50 characters.';
    }

    if (!formData.symbol?.trim()) {
      newErrors.symbol = 'Symbol is mandatory.';
    } else if (formData.symbol.length > 10) {
      newErrors.symbol = 'Symbol cannot exceed 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!validateForm()) return;

    try {
      await onSuccess(formData);
      setSuccessMessage(
        `Currency ${
          initialData && initialData.icurrency_id ? 'updated' : 'created'
        } successfully!`
      );
      setTimeout(() => {
        clearMessages();
        onClose?.();
      }, 2000);
    } catch (error) {
      console.error('Form submission failed:', error);
      setErrors({
        api:
          error.response?.data?.message ||
          'Operation failed. Please try again.',
      });
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
        {initialData && initialData.icurrency_id
          ? 'Edit Currency'
          : 'Add New Currency'}
      </h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
          {successMessage}
        </div>
      )}
      {errors.api && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">  Country Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country_name"
            value={formData.country_name}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.country_name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            placeholder="Enter country name"
            maxLength={50}
          />
           {formData.country_name?.length === 50 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 50 characters
            </p>
          )}
          {errors.country_name && (
            <p className="text-red-500 text-xs mt-1">{errors.country_name}</p>
          )}
        </div>

        {/* Currency Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency Code<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="currency_code"
            value={formData.currency_code}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.currency_code ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            placeholder="e.g., INR, USD"
            maxLength={4}
          />
           {formData.currency_code?.length === 4 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 4 characters
            </p>
          )}
          {errors.currency_code && (
            <p className="text-red-500 text-xs mt-1">{errors.currency_code}</p>
          )}
        </div>

        {/* Currency Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1"> Currency Name<span className="text-red-500">*</span>  </label>
          <input
            type="text"
            name="currency_name"
            value={formData.currency_name}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.currency_name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            placeholder="e.g., Indian Rupee"
            maxLength={30}
          />
          {formData.currency_name?.length === 30 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 30 characters
            </p>
          )}
          {errors.currency_name && (
            <p className="text-red-500 text-xs mt-1">{errors.currency_name}</p>
          )}
        </div>

        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symbol<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 ${
              errors.symbol ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            placeholder="e.g., ₹"
            maxLength={4}
          />
          {formData.symbol?.length === 4 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 4 characters
            </p>
          )}
          {errors.symbol && (
            <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>
          )}
        </div>

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
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
    </div>
    
  );
};

export default CurrencyForm;


// import React, { useState, useEffect } from 'react';

// const CurrencyForm = ({ onClose, onSuccess, initialData = null, loading }) => {
//   const [formData, setFormData] = useState({
//     country_name: '',
//     currency_code: '',
//     currency_name: '',
//     symbol: '',
//     bactive: true
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errors, setErrors] = useState({});

//   // Initialize form if editing
//   useEffect(() => {
//     if (initialData && initialData.icurrency_id) {
//       setFormData({
//         icurrency_id: initialData.icurrency_id,
//         country_name: initialData.country_name || '',
//         currency_code: initialData.currency_code || '',
//         currency_name: initialData.currency_name || '',
//         symbol: initialData.symbol || '',
//       });
//     } else {
//       setFormData({
//         country_name: '',
//         currency_code: '',
//         currency_name: '',
//         // currency_name: '',
//         symbol: '',
//       });
//     }
//   }, [initialData]);

//   const clearMessages = () => {
//     setSuccessMessage('');
//     setErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.country_name?.trim()) {
//       newErrors.country_name = 'Country Name is mandatory.';
//     } else if (formData.country_name.length > 50) {
//       newErrors.country_name = 'Country Name cannot exceed 50 characters.';
//     }

//     if (!formData.currency_code?.trim()) {
//       newErrors.currency_code = 'Currency Code is mandatory.';
//     } else if (formData.currency_code.length > 50) {
//       newErrors.currency_code = 'Currency Code cannot exceed 50 characters.';
//     }

//     if (!formData.currency_name?.trim()) {
//       newErrors.currency_name = 'Currency Name is mandatory.';
//     } else if (formData.currency_name.length > 50) {
//       newErrors.currency_name = 'Currency Name cannot exceed 50 characters.';
//     }

//     if (!formData.symbol?.trim()) {
//       newErrors.symbol = 'Symbol is mandatory.';
//     } else if (formData.symbol.length > 10) {
//       newErrors.symbol = 'Symbol cannot exceed 10 characters.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     clearMessages();

//     if (!validateForm()) return;

//     try {
//       await onSuccess(formData);
//       setSuccessMessage(
//         `Currency ${
//           initialData && initialData.icurrency_id ? 'updated' : 'created'
//         } successfully!`
//       );
//       setTimeout(() => {
//         clearMessages();
//         onClose?.();
//       }, 2000);
//     } catch (error) {
//       console.error('Form submission failed:', error);
//       setErrors({
//         api:
//           error.response?.data?.message ||
//           'Operation failed. Please try again.',
//       });
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//       <h2 className="text-xl font-bold mb-4">
//         {initialData && initialData.icurrency_id
//           ? 'Edit Currency'
//           : 'Add New Currency'}
//       </h2>

//       {successMessage && (
//         <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
//           {successMessage}
//         </div>
//       )}
//       {errors.api && (
//         <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
//           {errors.api}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Country Name Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Country Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="country_name"
//             value={formData.country_name}
//             onChange={handleChange}
//             className={`w-full border rounded-md p-2 ${
//               errors.country_name ? 'border-red-500' : 'border-gray-300'
//             }`}
//             disabled={loading}
//             placeholder="Enter country name"
//             maxLength={50}
//           />
//           {errors.country_name && (
//             <p className="text-red-500 text-xs mt-1">{errors.country_name}</p>
//           )}
//         </div>

//         {/* Currency Code Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Currency Code<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="currency_code"
//             value={formData.currency_code}
//             onChange={handleChange}
//             className={`w-full border rounded-md p-2 ${
//               errors.currency_code ? 'border-red-500' : 'border-gray-300'
//             }`}
//             disabled={loading}
//             placeholder="e.g., INR, USD"
//             maxLength={50}
//           />
//           {errors.currency_code && (
//             <p className="text-red-500 text-xs mt-1">{errors.currency_code}</p>
//           )}
//         </div>

//         {/* Currency Name Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Currency Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="currency_name"
//             value={formData.currency_name}
//             onChange={handleChange}
//             className={`w-full border rounded-md p-2 ${
//               errors.currency_name ? 'border-red-500' : 'border-gray-300'
//             }`}
//             disabled={loading}
//             placeholder="e.g., Indian Rupee"
//             maxLength={50}
//           />
//           {errors.currency_name && (
//             <p className="text-red-500 text-xs mt-1">{errors.currency_name}</p>
//           )}
//         </div>

//         {/* Symbol Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Symbol<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="symbol"
//             value={formData.symbol}
//             onChange={handleChange}
//             className={`w-full border rounded-md p-2 ${
//               errors.symbol ? 'border-red-500' : 'border-gray-300'
//             }`}
//             disabled={loading}
//             placeholder="e.g., ₹"
//             maxLength={10}
//           />
//           {errors.symbol && (
//             <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>
//           )}
//         </div>

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
//             disabled={loading}
//             className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
//               loading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CurrencyForm;