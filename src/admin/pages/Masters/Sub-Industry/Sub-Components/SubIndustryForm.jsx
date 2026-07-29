import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useSubIndustry } from "../useSubIndustry";
import { getAllIndustry } from "../../Industry/industryModel"; 

const SubIndustryForm = ({ onClose, onSuccess, editData = null, companyId }) => {
  const { createSubIndustry, updateSubIndustry } = useSubIndustry();
  const [industries, setIndustries] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subindustryName: "",
    industryParent: "",
  });

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        console.log("Fetching industries for companyId:", companyId);
        const res = await getAllIndustry(); 
        const industryList = Array.isArray(res) ? res : (res?.data || []);

        if (companyId) {
          const filtered = industryList.filter(
            ind => Number(ind.icompany_id) === Number(companyId)
          );
          setIndustries(filtered);
        } else {
          setIndustries(industryList);
        }
      } catch (err) {
        console.error("Failed to load industries", err);
      }
    };
    fetchIndustries();
  }, [companyId]);

  useEffect(() => {
    if (editData) {
      setFormData({
        subindustryName: editData.subindustry_name || "",
        industryParent: editData.iindustry_parent || "",
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
        success = await updateSubIndustry({
          subIndustryId: Number(editData.isubindustry),
          subindustryName: formData.subindustryName.trim(),
          updated_by: Number(decoded.user_id),
        });
      } else {
        success = await createSubIndustry({
          subindustryName: formData.subindustryName.trim(),
          industryParent: Number(formData.industryParent),
          createdBy: Number(decoded.user_id),
        });
      }
      if (success) { onSuccess(); onClose(); }
    } catch (err) {
      console.error("Form error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
        {editData ? "Edit Sub Industry" : "Add Sub Industry"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {!editData && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Industry<span className="text-red-500">*</span></label>
            <select
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.industryParent}
              onChange={(e) => setFormData({ ...formData, industryParent: e.target.value })}
            >
              <option value="">-- Select Industry --</option>
              {industries.map((ind) => (
                <option key={ind.iindustry_id} value={ind.iindustry_id}>{ind.cindustry_name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Industry Name <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.subindustryName}
            onChange={(e) => setFormData({ ...formData, subindustryName: e.target.value })}
            maxLength={50}
          />
          {formData.subindustryName.length===50 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 50 characters
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
          <button
            type="submit"
            disabled={submitting || (!editData && industries.length === 0)}
            className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 shadow-md"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubIndustryForm;


// import React, { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useSubIndustry } from "../useSubIndustry";
// import { getAllIndustry } from "../../Industry/industryModel"; 

// const SubIndustryForm = ({ onClose, onSuccess, editData = null, companyId }) => {
//   const { createSubIndustry, updateSubIndustry } = useSubIndustry();
//   const [industries, setIndustries] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     subindustryName: "",
//     industryParent: "",
//   });

//   useEffect(() => {
//     const fetchIndustries = async () => {
//       try {
//         console.log("Fetching industries for companyId:", companyId);
//         const res = await getAllIndustry(); 
//         const industryList = Array.isArray(res) ? res : (res?.data || []);

//         if (companyId) {
//           const filtered = industryList.filter(
//             ind => Number(ind.icompany_id) === Number(companyId)
//           );
//           setIndustries(filtered);
//         } else {
//           setIndustries(industryList);
//         }
//       } catch (err) {
//         console.error("Failed to load industries", err);
//       }
//     };
//     fetchIndustries();
//   }, [companyId]);

//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         subindustryName: editData.subindustry_name || "",
//         industryParent: editData.iindustry_parent || "",
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
//         success = await updateSubIndustry({
//           subIndustryId: Number(editData.isubindustry),
//           subindustryName: formData.subindustryName.trim(),
//           updated_by: Number(decoded.user_id),
//         });
//       } else {
//         success = await createSubIndustry({
//           subindustryName: formData.subindustryName.trim(),
//           industryParent: Number(formData.industryParent),
//           createdBy: Number(decoded.user_id),
//         });
//       }
//       if (success) { onSuccess(); onClose(); }
//     } catch (err) {
//       console.error("Form error:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white">
//       <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
//         {editData ? "Edit Sub Industry" : "Add Sub Industry"}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         {!editData && (
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Industry</label>
//             <select
//               required
//               className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               value={formData.industryParent}
//               onChange={(e) => setFormData({ ...formData, industryParent: e.target.value })}
//             >
//               <option value="">-- Select Industry --</option>
//               {industries.map((ind) => (
//                 <option key={ind.iindustry_id} value={ind.iindustry_id}>{ind.cindustry_name}</option>
//               ))}
//             </select>
//           </div>
//         )}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Industry Name</label>
//           <input
//             required
//             type="text"
//             className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             value={formData.subindustryName}
//             onChange={(e) => setFormData({ ...formData, subindustryName: e.target.value })}
//           />
//         </div>
//         <div className="flex justify-end gap-3 pt-4">
//           <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
//           <button
//             type="submit"
//             disabled={submitting || (!editData && industries.length === 0)}
//             className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 shadow-md"
//           >
//             {submitting ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SubIndustryForm;