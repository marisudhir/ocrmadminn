import React, { useState, useEffect } from 'react';
import { useProposalSentMode } from '../useProposalSentMode';
import { useToast } from '../../../../../context/ToastContext';
const ProposalSendMode = ({ initialData, onClose, onSuccess, companyId }) => {
  const [formData, setFormData] = useState({ name: '' });
  const {addProposalSentMode, updateProposalSentMode } = useProposalSentMode();
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
      });
    } else {
      setFormData({ name: "" });
    }
  }, [initialData]);


  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isSuccess = false;

    if (initialData) {
      // EDIT mode
      isSuccess = await updateProposalSentMode(
        formData,
        initialData.proposal_send_mode_id
      );
      if (isSuccess) {
        showToast("success", "Proposal Send Mode updated successfully!");
      } else {
        showToast("error", "Error updating Proposal Send Mode!");
      }
    } else {
      const payload = {
        ...formData,
        icompany_id: companyId 
      };

      isSuccess = await addProposalSentMode(payload);
      
      if (isSuccess) {
        showToast("success", "Proposal Send Mode created successfully!");
      } else {
        showToast("error", "Error creating Proposal Send Mode!");
      }
    }

    if (isSuccess) {
      onSuccess?.(); 
      onClose();     
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center  items-center z-50">

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-2xl"  >
        <h2 className="text-xl mb-4"> {initialData ? "Edit" : "Add"} Proposal send mode <span className="text-red-500">*</span> </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
         
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          
          <input type="text"
           name="name" 
           value={formData.name || ""} 
           onChange={handleChange} 
           placeholder="Enter Proposal Send Mode Name"
          className="border p-2 rounded w-full"
            maxLength={50}
          />
          {formData.name?.length === 50 && (
          <p className="text-red-500 text-xs mt-1">
             Max length 50 characters
         </p>
        )}
       </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button"onClick={() => { setFormData({ name: "" }); 
          onClose(); 
          }} className="bg-gray-500 text-white px-4 py-2 rounded" >
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" > Save </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalSendMode;


// import React, { useState, useEffect } from 'react';
// import { useProposalSentMode } from '../useProposalSentMode';
// import { useToast } from '../../../../../context/ToastContext';
// const ProposalSendMode = ({ initialData, onClose, onSuccess, companyId }) => {
//   const [formData, setFormData] = useState({ name: '' });
//   const {addProposalSentMode, updateProposalSentMode } = useProposalSentMode();
//   const { showToast } = useToast();

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name || "",
//       });
//     } else {
//       setFormData({ name: "" });
//     }
//   }, [initialData]);


//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let isSuccess = false;

//     if (initialData) {
//       // EDIT mode
//       isSuccess = await updateProposalSentMode(
//         formData,
//         initialData.proposal_send_mode_id
//       );
//       if (isSuccess) {
//         showToast("success", "Proposal Send Mode updated successfully!");
//       } else {
//         showToast("error", "Error updating Proposal Send Mode!");
//       }
//     } else {
//       const payload = {
//         ...formData,
//         icompany_id: companyId 
//       };

//       isSuccess = await addProposalSentMode(payload);
      
//       if (isSuccess) {
//         showToast("success", "Proposal Send Mode created successfully!");
//       } else {
//         showToast("error", "Error creating Proposal Send Mode!");
//       }
//     }

//     if (isSuccess) {
//       onSuccess?.(); 
//       onClose();     
//     }
//   };
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center  items-center z-50">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-2xl"  >
//         <h2 className="text-xl mb-4"> {initialData ? "Edit" : "Add"} Proposal send mode </h2>
//         <div className="grid grid-cols-2 gap-4">
//           <input type="text" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Enter Proposal Send Mode Name"
//             className="border p-2 rounded"
//           />
//         </div>
//         <div className="mt-4 flex justify-end gap-2">
//           <button type="button"onClick={() => { setFormData({ name: "" }); 
//           onClose(); 
//           }} className="bg-gray-500 text-white px-4 py-2 rounded" >
//             Cancel
//           </button>
//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" > Save </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProposalSendMode;