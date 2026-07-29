import React, { useState, useEffect, useMemo } from "react";
export function LostReasonForm({ onSubmit, editData, onCancel, companyId, loading = false }) {
  const [lostReason, setLostReason] = useState("");
  const [formError, setFormError] = useState("");
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    if (editData) {
      setLostReason( editData.reason || editData.lostReason || editData.cLeadLostReason || "" );
    } else {
      setLostReason("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setBackendError("");

    if (!lostReason.trim()) {
      setFormError("Please enter a lost reason");
      return;
    }

    try {
      const payload = {
        lostReason: lostReason.trim(),
        companyId: Number(companyId) 
      };

      if (editData) {
        payload.lostReasonId = editData.lostReasonId || editData.ilead_lost_reason_id;
      }

      await onSubmit(payload);
      
    } catch (error) {
      setBackendError(
        error.response?.data?.message ||
        error.message ||
        "Failed to save lost reason"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg text-gray-800">  {editData ? "Edit Lost Reason" : "Create Lost Reason"} </h3>

      {formError && <div className="p-2 bg-red-100 text-red-700 rounded">{formError}</div>}
      {backendError && <div className="p-2 bg-red-100 text-red-700 rounded">{backendError}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1"> Lost Reason <span className="text-red-500">*</span> </label>
        <input
          className="p-3 w-full border rounded"
          value={lostReason}
          onChange={(e) => setLostReason(e.target.value)}
          placeholder="Enter lost reason"
          disabled={loading}
          maxLength={70}
        />
        {lostReason.length===70 &&(
          <p className="text-red-500 text-xs mt-1"> Max length 70 characters </p>
        )}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 p-2 rounded">  Cancel </button>
        <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded" disabled={loading}> {editData ? "Update" : "Create"} </button>
      </div>
    </form>
  );
}
 


// import React, { useState, useEffect, useMemo } from "react";
// export function LostReasonForm({ onSubmit, editData, onCancel, companyId, loading = false }) {
//   const [lostReason, setLostReason] = useState("");
//   const [formError, setFormError] = useState("");
//   const [backendError, setBackendError] = useState("");

//   useEffect(() => {
//     if (editData) {
//       setLostReason(
//         editData.reason ||
//         editData.lostReason ||
//         editData.cLeadLostReason ||
//         ""
//       );
//     } else {
//       setLostReason("");
//     }
//   }, [editData]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");
//     setBackendError("");

//     if (!lostReason.trim()) {
//       setFormError("Please enter a lost reason");
//       return;
//     }

//     try {
//       const payload = {
//         lostReason: lostReason.trim(),
//         companyId: Number(companyId) 
//       };

//       if (editData) {
//         payload.lostReasonId = editData.lostReasonId || editData.ilead_lost_reason_id;
//       }

//       await onSubmit(payload);
      
//     } catch (error) {
//       setBackendError(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to save lost reason"
//       );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg">
//       <h3 className="font-bold text-lg text-gray-800">  {editData ? "Edit Lost Reason" : "Create Lost Reason"} </h3>

//       {formError && <div className="p-2 bg-red-100 text-red-700 rounded">{formError}</div>}
//       {backendError && <div className="p-2 bg-red-100 text-red-700 rounded">{backendError}</div>}

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1"> Lost Reason <span className="text-red-500">*</span> </label>
//         <input
//           className="p-3 w-full border rounded"
//           value={lostReason}
//           onChange={(e) => setLostReason(e.target.value)}
//           placeholder="Enter lost reason"
//           disabled={loading}
//         />
//       </div>

//       <div className="flex gap-3">
//         <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 p-2 rounded">  Cancel </button>
//         <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded" disabled={loading}> {editData ? "Update" : "Create"} </button>
//       </div>
//     </form>
//   );
// }

