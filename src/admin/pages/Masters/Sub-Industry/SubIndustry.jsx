import React, { useState, useMemo } from 'react';
import SubIndustryForm from './Sub-Components/SubIndustryForm';
import { useSubIndustry } from './useSubIndustry';
import formatDate from '../../../utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../context/Pagination/pagination';
import usePagination from '../../../hooks/usePagination';
import CommonTable from '../../../context/TableStructure/CommonTable';
import AddNewButton from '../../../context/commonbutton/AddNewButton';
import CommonBackButton from '../../../context/commonbutton/CommonBackButton';

const SubIndustry = ({ companyId, onBack }) => {
  const { subIndustry, fetchSubIndustry, deleteSubIndustry, loading } = useSubIndustry(companyId);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // const sortedData = useMemo(() => {
  //   return [...subIndustry].sort((a, b) => new Date(b.dcreated_dt) - new Date(a.dcreated_dt));
  // }, [subIndustry]);

  const sortedData = useMemo(() => {
  if (!Array.isArray(subIndustry)) return [];

  return [...subIndustry].sort((a, b) => {
    const dateA = new Date(a.dupdated_dt || a.dcreated_dt).getTime();
    const dateB = new Date(b.dupdated_dt || b.dcreated_dt).getTime();

    return dateB - dateA;
  });
}, [subIndustry]);

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
  indexOfFirstItem,
} = usePagination(sortedData, itemsPerPage);


const subIndustryColumns = [
  {
    header: "Sub Industry",
    render: (row) => (
      <span className="font-medium">
        {row.subindustry_name}
      </span>
    ),
  },
  {
    header: "Parent Industry",
    render: (row) => (
      <span className="px-2 py-1 bg-gray-100 rounded text-xs border">
        {row.indsutry?.cindustry_name || "-"}
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
          onClick={() => handleEdit(row)}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button
          onClick={() => handleDelete(row.isubindustry)}
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-500" />
        </button>
      </div>
    ),
  },
];


  const handleEdit = (item) => {
    setEditData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      await deleteSubIndustry(id, false);
    }
  };

  if (loading) return <div className="p-10 text-center text-blue-600">Loading...</div>;

  return (
    <div className={companyId ? "" : "p-6 bg-gray-50 min-h-screen"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        {companyId ? (
          <CommonBackButton title="Sub Industry Master" className="mb-0" onClick={onBack} />
        ) : (
          <h1 className="text-2xl font-bold text-gray-800">Sub Industry Master</h1>
        )}
        <AddNewButton
          label="+ Add Sub Industry"
          onClick={() => { setEditData(null); setShowForm(true); }}
        />
      </div>

     <CommonTable
  columns={subIndustryColumns}
  data={currentItems}
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
/>

      {showForm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setShowForm(false)} >
        <div className="bg-white p-6 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}  >
          <SubIndustryForm
            editData={editData}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              fetchSubIndustry();
              setShowForm(false);
            }}
            companyId={companyId}
          />
        </div>
      </div>
    )}
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

    </div>
  );
};

export default SubIndustry;


// import React, { useState, useMemo } from 'react';
// import SubIndustryForm from './Sub-Components/SubIndustryForm';
// import { useSubIndustry } from './useSubIndustry';
// import formatDate from '../../../utils/formatDate';
// import { Plus } from 'lucide-react';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Pagination from '../../../context/Pagination/pagination';
// import usePagination from '../../../hooks/usePagination';
// import CommonTable from '../../../context/TableStructure/CommonTable';

// const SubIndustry = ({ companyId }) => {
//   const { subIndustry, fetchSubIndustry, deleteSubIndustry, loading } = useSubIndustry(companyId);
//   const [showForm, setShowForm] = useState(false);
//   const [editData, setEditData] = useState(null);
  
//   // const sortedData = useMemo(() => {
//   //   return [...subIndustry].sort((a, b) => new Date(b.dcreated_dt) - new Date(a.dcreated_dt));
//   // }, [subIndustry]);

//   const sortedData = useMemo(() => {
//   if (!Array.isArray(subIndustry)) return [];

//   return [...subIndustry].sort((a, b) => {
//     const dateA = new Date(a.dupdated_dt || a.dcreated_dt).getTime();
//     const dateB = new Date(b.dupdated_dt || b.dcreated_dt).getTime();

//     return dateB - dateA;
//   });
// }, [subIndustry]);

// const itemsPerPage = 10;

// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
//   indexOfFirstItem,
// } = usePagination(sortedData, itemsPerPage);


// const subIndustryColumns = [
//   {
//     header: "Sub Industry",
//     render: (row) => (
//       <span className="font-medium">
//         {row.subindustry_name}
//       </span>
//     ),
//   },
//   {
//     header: "Parent Industry",
//     render: (row) => (
//       <span className="px-2 py-1 bg-gray-100 rounded text-xs border">
//         {row.indsutry?.cindustry_name || "-"}
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
//           onClick={() => handleEdit(row)}
//           title="Edit"
//         >
//           <EditIcon fontSize="small" className="text-blue-600" />
//         </button>

//         <button
//           onClick={() => handleDelete(row.isubindustry)}
//           title="Delete"
//         >
//           <DeleteIcon fontSize="small" className="text-red-500" />
//         </button>
//       </div>
//     ),
//   },
// ];


//   const handleEdit = (item) => {
//     setEditData(item);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this?")) {
//       await deleteSubIndustry(id, false);
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-blue-600">Loading...</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Sub Industry Master</h1>
//         <button
//           onClick={() => { setEditData(null); setShowForm(true); }}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md"
//         >
//           <Plus size={18} /> Add Sub Industry
//         </button>
//       </div>

//      <CommonTable
//   columns={subIndustryColumns}
//   data={currentItems}
//   currentPage={currentPage}
//   itemsPerPage={itemsPerPage}
// />

//       {showForm && (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setShowForm(false)} >
//         <div className="bg-white p-6 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}  >
//           <SubIndustryForm
//             editData={editData}
//             onClose={() => setShowForm(false)}
//             onSuccess={() => {
//               fetchSubIndustry();
//               setShowForm(false);
//             }}
//             companyId={companyId}
//           />
//         </div>
//       </div>
//     )}
//     <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         setCurrentPage={setCurrentPage}
//       />

//     </div>
//   );
// };

// export default SubIndustry;


