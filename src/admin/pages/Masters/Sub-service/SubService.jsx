import { useState, useEffect, useMemo } from "react";
import formatDate from "../../../utils/formatDate";
import { useSubService } from "./useSubService";
import SubServiceForm from "./Sub-Components/SubServiceForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../context/Pagination/pagination";
import usePagination from "../../../hooks/usePagination";
import CommonTable from "../../../context/TableStructure/CommonTable";
import AddNewButton from "../../../context/commonbutton/AddNewButton";
import CommonBackButton from "../../../context/commonbutton/CommonBackButton";

const SubService = ({ companyId, onBack }) => {
  const {
    subService = [],
    fetchLeadSubService,
    deleteLeadSubService,
    loading,
    error,
  } = useSubService();

  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= Fetch Sub Services ================= */
  useEffect(() => {
    if (companyId) {
      fetchLeadSubService(companyId);
    }
  }, [companyId]);

  /* ================= Pagination ================= */
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = subService.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );
  // const totalPages = Math.ceil(subService.length / itemsPerPage);

const sortedSubService = useMemo(() => {
  if (!Array.isArray(subService)) return [];

  return [...subService].sort((a, b) => {
    const dateA = new Date(a.dupdated_dt || a.dcreated_dt).getTime();
    const dateB = new Date(b.dupdated_dt || b.dcreated_dt).getTime();
    return dateB - dateA;
  });
}, [subService]);

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
  indexOfFirstItem,
} = usePagination(sortedSubService, itemsPerPage);

const subServiceColumns = [
  {
    header: "Service",
    render: (row) => (
      <span>{row.service?.cservice_name || "—"}</span>
    ),
  },
  {
    header: "Sub Service",
    render: (row) => (
      <span className="font-medium">
        {row.subservice_name}
      </span>
    ),
  },
  {
    header: "Created At",
    render: (row) =>
      formatDate(row.dcreated_dt) || "Unknown Date",
  },
  {
    header: "Actions",

    render: (row) => (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => {
            setEditData(row);
            setShowForm(true);
          }}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button
          onClick={() => handleDelete(row)}
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [subService.length]);

  /* ================= Form Success ================= */
  const handleFormSuccess = () => {
    fetchLeadSubService(companyId);
    setShowForm(false);
    setEditData(null);
  };

  /* ================= Delete ================= */
  
  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    const success = await deleteLeadSubService(item.isubservice_id);
    if (success) fetchLeadSubService(companyId);
  };

  /* ================= Loading / Error ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading sub services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error.message || "Failed to fetch sub services"}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className={companyId ? "" : "min-h-screen bg-gray-100 p-6"}>
      <div className="max-w-9xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          {companyId ? (
            <CommonBackButton title="Lead Sub-service" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-bold">Lead Sub-service</h1>
          )}
          <AddNewButton
            label="+ Add Sub Service"
            onClick={() => { setEditData(null); setShowForm(true); }}
          />
        </div>

        {/* Modal */}
        {/* {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl w-full max-w-lg">
              <SubServiceForm
                onClose={() => setShowForm(false)}
                onSuccess={handleFormSuccess}
                editData={editData}
                companyId={companyId}
              />
            </div>
          </div>
        )} */}

        {showForm && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    onClick={() => setShowForm(false)}   
  >
    <div
      className="bg-white p-8 rounded-xl w-full max-w-lg"
      onClick={(e) => e.stopPropagation()} 
    >
      <SubServiceForm
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        editData={editData}
        companyId={companyId}
      />
    </div>
  </div>
)}


        {/* Table */}
        <CommonTable
  columns={subServiceColumns}
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

export default SubService;



// import { useState, useEffect, useMemo } from "react";
// import formatDate from "../../../utils/formatDate";
// import { useSubService } from "./useSubService";
// import SubServiceForm from "./Sub-Components/SubServiceForm";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Pagination from "../../../context/Pagination/pagination";
// import usePagination from "../../../hooks/usePagination";
// import CommonTable from "../../../context/TableStructure/CommonTable";

// const SubService = ({ companyId }) => {
//   const {
//     subService = [],
//     fetchLeadSubService,
//     deleteLeadSubService,
//     loading,
//     error,
//   } = useSubService();

