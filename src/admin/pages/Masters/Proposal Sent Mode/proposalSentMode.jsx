import React, { useState, useEffect, useMemo } from 'react'; 
import ProposalSentForm from './Sub-Components/proposalSentModeForm';
import { useProposalSentMode } from './useProposalSentMode'; 
import formatDate from '../../../utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import AddNewButton from '../../../context/commonbutton/AddNewButton';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';

const ProposalSentMode = ({ companyId, onBack }) => {

  const { fetchProposalSentMode, proposalSentMode, loading, error } = useProposalSentMode();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);


  useEffect(() => {
    if (companyId) {
      fetchProposalSentMode(companyId);
    }
  }, [companyId]); 

  const filteredProposalSentMode = useMemo(() => {
    if (!companyId) return proposalSentMode;


  return [...proposalSentMode]
  .filter(p => Number(p.icompany_id) === Number(companyId))
  .sort((a, b) => {
    const dateA = new Date(a.created_dt || a.createdAt || 0);
    const dateB = new Date(b.created_dt || b.createdAt || 0);
    return dateB - dateA;
  });
 }, [proposalSentMode, companyId]);

 useEffect(() => {
  setCurrentPage(1);
}, [filteredProposalSentMode.length]);

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredProposalSentMode, itemsPerPage);

const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

const proposalSentModeColumns = [
  {
    header: "Proposal Send Mode",
    render: (row) => row.name || "Unknown",
  },
  {
    header: "Created At",
    render: (row) =>
      formatDate(row.created_dt) || "Unknown Date",
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center">
        <button
          onClick={() => {
            setEditData(row);
            setShowForm(true);
          }}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>
      </div>
    ),
  },
];


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading proposal sent mode ...</p>
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
            <CommonBackButton title="Proposal sent mode" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Proposal sent mode </h1>
          )}
          <AddNewButton
            label="+ Add Proposal send mode"
            onClick={() => { setEditData(null);  setShowForm(true); }}
          />
        </div>

        {/* Renders the form according to the state */}
  

        {showForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            
            {/* OVERLAY */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowForm(false)}
            />

            {/* MODAL */}
            <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <ProposalSentForm
                initialData={editData}
                onClose={() => setShowForm(false)}
                onSuccess={fetchProposalSentMode}
                companyId={companyId}
              />
            </div>

          </div>
        )}



        {/* Lead Potential Table */}
      <CommonTable
  columns={proposalSentModeColumns}
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

export default ProposalSentMode;


// import React, { useState, useEffect, useMemo } from 'react'; 
// import ProposalSentForm from './Sub-Components/proposalSentModeForm';
// import { useProposalSentMode } from './useProposalSentMode'; 
// import formatDate from '../../../utils/formatDate';
// import EditIcon from "@mui/icons-material/Edit";
// import Pagination from '../../../context/Pagination/pagination';
// import usePagination from '../../../hooks/usePagination';
// import CommonTable from '../../../context/TableStructure/CommonTable';

// const ProposalSentMode = ({ companyId }) => {

//   const { fetchProposalSentMode, proposalSentMode, loading, error } = useProposalSentMode();
//   const [showForm, setShowForm] = useState(false);
//   const [editData, setEditData] = useState(null);


//   useEffect(() => {
//     if (companyId) {
//       fetchProposalSentMode(companyId);
//     }
//   }, [companyId]); 

//   const filteredProposalSentMode = useMemo(() => {
//     if (!companyId) return proposalSentMode;


//   return [...proposalSentMode]
//   .filter(p => Number(p.icompany_id) === Number(companyId))
//   .sort((a, b) => {
//     const dateA = new Date(a.created_dt || a.createdAt || 0);
//     const dateB = new Date(b.created_dt || b.createdAt || 0);
//     return dateB - dateA;
//   });
//  }, [proposalSentMode, companyId]);

//  useEffect(() => {
//   setCurrentPage(1);
// }, [filteredProposalSentMode.length]);

// const itemsPerPage = 10;

// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
// } = usePagination(filteredProposalSentMode, itemsPerPage);

// const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

// const proposalSentModeColumns = [
//   {
//     header: "Proposal Send Mode",
//     render: (row) => row.name || "Unknown",
//   },
//   {
//     header: "Created At",
//     render: (row) =>
//       formatDate(row.created_dt) || "Unknown Date",
//   },
//   {
//     header: "Actions",
//     render: (row) => (
//       <div className="flex justify-center">
//         <button
//           onClick={() => {
//             setEditData(row);
//             setShowForm(true);
//           }}
//           title="Edit"
//         >
//           <EditIcon fontSize="small" className="text-blue-600" />
//         </button>
//       </div>
//     ),
//   },
// ];


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg">Loading proposal sent mode ...</p>
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
//       <div className="min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased">
//     {/*  <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased"> */}
//       <div className="max-w-9xl mx-auto">

//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Proposal sent mode </h1>
//           <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
//               onClick={() => { setEditData(null);  setShowForm(true); }}
//           >
//            + Add Proposal send mode
//           </button>
//         </div>

//         {/* Renders the form according to the state */}
  

//         {showForm && (
//           <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            
//             {/* OVERLAY */}
//             <div
//               className="absolute inset-0 bg-black bg-opacity-50"
//               onClick={() => setShowForm(false)}
//             />

//             {/* MODAL */}
//             <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
//               <ProposalSentForm
//                 initialData={editData}
//                 onClose={() => setShowForm(false)}
//                 onSuccess={fetchProposalSentMode}
//                 companyId={companyId}
//               />
//             </div>

//           </div>
//         )}



//         {/* Lead Potential Table */}
//       <CommonTable
//         columns={proposalSentModeColumns}
//         data={currentItems}
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//       />

//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               setCurrentPage={setCurrentPage}
//             />
//       </div>
//     </div>
//   );
// };

// export default ProposalSentMode;


