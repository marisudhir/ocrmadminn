import React, { useState, useEffect, useMemo,  useRef } from 'react';
import LeadPotentialForm from './Sub-Components/leadPotentialForm';
import { useLeadPotentialController } from './leadPotentialController';
import formatDate from '../../../utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';

const LeadPotential = ({ companyId, onBack }) => {
  const {
    leadPotential,
    fetchLeadPotential,
    loading,
    error,
    deletePotential
  } = useLeadPotentialController();

  const [showForm, setShowForm] = useState(false);
  const [editingPotential, setEditingPotential] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && companyId) {
      fetchLeadPotential();
      hasFetched.current = true;  
    }
  }, [companyId]);


  // Fetch on mount
  useEffect(() => {
      fetchLeadPotential();
    }, []);

  

  const filteredLeadPotential = useMemo(() => {
  if (!leadPotential || !companyId) return [];

  const filtered = leadPotential.filter(
    p =>
      p.bactive !== false &&
      p.icompany_id === companyId
  );

  // latest created first
  return [...filtered].sort((a, b) => {
    return new Date(b.dcreated_dt).getTime() -
           new Date(a.dcreated_dt).getTime();
  });

}, [leadPotential, companyId]);

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredLeadPotential, itemsPerPage);

const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

const leadPotentialColumns = [
  {
    header: "Status Name",
    render: (row) => row.clead_name || "Unknown",
  },
  {
    header: "Created At",
    render: (row) =>
      formatDate(row.dcreated_dt) || "Unknown Date",
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleEdit(row)}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button
          onClick={() => handleDelete(row.ileadpoten_id)}
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  // Delete handler
  const handleDelete = async (id) => {
    if (!id) {
      alert("Error: Cannot delete - missing lead potential ID");
      return;
    }

    if (window.confirm('Are you sure you want to delete this lead potential?')) {
      const success = await deletePotential(id);
      if (success) {
        alert('Lead potential deleted successfully!');
      } else {
        alert('Failed to delete lead potential!');
      }
    }
  };

  // Edit handler
  const handleEdit = (potential) => {
    setEditingPotential(potential);
    setShowForm(true);
  };

  // Close form modal
  const handleFormClose = () => {
    setShowForm(false);
    setEditingPotential(null);
  };

  // After successful create/update, refresh list & close form
  // const handleFormSuccess = () => {
  //   fetchLeadPotential();
  //   handleFormClose();
  // };

const handleFormSuccess = () => {
  fetchLeadPotential();
  setCurrentPage(1);   
  handleFormClose();
};



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead potential data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 text-lg">Error: {error.message || "Failed to fetch data."}</p>
      </div>
    );
  }

  return (
        <div className={companyId ? "font-sans antialiased" : "min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased"}>
       <div className="max-w-9xl mx-auto">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4"> 
          {companyId ? (
            <CommonBackButton title="Lead Potential" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Lead Potential </h1>
          )}

         <button
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(true)}
          >
            + Add Lead Potential
          </button>
        </div>

        {/* Form Modal */}
        {/* {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <LeadPotentialForm 
                onClose={handleFormClose} 
                onSuccess={handleFormSuccess} 
                editData={editingPotential}
                companyId={companyId}         
              />
            </div>
          </div>
        )} */}

             {showForm && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    onClick={handleFormClose}
  >
    <div
      className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4"
      onClick={(e) => e.stopPropagation()} 
    >
      <LeadPotentialForm 
        onClose={handleFormClose} 
        onSuccess={handleFormSuccess} 
        editData={editingPotential}
        companyId={companyId}         
      />
    </div>
  </div>
)}

        {/* Lead Potential Table */}
       <CommonTable
        columns={leadPotentialColumns}
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
}

export default LeadPotential;


// import React, { useState, useEffect, useMemo,  useRef } from 'react';
// import LeadPotentialForm from './Sub-Components/leadPotentialForm';
// import { useLeadPotentialController } from './leadPotentialController';
// import formatDate from '../../../utils/formatDate';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Pagination from '../../../context/Pagination/pagination';
// import usePagination from '../../../hooks/usePagination';

// const LeadPotential = ({ companyId }) => {
//   const {
//     leadPotential,
//     fetchLeadPotential,
//     loading,
//     error,
//     deletePotential
//   } = useLeadPotentialController();

