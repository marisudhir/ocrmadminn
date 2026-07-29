import React, { useState, useEffect, useMemo } from "react";
import { jwtDecode } from 'jwt-decode';
import { useSubSource } from "../useSubSource";
import { getAllLeadSource } from "../../Source/leadSourceModel";

const SubSourceForm = ({ onClose, onSuccess, editData = null, companyId }) => {
  const { createSubSource, updateSubSource } = useSubSource();
  const [allSources, setAllSources] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    ssub_src_name: "",
    isrc_id: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllLeadSource();
        if (Array.isArray(data)) {
          setAllSources(data);
        }
      } catch (err) {
        console.error("Error loading sources:", err);
      }
    };
    loadData();
  }, []);

  const filteredSources = useMemo(() => {
    if (!allSources.length || !companyId) return [];
    return allSources.filter(src => 
      Number(src.icompany_id) === Number(companyId) && src.is_active === true
    );
  }, [allSources, companyId]);

  useEffect(() => {
    if (editData) {
      setFormData({
        ssub_src_name: editData.ssub_src_name || "",
        isrc_id: editData.isrc_id || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");
    const decoded = token ? jwtDecode(token) : {};

    try {
      let success = false;

      if (editData) {
        const editPayload = {
          subSrcId: Number(editData.isub_src_id),   
          subSrcName: formData.ssub_src_name.trim(), 
          srcId: Number(formData.isrc_id),
          companyId: Number(companyId),
          icompany_id: Number(companyId),
          updatedBy: Number(decoded.user_id),
        };
        success = await updateSubSource(editPayload);
      } else {
        const createPayload = {
          subSrcName: formData.ssub_src_name.trim(),
          srcId: Number(formData.isrc_id),
          companyId: Number(companyId),
          icompany_id: Number(companyId),
          createdBy: Number(decoded.user_id),
          bactive: true
        };
        success = await createSubSource(createPayload);
      }

      if (success) {
        onSuccess(editData ? "Sub Source Updated" : "Sub Source Created");
        onClose();
      }
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-xl font-bold mb-6 text-gray-800"> 
        {editData ? "Edit Sub Source" : "Create Sub Source"} 
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2"> Parent Lead Source  <span className="text-red-500">*</span> </label>
          <select 
            value={formData.isrc_id} 
            onChange={(e) => setFormData({ ...formData, isrc_id: e.target.value })}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
            required
            disabled={submitting}
          >
            <option value="">-- Select Source --</option>
            {filteredSources.map((src) => (
              <option key={src.source_id} value={src.source_id}>
                {src.source_name}
              </option>
            ))}
          </select>
          {filteredSources.length === 0 && (
            <p className="text-xs text-red-500 mt-2 italic"> No active Lead Sources found for this company. </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2"> Sub Source Name <span className="text-red-500">*</span> </label>
          <input 
            type="text" 
            placeholder="Enter sub-source name"
            value={formData.ssub_src_name}
            onChange={(e) => setFormData({ ...formData, ssub_src_name: e.target.value })}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
            required
            disabled={submitting}
            maxLength={50}
          />
          {formData.ssub_src_name.length===50 && (
            <p className="text-red-500 text-xs mt-1">
             Max length 50 characters
           </p>
         )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"> Cancel </button>
          <button 
            type="submit" 
            disabled={submitting || filteredSources.length === 0}
            className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm disabled:bg-indigo-300 transition-all"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubSourceForm;



// import React, { useState, useEffect, useMemo } from "react";
// import { jwtDecode } from 'jwt-decode';
// import { useSubSource } from "../useSubSource";
// import { getAllLeadSource } from "../../Source/leadSourceModel";

// const SubSourceForm = ({ onClose, onSuccess, editData = null, companyId }) => {
//   const { createSubSource, updateSubSource } = useSubSource();
//   const [allSources, setAllSources] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState({
//     ssub_src_name: "",
//     isrc_id: "",
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await getAllLeadSource();
//         if (Array.isArray(data)) {
//           setAllSources(data);
//         }
//       } catch (err) {
//         console.error("Error loading sources:", err);
//       }
//     };
//     loadData();
//   }, []);

//   const filteredSources = useMemo(() => {
//     if (!allSources.length || !companyId) return [];
//     return allSources.filter(src => 
//       Number(src.icompany_id) === Number(companyId) && src.is_active === true
//     );
//   }, [allSources, companyId]);

//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         ssub_src_name: editData.ssub_src_name || "",
//         isrc_id: editData.isrc_id || "",
//       });
//     }
//   }, [editData]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     const token = localStorage.getItem("token");
//     const decoded = token ? jwtDecode(token) : {};

//     try {
//       let success = false;

//       if (editData) {
//         const editPayload = {
//           subSrcId: Number(editData.isub_src_id),   
//           subSrcName: formData.ssub_src_name.trim(), 
//           srcId: Number(formData.isrc_id),
//           companyId: Number(companyId),
//           icompany_id: Number(companyId),
//           updatedBy: Number(decoded.user_id),
//         };
//         success = await updateSubSource(editPayload);
//       } else {
//         const createPayload = {
//           subSrcName: formData.ssub_src_name.trim(),
//           srcId: Number(formData.isrc_id),
//           companyId: Number(companyId),
//           icompany_id: Number(companyId),
//           createdBy: Number(decoded.user_id),
//           bactive: true
//         };
//         success = await createSubSource(createPayload);
//       }

//       if (success) {
//         onSuccess(editData ? "Sub Source Updated" : "Sub Source Created");
//         onClose();
//       }
//     } catch (error) {
//       console.error("Submission Error:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white">
//       <h2 className="text-xl font-bold mb-6 text-gray-800"> 
//         {editData ? "Edit Sub Source" : "Create Sub Source"} 
//       </h2>
      
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block text-sm font-semibold text-gray-600 mb-2"> Parent Lead Source </label>
//           <select 
//             value={formData.isrc_id} 
//             onChange={(e) => setFormData({ ...formData, isrc_id: e.target.value })}
//             className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
//             required
//             disabled={submitting}
//           >
//             <option value="">-- Select Source --</option>
//             {filteredSources.map((src) => (
//               <option key={src.source_id} value={src.source_id}>
//                 {src.source_name}
//               </option>
//             ))}
//           </select>
//           {filteredSources.length === 0 && (
//             <p className="text-xs text-red-500 mt-2 italic"> No active Lead Sources found for this company. </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-600 mb-2"> Sub Source Name </label>
//           <input 
//             type="text" 
//             placeholder="Enter sub-source name"
//             value={formData.ssub_src_name}
//             onChange={(e) => setFormData({ ...formData, ssub_src_name: e.target.value })}
//             className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
//             required
//             disabled={submitting}
//           />
//         </div>

//         <div className="flex justify-end gap-3 pt-4">
//           <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"> Cancel </button>
//           <button 
//             type="submit" 
//             disabled={submitting || filteredSources.length === 0}
//             className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm disabled:bg-indigo-300 transition-all"
//           >
//             {submitting ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SubSourceForm;