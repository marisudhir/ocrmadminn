import React, { useState, useEffect } from 'react';
import { useServices } from '../useServices';
import { toast } from 'react-toastify';
import { getUserIdFromToken } from '../../../../utils/tokenUtils';

const ServiceForm = ({ onClose, onSuccess, service, onUpdate, companyId }) => {
  const { createLeadServices } = useServices();
  const isEditing = !!service;
  const userId = getUserIdFromToken();
  const [formData, setFormData] = useState({
    serviceName: '',
    icompany_id: companyId
  });

  useEffect(() => {
    if (isEditing && service) {
      setFormData({
        serviceName: service.serviceName || service.cservice_name || '',
        icompany_id: companyId 
      });
    } else {
      setFormData(prev => ({
        ...prev,
        icompany_id: companyId
      }));
    }
  }, [isEditing, service, companyId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, serviceName: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.serviceName.trim()) {
      toast.error('Service name is required!');
      return;
    }

    if (!companyId) {
      toast.error('Target Company ID is missing!');
      return;
    }

    try {
      let success = false;
      if (isEditing) {
        const serviceId = service.serviceId || service.iservice_id;
        
        const updateData = {
          cservice_name: formData.serviceName.trim(),
          serviceName: formData.serviceName.trim(),
          icompany_id: companyId, 
          dupdated_dt: new Date().toISOString(),
          updated_by: userId
        };
        
        success = await onUpdate(serviceId, updateData);
      } else {
        const createData = {
          serviceName: formData.serviceName.trim(),
          cservice_name: formData.serviceName.trim(),
          icompany_id: companyId, 
          created_by: userId,
          dcreated_dt: new Date().toISOString()
        };

        success = await createLeadServices(createData);
      }

      if (success) {
        toast.success(`Service ${isEditing ? 'updated' : 'created'} successfully!`);
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Submission failed.');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4"> {isEditing ? 'Edit Lead Service' : 'Create Lead Service'} </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service name"
            required
            maxLength={50}
          />
          {formData.serviceName.length===50 &&(
            <p className='text-red-500 text-xs mt-1'>
              Max length 50 characters
            </p>
          )}
        </div>

        <div className='flex justify-center gap-4 mt-6'>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;


// import React, { useState, useEffect } from 'react';
// import { useServices } from '../useServices';
// import { toast } from 'react-toastify';
// import { getUserIdFromToken } from '../../../../utils/tokenUtils';

// const ServiceForm = ({ onClose, onSuccess, service, onUpdate, companyId }) => {
//   const { createLeadServices } = useServices();
//   const isEditing = !!service;
//   const userId = getUserIdFromToken();
//   const [formData, setFormData] = useState({
//     serviceName: '',
//     icompany_id: companyId
//   });

//   // Single effect to handle data initialization/syncing
//   useEffect(() => {
//     if (isEditing && service) {
//       setFormData({
//         serviceName: service.serviceName || service.cservice_name || '',
//         icompany_id: companyId 
//       });
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         icompany_id: companyId
//       }));
//     }
//   }, [isEditing, service, companyId]);

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, serviceName: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.serviceName.trim()) {
//       toast.error('Service name is required!');
//       return;
//     }

//     if (!companyId) {
//       toast.error('Target Company ID is missing!');
//       return;
//     }

//     try {
//       let success = false;
//       if (isEditing) {
//         const serviceId = service.serviceId || service.iservice_id;
        
//         const updateData = {
//           cservice_name: formData.serviceName.trim(),
//           serviceName: formData.serviceName.trim(),
//           icompany_id: companyId, 
//           dupdated_dt: new Date().toISOString(),
//           updated_by: userId
//         };
        
//         success = await onUpdate(serviceId, updateData);
//       } else {
//         const createData = {
//           serviceName: formData.serviceName.trim(),
//           cservice_name: formData.serviceName.trim(),
//           icompany_id: companyId, 
//           created_by: userId,
//           dcreated_dt: new Date().toISOString()
//         };

//         success = await createLeadServices(createData);
//       }

//       if (success) {
//         toast.success(`Service ${isEditing ? 'updated' : 'created'} successfully!`);
//         onSuccess?.();
//         onClose();
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//       toast.error('Submission failed.');
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-xl font-bold mb-4"> {isEditing ? 'Edit Lead Service' : 'Create Lead Service'} </h1>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium mb-1">Service Name</label>
//           <input
//             type="text"
//             value={formData.serviceName}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter service name"
//             required
//           />
//         </div>

//         <div className='flex justify-center gap-4 mt-6'>
//           <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
//             Cancel
//           </button>
//           <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
//             {isEditing ? 'Update' : 'Submit'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ServiceForm;