//   const [showForm, setShowForm] = useState(false);
//   const [editingPotential, setEditingPotential] = useState(null);
//   const hasFetched = useRef(false);

//   useEffect(() => {
//     if (!hasFetched.current && companyId) {
//       fetchLeadPotential();
//       hasFetched.current = true;  
//     }
//   }, [companyId]);


//   // Fetch on mount
//   useEffect(() => {
//       fetchLeadPotential();
//     }, []);

  

//   const filteredLeadPotential = useMemo(() => {
//   if (!leadPotential || !companyId) return [];

//   const filtered = leadPotential.filter(
//     p =>
//       p.bactive !== false &&
//       p.icompany_id === companyId
//   );

//   // latest created first
//   return [...filtered].sort((a, b) => {
//     return new Date(b.dcreated_dt).getTime() -
//            new Date(a.dcreated_dt).getTime();
//   });

// }, [leadPotential, companyId]);

// const itemsPerPage = 10;

// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
// } = usePagination(filteredLeadPotential, itemsPerPage);

// const indexOfFirstItem = (currentPage - 1) * itemsPerPage;


//   // Delete handler
//   const handleDelete = async (id) => {
//     if (!id) {
//       alert("Error: Cannot delete - missing lead potential ID");
//       return;
//     }

//     if (window.confirm('Are you sure you want to delete this lead potential?')) {
//       const success = await deletePotential(id);
//       if (success) {
//         alert('Lead potential deleted successfully!');
//       } else {
//         alert('Failed to delete lead potential!');
//       }
//     }
//   };

//   // Edit handler
//   const handleEdit = (potential) => {
//     setEditingPotential(potential);
//     setShowForm(true);
//   };

//   // Close form modal
//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingPotential(null);
//   };

//   const handleFormSuccess = () => {
//     fetchLeadPotential();
//     setCurrentPage(1);   
//     handleFormClose();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg">Loading lead potential data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-red-50">
//         <p className="text-red-600 text-lg">Error: {error.message || "Failed to fetch data."}</p>
//       </div>
//     );
//   }

//   return (
//         <div className="min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased">
//     {/* <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased"> */}
//        <div className="max-w-9xl mx-auto">
//          <div className="flex items-center justify-between mb-4"> 
//           <h1 className="text-3xl font-extrabold text-gray-800 mb-8 leading-tight"> Lead Potential </h1>

//          <button
//             className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
//             onClick={() => setShowForm(true)}
//           >
//             + Add Lead Potential
//           </button>
//         </div>

//         {/* Form Modal */}
      
//              {showForm && (
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//                 onClick={handleFormClose}
//               >
//                 <div
//                   className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4"
//                   onClick={(e) => e.stopPropagation()} 
//                 >
//                   <LeadPotentialForm 
//                     onClose={handleFormClose} 
//                     onSuccess={handleFormSuccess} 
//                     editData={editingPotential}
//                     companyId={companyId}         
//                   />
//                 </div>
//               </div>
//             )}

//         {/* Lead Potential Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">S.No</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Status Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Created At</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"> No lead potentials found for the selected criteria. </td>
//                 </tr>
//               ) : (
//                 currentItems.map((potential, index) => (
//                   <tr key={potential.ileadpoten_id || index} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out" >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-800"> {indexOfFirstItem + index + 1} </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"> {potential.clead_name || "Unknown"} </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"> {formatDate(potential.dcreated_dt) || "Unknown Date"} </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                       {/* <div className="flex space-x-2">
//                         <button onClick={() => handleEdit(potential)} className="text-blue-600 hover:text-blue-800 font-medium" > Edit </button>
//                         <button onClick={() => handleDelete(potential.ileadpoten_id)} className="text-red-600 hover:text-red-800 font-medium" > Delete </button>
//                       </div> */}
//                       <div className="flex items-center space-x-3">
//                         <button
//                           onClick={() => handleEdit(potential)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="Edit"
//                         >
//                           <EditIcon fontSize="small" />
//                         </button>

//                         <button
//                           onClick={() => handleDelete(potential.ileadpoten_id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </button>
//                       </div>

             
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//             <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         setCurrentPage={setCurrentPage}
//       />
//       </div>
//     </div>
//   );
// }

// export default LeadPotential;

