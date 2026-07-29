import React, { useState, useEffect } from 'react';

const DurationForm = ({ initialData = {}, onSubmit, onClose, loading, error }) => {
  const [formData, setFormData] = useState({
    plan_duration_id: null,
    duration_in_months: "",
    bactive: true
  });

  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        plan_duration_id: initialData.plan_duration_id || null,
        duration_in_months: initialData.duration_in_months || "",
        bactive: initialData.bactive ?? true
      });
    }
  }, [initialData]);

  // Clear local error when form data changes
  useEffect(() => {
    if (localError) {
      setLocalError("");
    }
    if (errors.duration_in_months) {
      setErrors({});
    }
  }, [formData.duration_in_months]);

  // Handle prop error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const validate = () => {
    const newErrors = {};

    if (!formData.duration_in_months) {
      newErrors.duration_in_months = "Duration is required";
    } else if (isNaN(formData.duration_in_months) || Number(formData.duration_in_months) <= 0) {
      newErrors.duration_in_months = "Duration must be a positive number";
    } else if (!Number.isInteger(Number(formData.duration_in_months))) {
      newErrors.duration_in_months = "Duration must be a whole number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(""); 
    
    if (!validate()) return;

    const submitData = {
      ...formData,
      duration_in_months: Number(formData.duration_in_months)
    };

    console.log('Submitting duration data:', submitData);
    onSubmit(submitData);
  };

  const handleClose = () => {
    setLocalError("");
    setErrors({});
    onClose();
  };

  return (
    // <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}  >
     <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"  onClick={(e) => e.stopPropagation()}  >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {formData.plan_duration_id ? "Edit Duration" : "Add Duration"}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ×
        </button>
      </div>

    


      {/* Error Display */}
      {localError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm font-medium">{localError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Duration Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1"> Duration (Months) <span className="text-red-500">*</span> </label>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.duration_in_months}
            onChange={(e) =>
              setFormData({ ...formData, duration_in_months: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.duration_in_months ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter duration in months"
            disabled={loading}
          />
          {errors.duration_in_months && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.duration_in_months}
            </p>
          )}
        </div>

        {/* Status Toggle (if needed for edit) */}
        {formData.plan_duration_id && (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.bactive}
                onChange={(e) =>
                  setFormData({ ...formData, bactive: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500">
        <p>• Duration must be a positive whole number (e.g., 1, 6, 12)</p>
      </div>
    </div>
    </div>
  );
};

export default DurationForm;


// import React, { useState, useEffect } from 'react';

// const DurationForm = ({ initialData = {}, onSubmit, onClose, loading, error }) => {
//   const [formData, setFormData] = useState({
//     plan_duration_id: null,
//     duration_in_months: "",
//     bactive: true
//   });

//   const [errors, setErrors] = useState({});
//   const [localError, setLocalError] = useState("");

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         plan_duration_id: initialData.plan_duration_id || null,
//         duration_in_months: initialData.duration_in_months || "",
//         bactive: initialData.bactive ?? true
//       });
//     }
//   }, [initialData]);

//   // Clear local error when form data changes
//   useEffect(() => {
//     if (localError) {
//       setLocalError("");
//     }
//     if (errors.duration_in_months) {
//       setErrors({});
//     }
//   }, [formData.duration_in_months]);

//   // Handle prop error changes
//   useEffect(() => {
//     if (error) {
//       setLocalError(error);
//     }
//   }, [error]);

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.duration_in_months) {
//       newErrors.duration_in_months = "Duration is required";
//     } else if (isNaN(formData.duration_in_months) || Number(formData.duration_in_months) <= 0) {
//       newErrors.duration_in_months = "Duration must be a positive number";
//     } else if (!Number.isInteger(Number(formData.duration_in_months))) {
//       newErrors.duration_in_months = "Duration must be a whole number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLocalError(""); // Clear previous errors
    
//     if (!validate()) return;

//     const submitData = {
//       ...formData,
//       duration_in_months: Number(formData.duration_in_months)
//     };

//     console.log('Submitting duration data:', submitData);
//     onSubmit(submitData);
//   };

//   const handleClose = () => {
//     setLocalError("");
//     setErrors({});
//     onClose();
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">
//           {formData.plan_duration_id ? "Edit Duration" : "Add Duration"}
//         </h2>
//         <button onClick={handleClose}  className="text-gray-500 hover:text-gray-700 text-lg font-bold" >
//           ×
//         </button>
//       </div>

//       {/* Error Display */}
//       {localError && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span className="text-red-700 text-sm font-medium">{localError}</span>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Duration Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Duration (Months) <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             min="1"
//             step="1"
//             value={formData.duration_in_months}
//             onChange={(e) =>
//               setFormData({ ...formData, duration_in_months: e.target.value })
//             }
//             className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               errors.duration_in_months ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Enter duration in months"
//             disabled={loading}
//           />
//           {errors.duration_in_months && (
//             <p className="text-red-500 text-xs mt-1 flex items-center">
//               <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               {errors.duration_in_months}
//             </p>
//           )}
//         </div>

//         {/* Status Toggle (if needed for edit) */}
//         {formData.plan_duration_id && (
//           <div>
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={formData.bactive}
//                 onChange={(e) =>
//                   setFormData({ ...formData, bactive: e.target.checked })
//                 }
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 disabled={loading}
//               />
//               <span className="text-sm text-gray-700">Active</span>
//             </label>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={loading}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {loading ? (
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Saving...
//               </div>
//             ) : (
//               'Save'
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Help Text */}
//       <div className="mt-4 text-xs text-gray-500">
//         <p>• Duration must be a positive whole number (e.g., 1, 6, 12)</p>
//       </div>
//     </div>
//   );
// };

// export default DurationForm;