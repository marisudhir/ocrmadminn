import React, { useState, useEffect, useMemo } from 'react';
import { useServices } from './useServices';
import ServiceForm from './Sub-Components/ServiceForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useSharedController } from '../../../api/shared/controller';
import formatDate from '../../../utils/formatDate';
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonTable from '../../../context/TableStructure/CommonTable';
import AddNewButton from '../../../context/commonbutton/AddNewButton';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';

const LeadServices = ({ companyId, onBack }) => {
  const { 
    createLeadServices, 
    updateLeadService, 
    deleteLeadService, 
    fetchLeadServices, 
    loading, 
    leadServices, 
    error,
  } = useServices();
    
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [controllerError, setControllerError] = useState(null);
  const [success, setSuccess] = useState(null);
  // const filteredServices = leadServices;

  // const filteredServices = useMemo(() => {
  //   if (!companyId) return [];

  //   return leadServices.filter(
  //     service => service.companyId === companyId
  //   );
  // }, [leadServices, companyId]);

const filteredServices = useMemo(() => {
  if (!companyId) return [];

  const filtered = leadServices.filter(
    service => service.icompany_id === companyId
  );

  return [...filtered].sort((a, b) => {
    const dateA = new Date(
      a.dupdated_at || a.dcreated_at
    ).getTime();

    const dateB = new Date(
      b.dupdated_at || b.dcreated_at
    ).getTime();

    return dateB - dateA;
  });

}, [leadServices, companyId]);


  // Clear messages after 5 seconds
  useEffect(() => {
    if (controllerError || success) {
      const timer = setTimeout(() => {
        setControllerError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [controllerError, success]);

  // Also clear controller errors
  useEffect(() => {
    if (error) {
      setControllerError(error);
    }
  }, [error]);

  useEffect(() => {
    if (companyId) {
      fetchLeadServices(companyId);
    }
  }, [companyId]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [leadServices.length]);
  useEffect(() => {
  setCurrentPage(1);
}, [filteredServices.length]);


  const showMessage = (message, type = 'error') => {
    if (type === 'error') {
      setControllerError(message);
    } else {
      setSuccess(message);
    }
  };
const itemsPerPage = 10;
const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
  indexOfFirstItem,
} = usePagination(filteredServices, itemsPerPage);

const serviceColumns = [
  {
    header: "Service Name",
    render: (row) => row.cservice_name || "Unknown",
  },
  {
    header: "Created At",
    render: (row) =>
      formatDate(row.dcreated_at) || "Unknown Date",
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleEdit(row)}
          disabled={loading}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-indigo-600" />
        </button>

        <button
          onClick={() => handleDelete(row)}
          disabled={loading}
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];



  // Handle edit service
  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  // Handle delete service
  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.serviceName}"?`)) {
      return;
    }

    // const serviceId = service.serviceId || service.iservice_id;
    const serviceId = service.iservice_id;

    
    if (!serviceId) {
      toast.error("Service ID not found!");
      console.error('Service ID not found in:', service);
      return;
    }    
    const success = await deleteLeadService(serviceId);
    if (success) {
      toast.success("Lead service deleted successfully!");
    } else {
      toast.error("Failed to delete lead service!");
    }
  };

  // Handle form success (both create and update)
  const handleFormSuccess = () => {
    fetchLeadServices(companyId);
    setShowForm(false);
    setEditingService(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead service data...</p>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
    <div className={companyId ? "font-sans antialiased" : "min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased"}>
      <div className="max-w-9xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          {companyId ? (
            <CommonBackButton title="Lead Services" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Lead Services </h1>
          )}
          <AddNewButton
            label="+ Add Lead Service"
            onClick={() => { setEditingService(null); setShowForm(true); }}
            disabled={loading}
          />
        </div>
  
        {/* Error and Success Messages */}
        {controllerError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{controllerError}</span>
            </div>
            <button onClick={() => setControllerError(null)} className="text-red-600 hover:text-red-800 font-bold text-lg" > × </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">{success}</span>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800 font-bold text-lg" >
              ×
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {loading && ' (Loading...)'}
        </div>

        {/* Renders the form according to the state */}
        {/* {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <ServiceForm 
                onClose={() => { setShowForm(false); 
                  setEditingService(null); }} 
                onSuccess={handleFormSuccess}
                service={editingService}
                onUpdate={updateLeadService}
                companyId={companyId}
              />
            </div>
          </div>
        )} */}
 {showForm && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    onClick={(e) => {
      // 👇 outside click only
      if (e.target === e.currentTarget) {
        setShowForm(false);
        setEditingService(null);
      }
    }}
  >
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
      <ServiceForm
        onClose={() => {
          setShowForm(false);
          setEditingService(null);
        }}
        onSuccess={handleFormSuccess}
        service={editingService}
        onUpdate={updateLeadService}
        companyId={companyId}
      />
    </div>
  </div>
)}

        {/* Lead Services Table */}
     <CommonTable
  columns={serviceColumns}
  data={currentItems}
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
/>
            <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      </div>
    </div>
  );
};