//   const [editData, setEditData] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   /* ================= Fetch Sub Services ================= */
//   useEffect(() => {
//     if (companyId) {
//       fetchLeadSubService(companyId);
//     }
//   }, [companyId]);

//   /* ================= Pagination ================= */
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const itemsPerPage = 10;

//   // const indexOfLastItem = currentPage * itemsPerPage;
//   // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   // const currentItems = subService.slice(
//   //   indexOfFirstItem,
//   //   indexOfLastItem
//   // );
//   // const totalPages = Math.ceil(subService.length / itemsPerPage);

// const sortedSubService = useMemo(() => {
//   if (!Array.isArray(subService)) return [];

//   return [...subService].sort((a, b) => {
//     const dateA = new Date(a.dupdated_dt || a.dcreated_dt).getTime();
//     const dateB = new Date(b.dupdated_dt || b.dcreated_dt).getTime();
//     return dateB - dateA;
//   });
// }, [subService]);

// const itemsPerPage = 10;

// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
//   indexOfFirstItem,
// } = usePagination(sortedSubService, itemsPerPage);

// const subServiceColumns = [
//   {
//     header: "Service",
//     render: (row) => (
//       <span>{row.service?.cservice_name || "—"}</span>
//     ),
//   },
//   {
//     header: "Sub Service",
//     render: (row) => (
//       <span className="font-medium">
//         {row.subservice_name}
//       </span>
//     ),
//   },
//   {
//     header: "Created At",
//     render: (row) =>
//       formatDate(row.dcreated_dt) || "Unknown Date",
//   },
//   {
//     header: "Actions",

//     render: (row) => (
//       <div className="flex justify-center gap-2">
//         <button
//           onClick={() => {
//             setEditData(row);
//             setShowForm(true);
//           }}
//           title="Edit"
//         >
//           <EditIcon fontSize="small" className="text-blue-600" />
//         </button>

//         <button
//           onClick={() => handleDelete(row)}
//           title="Delete"
//         >
//           <DeleteIcon fontSize="small" className="text-red-600" />
//         </button>
//       </div>
//     ),
//   },
// ];


//   // useEffect(() => {
//   //   setCurrentPage(1);
//   // }, [subService.length]);

//   /* ================= Form Success ================= */
//   const handleFormSuccess = () => {
//     fetchLeadSubService(companyId);
//     setShowForm(false);
//     setEditData(null);
//   };

//   /* ================= Delete ================= */
  
//   const handleDelete = async (item) => {
//     if (!window.confirm("Are you sure you want to delete?")) return;
//     const success = await deleteLeadSubService(item.isubservice_id);
//     if (success) fetchLeadSubService(companyId);
//   };

//   /* ================= Loading / Error ================= */
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         Loading sub services...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-600">
//         {error.message || "Failed to fetch sub services"}
//       </div>
//     );
//   }

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-9xl mx-auto">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Lead Sub-service</h1>
//           <button className="px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={() => { setEditData(null); setShowForm(true); }} >  + Add Sub Service </button>
//         </div>

//         {/* Modal */}
//         {/* {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
//             <div className="bg-white p-8 rounded-xl w-full max-w-lg">
//               <SubServiceForm
//                 onClose={() => setShowForm(false)}
//                 onSuccess={handleFormSuccess}
//                 editData={editData}
//                 companyId={companyId}
//               />
//             </div>
//           </div>
//         )} */}

//         {showForm && (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//     onClick={() => setShowForm(false)}   
//   >
//     <div
//       className="bg-white p-8 rounded-xl w-full max-w-lg"
//       onClick={(e) => e.stopPropagation()} 
//     >
//       <SubServiceForm
//         onClose={() => setShowForm(false)}
//         onSuccess={handleFormSuccess}
//         editData={editData}
//         companyId={companyId}
//       />
//     </div>
//   </div>
// )}


//         {/* Table */}
//         <CommonTable
//   columns={subServiceColumns}
//   data={currentItems}
//   currentPage={currentPage}
//   itemsPerPage={itemsPerPage}
// />

//         <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         setCurrentPage={setCurrentPage}
//       />
//       </div>
//     </div>
//   );
// };

// export default SubService;


