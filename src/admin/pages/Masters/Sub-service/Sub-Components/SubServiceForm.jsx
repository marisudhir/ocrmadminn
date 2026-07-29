import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useServices } from "../../Services/useServices";
import { useSubService } from "../useSubService";

const SubServiceForm = ({ onClose, onSuccess, editData, companyId }) => {
  const { createLeadSubService, updateLeadSubService } = useSubService();
  const [formData, setFormData] = useState({
    subservice_name: "",
    serviceParent: "",
    icompany_id: companyId,
  });

  // Decode logged-in user from localStorage token
  const user = (() => {
    const token = localStorage.getItem("token"); 
    if (token) {
      try {
        return jwtDecode(token); 
      } catch (e) {
        console.error("Invalid token", e);
        return null;
      }
    }
    return null;
  })();

  // Fetch all services
  const { leadServices, fetchLeadServices } = useServices();

  useEffect(() => {
    if (companyId) {
      fetchLeadServices(companyId);
    }
  }, [companyId]);


  useEffect(() => {
    if (editData) {
      setFormData({
        subservice_name: editData.subservice_name || "",
        serviceParent: editData.service?.iservice_id || "", 
        icompany_id: editData.icompany_id || companyId,
      });
    }
  }, [editData]);

  const companyServices =
    leadServices?.filter((s) => Number(s.companyId) === Number(companyId)) ||
    [];

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.subservice_name) {
        alert("Subservice name is required");
        return;
      }

      const selectedService = companyServices.find(
        (s) => Number(s.serviceId) === Number(formData.serviceParent)
      );

      if (!selectedService) {
        alert("Please select a valid service");
        return;
      }

      if (editData) {
        // UPDATE (PUT)
        const payload = {
          subservice_name: formData.subservice_name,
          iservice_parent: Number(formData.serviceParent),
          updated_by: user?.user_id,
        };

        const success = await updateLeadSubService(editData.isubservice_id, payload);

        if (success) {
          onSuccess();
          onClose();
        }
      } else {
        // CREATE (POST)
        const payload = {
          subservice_name: formData.subservice_name,
          serviceParent: Number(formData.serviceParent),
          cost: Number(selectedService.cost || 0),
          createdBy: user?.user_id,
        };

        const success = await createLeadSubService(payload);

        if (success) {
          onSuccess();
          onClose();
        }
      }
    };

  return (
    <div>
      <h2 className="text-xl mb-4 font-semibold"> {editData ? "Edit" : "Create"} Sub Service </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service */}
        <div>
          <label className="block text-sm font-medium mb-1"> Service <span className="text-red-500">*</span> </label>
          <select  value={formData.serviceParent} onChange={(e) => setFormData({ ...formData, serviceParent: Number(e.target.value), })  } className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Service</option>
            {companyServices.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>  {service.serviceName} </option>
            ))}
          </select>
        </div>

        {/* Sub Service Name */}
        <div>
          <label className="block text-sm font-medium mb-1"> Sub Service Name <span className="text-red-500">*</span> </label>
          <input type="text" value={formData.subservice_name}
            onChange={(e) => setFormData({ ...formData, subservice_name: e.target.value })
            }
            className="w-full border p-2 rounded" required
            maxLength={50}
          />
          {formData.subservice_name.length===50 &&(
            <p className="text-red-500 text-xs mt-1">
              Max length 50 characters
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" > Cancel </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" > {editData ? "Update" : "Save"} </button>
        </div>
      </form>
    </div>
  );
};

export default SubServiceForm;



// import React, { useState, useEffect } from "react";
// import { jwtDecode } from 'jwt-decode';
// import { useServices } from "../../Services/useServices";
// import { useSubService } from "../useSubService";

// const SubServiceForm = ({ onClose, onSuccess, editData, companyId }) => {
//   const { createLeadSubService, updateLeadSubService } = useSubService();

//   const [formData, setFormData] = useState({
//     subservice_name: "",
//     serviceParent: "",
//     icompany_id: companyId,
//   });

//   // Decode logged-in user from localStorage token
//   const user = (() => {
//     const token = localStorage.getItem("token"); 
//     if (token) {
//       try {
//         return jwtDecode(token); 
//       } catch (e) {
//         console.error("Invalid token", e);
//         return null;
//       }
//     }
//     return null;
//   })();

//   // Fetch all services
//   const { leadServices, fetchLeadServices } = useServices();

//   useEffect(() => {
//     if (companyId) {
//       fetchLeadServices(companyId);
//     }
//   }, [companyId]);


//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         subservice_name: editData.subservice_name || "",
//         serviceParent: editData.service?.iservice_id || "", 
//         icompany_id: editData.icompany_id || companyId,
//       });
//     }
//   }, [editData]);

//   const companyServices =
//     leadServices?.filter((s) => Number(s.companyId) === Number(companyId)) ||
//     [];

//     const handleSubmit = async (e) => {
//       e.preventDefault();

//       if (!formData.subservice_name) {
//         alert("Subservice name is required");
//         return;
//       }

//       const selectedService = companyServices.find(
//         (s) => Number(s.serviceId) === Number(formData.serviceParent)
//       );

//       if (!selectedService) {
//         alert("Please select a valid service");
//         return;
//       }

//       if (editData) {
//         // UPDATE (PUT)
//         const payload = {
//           subservice_name: formData.subservice_name,
//           iservice_parent: Number(formData.serviceParent),
//           updated_by: user?.user_id,
//         };

//         const success = await updateLeadSubService(editData.isubservice_id, payload);

//         if (success) {
//           onSuccess();
//           onClose();
//         }
//       } else {
//         // CREATE (POST)
//         const payload = {
//           subservice_name: formData.subservice_name,
//           serviceParent: Number(formData.serviceParent),
//           cost: Number(selectedService.cost || 0),
//           createdBy: user?.user_id,
//         };

//         const success = await createLeadSubService(payload);

//         if (success) {
//           onSuccess();
//           onClose();
//         }
//       }
//     };

//   return (
//     <div>
//       <h2 className="text-xl mb-4 font-semibold"> {editData ? "Edit" : "Create"} Sub Service </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Service */}
//         <div>
//           <label className="block text-sm font-medium mb-1"> Service <span className="text-red-500">*</span> </label>
//           <select  value={formData.serviceParent} onChange={(e) => setFormData({ ...formData, serviceParent: Number(e.target.value), })  } className="w-full border p-2 rounded"
//             required
//           >
//             <option value="">Select Service</option>
//             {companyServices.map((service) => (
//               <option key={service.serviceId} value={service.serviceId}>  {service.serviceName} </option>
//             ))}
//           </select>
//         </div>

//         {/* Sub Service Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1"> Sub Service Name  </label>
//           <input type="text" value={formData.subservice_name}
//             onChange={(e) => setFormData({ ...formData, subservice_name: e.target.value })
//             }
//             className="w-full border p-2 rounded" required
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" > Cancel </button>
//           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" > {editData ? "Update" : "Save"} </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SubServiceForm;