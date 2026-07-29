import React, { useState, useEffect, useMemo } from "react";
import SubSourceForm from "./Sub-Components/SubSourceForm";
import { useSubSource } from "./useSubSource";
import formatDate from "../../../utils/formatDate";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../context/Pagination/pagination";
import usePagination from "../../../hooks/usePagination";
import CommonTable from "../../../context/TableStructure/CommonTable";
import AddNewButton from "../../../context/commonbutton/AddNewButton";
import CommonBackButton from "../../../context/commonbutton/CommonBackButton";

const SubSource = ({ companyId, onBack }) => {
  const { subSources, fetchSubSources, deleteSubSource, loading } = useSubSource();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchSubSources(companyId);
    }
  }, [companyId, fetchSubSources]);

  // const displayList = useMemo(() => {
  //   if (!Array.isArray(subSources)) return [];

  //   return [...subSources].sort((a, b) => {
  //       return new Date(b.dcreated_at) - new Date(a.dcreated_at);
  //   });
  //   }, [subSources]);
  const displayList = useMemo(() => {
  if (!Array.isArray(subSources)) return [];

  return [...subSources].sort((a, b) => {
    const dateA = new Date(a.dupdated_at || a.dcreated_at).getTime();
    const dateB = new Date(b.dupdated_at || b.dcreated_at).getTime();

    return dateB - dateA;
  });
}, [subSources]);

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
  indexOfFirstItem,
} = usePagination(displayList, itemsPerPage);

const subSourceColumns = [
  {
    header: "Source",
    render: (row) => (
      <span className="font-medium">
        {row.source_name}
      </span>
    ),
  },
  {
    header: "Sub Source",
    render: (row) => (
      <span>{row.ssub_src_name}</span>
    ),
  },
  {
    header: "Created At",
    render: (row) =>
      row.dcreated_at
        ? formatDate(row.dcreated_at)
        : "-",
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            setEditData(row);
            setShowForm(true);
          }}
          title="Edit"
        >
          <EditIcon fontSize="small" className="text-indigo-600" />
        </button>

        <button
          onClick={() =>
            deleteSubSource(row.isub_src_id, companyId)
          }
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


  return (
    <div className={companyId ? "" : "p-6 bg-gray-50 min-h-screen"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        {companyId ? (
          <CommonBackButton title="Lead Sub Source" className="mb-0" onClick={onBack} />
        ) : (
          <h1 className="text-2xl font-bold text-gray-900">Lead Sub Source</h1>
        )}
        <AddNewButton
          label="+ Add Sub Source"
          onClick={() => { setEditData(null); setShowForm(true); }}
        />
      </div>

      <CommonTable
  columns={subSourceColumns}
  data={currentItems}
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
/>

      {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setShowForm(false)} >
        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}  >
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" > ✕ </button>

          <SubSourceForm
            editData={editData}
            companyId={companyId}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              fetchSubSources(companyId);
              setShowForm(false);
            }}
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

export default SubSource;


// import React, { useState, useEffect, useMemo } from "react";
// import SubSourceForm from "./Sub-Components/SubSourceForm";
// import { useSubSource } from "./useSubSource";
// import formatDate from "../../../utils/formatDate";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Pagination from "../../../context/Pagination/pagination";
// import usePagination from "../../../hooks/usePagination";
// import CommonTable from "../../../context/TableStructure/CommonTable";

// const SubSource = ({ companyId }) => {
//   const { subSources, fetchSubSources, deleteSubSource, loading } = useSubSource();
//   const [showForm, setShowForm] = useState(false);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     if (companyId) {
//       fetchSubSources(companyId);
//     }
//   }, [companyId, fetchSubSources]);

//   // const displayList = useMemo(() => {
//   //   if (!Array.isArray(subSources)) return [];

//   //   return [...subSources].sort((a, b) => {
//   //       return new Date(b.dcreated_at) - new Date(a.dcreated_at);
//   //   });
//   //   }, [subSources]);
//   const displayList = useMemo(() => {
//   if (!Array.isArray(subSources)) return [];

//   return [...subSources].sort((a, b) => {
//     const dateA = new Date(a.dupdated_at || a.dcreated_at).getTime();
//     const dateB = new Date(b.dupdated_at || b.dcreated_at).getTime();

//     return dateB - dateA;
//   });
// }, [subSources]);

// const itemsPerPage = 10;

// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
//   indexOfFirstItem,
// } = usePagination(displayList, itemsPerPage);

// const subSourceColumns = [
//   {
//     header: "Source",
//     render: (row) => (
//       <span className="font-medium">
//         {row.source_name}
//       </span>
//     ),
//   },
//   {
//     header: "Sub Source",
//     render: (row) => (
//       <span>{row.ssub_src_name}</span>
//     ),
//   },
//   {
//     header: "Created At",
//     render: (row) =>
//       row.dcreated_at
//         ? formatDate(row.dcreated_at)
//         : "-",
//   },
//   {
//     header: "Actions",
//     render: (row) => (
//       <div className="flex justify-center gap-3">
//         <button
//           onClick={() => {
//             setEditData(row);
//             setShowForm(true);
//           }}
//           title="Edit"
//         >
//           <EditIcon fontSize="small" className="text-indigo-600" />
//         </button>

//         <button
//           onClick={() =>
//             deleteSubSource(row.isub_src_id, companyId)
//           }
//           title="Delete"
//         >
//           <DeleteIcon fontSize="small" className="text-red-600" />
//         </button>
//       </div>
//     ),
//   },
// ];


//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Lead Sub Source</h1>
//         <button
//           onClick={() => { setEditData(null); setShowForm(true); }}
//           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
//         >
//           <Plus size={18} /> Add Sub Source
//         </button>
//       </div>

//       <CommonTable
//   columns={subSourceColumns}
//   data={currentItems}
//   currentPage={currentPage}
//   itemsPerPage={itemsPerPage}
// />

//       {showForm && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setShowForm(false)} >
//         <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}  >
//           <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" > ✕ </button>

//           <SubSourceForm
//             editData={editData}
//             companyId={companyId}
//             onClose={() => setShowForm(false)}
//             onSuccess={() => {
//               fetchSubSources(companyId);
//               setShowForm(false);
//             }}
//           />
//         </div>
//       </div>
//     )}

//      <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         setCurrentPage={setCurrentPage}
//       />

//     </div>
//   );
// };

// export default SubSource;