export default LeadServices;

// import React, { useState, useEffect, useMemo } from 'react';
// import { useServices } from './useServices';
// import ServiceForm from './Sub-Components/ServiceForm';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; 
// import { useSharedController } from '../../../api/shared/controller';
// import formatDate from '../../../utils/formatDate';
// import Pagination from '../../../context/Pagination/pagination';
// import usePagination from '../../../hooks/usePagination';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CommonTable from '../../../context/TableStructure/CommonTable';

// const LeadServices = ({ companyId }) => {
//   const { 
//     createLeadServices, 
//     updateLeadService, 
//     deleteLeadService, 
//     fetchLeadServices, 
//     loading, 
//     leadServices, 
//     error,
//   } = useServices();
    
//   const [showForm, setShowForm] = useState(false);
//   const [editingService, setEditingService] = useState(null);

//   const [controllerError, setControllerError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   // const filteredServices = leadServices;

//   // const filteredServices = useMemo(() => {
//   //   if (!companyId) return [];

//   //   return leadServices.filter(
//   //     service => service.companyId === companyId
//   //   );
//   // }, [leadServices, companyId]);

// const filteredServices = useMemo(() => {
//   if (!companyId) return [];

//   const filtered = leadServices.filter(
//     service => service.companyId === companyId
//   );

//   return [...filtered].sort((a, b) => {
//     const dateA = new Date(
//       a.updatedAt || a.dupdated_dt || a.createdAt || a.dcreated_dt
//     ).getTime();

//     const dateB = new Date(
//       b.updatedAt || b.dupdated_dt || b.createdAt || b.dcreated_dt
//     ).getTime();

//     return dateB - dateA;
//   });

// }, [leadServices, companyId]);


//   // Clear messages after 5 seconds
//   useEffect(() => {
//     if (controllerError || success) {
//       const timer = setTimeout(() => {
//         setControllerError(null);
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [controllerError, success]);

//   // Also clear controller errors
//   useEffect(() => {
//     if (error) {
//       setControllerError(error);
//     }
//   }, [error]);

//   useEffect(() => {
//     if (companyId) {
//       fetchLeadServices(companyId);
//     }
//   }, [companyId]);

//   // useEffect(() => {
//   //   setCurrentPage(1);
//   // }, [leadServices.length]);
//   useEffect(() => {
//   setCurrentPage(1);
// }, [filteredServices.length]);


//   const showMessage = (message, type = 'error') => {
//     if (type === 'error') {
//       setControllerError(message);
//     } else {
//       setSuccess(message);
//     }
//   };
// const itemsPerPage = 10;
// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
//   indexOfFirstItem,
// } = usePagination(filteredServices, itemsPerPage);

// const serviceColumns = [
//   {
//     header: "Service Name",
//     render: (row) => row.serviceName || "Unknown",
//   },
//   {
//     header: "Created At",
//     render: (row) =>
//       formatDate(row.createdAt || row.dcreated_dt) || "Unknown Date",
//   },
//   {
//     header: "Actions",
//     render: (row) => (
//       <div className="flex justify-center gap-2">
//         <button
//           onClick={() => handleEdit(row)}
//           disabled={loading}
//           title="Edit"
//         >
//           <EditIcon fontSize="small" className="text-indigo-600" />
//         </button>

//         <button
//           onClick={() => handleDelete(row)}
//           disabled={loading}
//           title="Delete"
//         >
//           <DeleteIcon fontSize="small" className="text-red-600" />
//         </button>
//       </div>
//     ),
//   },
// ];


//   // Handle edit service
//   const handleEdit = (service) => {
//     setEditingService(service);
//     setShowForm(true);
//   };

//   // Handle delete service
//   const handleDelete = async (service) => {
//     if (!window.confirm(`Are you sure you want to delete "${service.serviceName}"?`)) {
//       return;
//     }

//     const serviceId = service.serviceId || service.iservice_id;
    
//     if (!serviceId) {
//       toast.error("Service ID not found!");
//       console.error('Service ID not found in:', service);
//       return;
//     }    
//     const success = await deleteLeadService(serviceId);
//     if (success) {
//       toast.success("Lead service deleted successfully!");
//     } else {
//       toast.error("Failed to delete lead service!");
//     }
//   };

//   // Handle form success (both create and update)
//   const handleFormSuccess = () => {
//     fetchLeadServices(companyId);
//     setShowForm(false);
//     setEditingService(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg">Loading lead service data...</p>
//       </div>
//     );
//   }

//   return (
//     // <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
//     <div className="min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased">
//       <div className="max-w-9xl mx-auto">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Lead Services </h1>
//           <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
//              onClick={() => { setEditingService(null); setShowForm(true); }} disabled={loading}
//           >
//            + Add Lead Service
//           </button>
//         </div>
  
//         {/* Error and Success Messages */}
//         {controllerError && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <span className="text-red-800 font-medium">{controllerError}</span>
//             </div>
//             <button onClick={() => setControllerError(null)} className="text-red-600 hover:text-red-800 font-bold text-lg" > × </button>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span className="text-green-800 font-medium">{success}</span>
//             </div>
//             <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800 font-bold text-lg" >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Results Count */}
//         <div className="mb-4 text-sm text-gray-600">
//           {loading && ' (Loading...)'}
//         </div>

//         {/* Renders the form according to the state */}
//         {/* {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
//             <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
//               <ServiceForm 
//                 onClose={() => { setShowForm(false); 
//                   setEditingService(null); }} 
//                 onSuccess={handleFormSuccess}
//                 service={editingService}
//                 onUpdate={updateLeadService}
//                 companyId={companyId}
//               />
//             </div>
//           </div>
//         )} */}
//         {showForm && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//             onClick={(e) => {
//               // 👇 outside click only
//               if (e.target === e.currentTarget) {
//                 setShowForm(false);
//                 setEditingService(null);
//               }
//             }}
//           >
//             <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
//               <ServiceForm
//                 onClose={() => {
//                   setShowForm(false);
//                   setEditingService(null);
//                 }}
//                 onSuccess={handleFormSuccess}
//                 service={editingService}
//                 onUpdate={updateLeadService}
//                 companyId={companyId}
//               />
//             </div>
//           </div>
//         )}

//         {/* Lead Services Table */}
//      <CommonTable
//       columns={serviceColumns}
//       data={currentItems}
//       currentPage={currentPage}
//       itemsPerPage={itemsPerPage}
//     />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               setCurrentPage={setCurrentPage}
//             />
//       </div>
//     </div>
//   );
// };

// export default LeadServices;



