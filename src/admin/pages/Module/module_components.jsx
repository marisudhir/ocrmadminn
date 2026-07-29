import { useState, useEffect } from "react";
import { FaEdit, FaSyncAlt  } from "react-icons/fa";
import { moduleController } from "./module_controller";
import ModuleForm from "./module_form";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonTable from "../../context/TableStructure/CommonTable";

export default function ModulePage() {
    const {
        modules,
        error,
        loading,
        addNewModule,
        updateModule,
        toggleModuleStatus,
        fetchModules
    } = moduleController();

    const [localModules, setLocalModules] = useState([]);
    const [editing, setEditing] = useState(null);

    // Sync backend → UI
    useEffect(() => {
        setLocalModules(modules);
    }, [modules]);

    //  SORT ALPHABETIC ORDER (A → Z)
    const sortedModules = [...localModules].sort((a, b) => {
        return a.cmodule_name?.toLowerCase().localeCompare(b.cmodule_name?.toLowerCase());
    });

  const itemsPerPage = 10;

const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: currentModules,
    indexOfFirstItem
} = usePagination(sortedModules, itemsPerPage);

const moduleColumns = [
  {
    header: "Module Name",
    render: (row) => (
      <span className="font-medium">
        {row.cmodule_name || "-"}
      </span>
    ),
  },
  {
    header: "Created By",
    render: (row) =>
      row.createdBy?.cFull_name || "-",
  },
  {
    header: "Updated By",
    render: (row) =>
      row.updatedBy?.cFull_name || "-",
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          row.bactive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.bactive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setEditing(row)}
          title="Edit"
        >
          <FaEdit size={16} className="text-blue-600" />
        </button>

        <button
          onClick={() =>
            toggleModuleStatus(
              row.imodule_id,
              row.bactive
            )
          }
          title="Change Status"
        >
          <FaSyncAlt size={16} className="text-red-600" />
        </button>
      </div>
    ),
  },
];

    return (
        <div className="min-h-screen bg-white p-6 sm:p-8 font-sans antialiased">
            <div className="max-w-9xl mx-auto">
                <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-0">Module </h1>

                    {/* Module Form */}
                    <ModuleForm
                        onSubmit={(data) => {
                            if (editing) {
                                updateModule({
                                    id: editing.imodule_id,
                                    moduleName: data,
                                }).then(() => {
                                    fetchModules();
                                });
                                setEditing(null);
                            } else {
                                addNewModule({ moduleName: data }).then(() => {
                                    fetchModules();
                                });
                            }
                        }}
                        module={editing}
                    />
                </div>

                {loading && (
                  <div className="mb-4 animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </div>
                )}
                {error && <div className="mb-4 text-red-500">Error: {error}</div>}

                {/* TABLE */}
                <CommonTable
                    columns={moduleColumns}
                    data={currentModules}
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



// import { useState, useEffect } from "react";
// import { FaEdit, FaSyncAlt  } from "react-icons/fa";
// import { moduleController } from "./module_controller";
// import ModuleForm from "./module_form";
// import Pagination from "../../context/Pagination/pagination";
// import usePagination from "../../hooks/usePagination";

// export default function ModulePage() {
//     const {
//         modules,
//         error,
//         loading,
//         addNewModule,
//         updateModule,
//         toggleModuleStatus,
//         fetchModules
//     } = moduleController();

//     const [localModules, setLocalModules] = useState([]);
//     const [editing, setEditing] = useState(null);

//     // Sync backend → UI
//     useEffect(() => {
//         setLocalModules(modules);
//     }, [modules]);

//     //  SORT ALPHABETIC ORDER (A → Z)
//     const sortedModules = [...localModules].sort((a, b) => {
//         return a.cmodule_name?.toLowerCase().localeCompare(b.cmodule_name?.toLowerCase());
//     });

//   const itemsPerPage = 10;

//     const {
//         currentPage,
//         setCurrentPage,
//         totalPages,
//         paginatedData: currentModules,
//         indexOfFirstItem
//     } = usePagination(sortedModules, itemsPerPage);


//     if (loading) return <p className="text-gray-600">Loading...</p>;
//     if (error) return <p className="text-red-500">Error: {error}</p>;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
//             <div className="max-w-9xl mx-auto">
//                 <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Module </h1>

//                 {/* Module Form */}
//                 <ModuleForm
//                     onSubmit={(data) => {
//                         if (editing) {
//                             updateModule({
//                                 id: editing.imodule_id,
//                                 moduleName: data,
//                             }).then(() => {
//                                 fetchModules();
//                             });
//                             setEditing(null);
//                         } else {
//                             addNewModule({ moduleName: data }).then(() => {
//                                 fetchModules();
//                             });
//                         }
//                     }}
//                     module={editing}
//                 />

//                 {/* TABLE */}
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">S.No</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Module Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Created By</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Updated By</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {currentModules.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No modules found.</td>
//                                 </tr>
//                             ) : (
//                                 currentModules.map((module, index) => (
//                                     <tr key={module.imodule_id} className="hover:bg-blue-50">
//                                         <td className="px-6 py-4 text-sm font-medium">{indexOfFirstItem + index + 1}</td>
//                                         <td className="px-6 py-4 text-sm">{module.cmodule_name || "-"}</td>
//                                         <td className="px-6 py-4 text-sm">{module.createdBy?.cFull_name || "-"}</td>
//                                         <td className="px-6 py-4 text-sm">{module.updatedBy?.cFull_name || "-"}</td>
//                                         <td className="px-6 py-4">
//                                             <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                                                 module.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                                             }`}>
//                                                 {module.bactive ? "Active" : "Inactive"}
//                                             </span>
//                                         </td>

//                                         <td className="px-6 py-4 text-sm space-x-2">
//                                             <button onClick={() => setEditing(module)} className="px-3 py-1 bg-blue-400  text-blue rounded" >
//                                                  <FaEdit  size = {16} />
//                                             </button>

//                                             {/* Change Status Button */}
//                                             <button
//                                                 onClick={() => { toggleModuleStatus(module.imodule_id, module.bactive);
//                                                 }}
//                                                 className="px-3 py-1 bg-red-500 text-black rounded hover:bg-yellow-600"
//                                             >
//                                                 <FaSyncAlt size={16} />
//                                             </button>
//                                             {/* <button
//                                                 onClick={() => {
//                                                     const updated = localModules.map((m) =>
//                                                         m.imodule_id === module.imodule_id
//                                                             ? { ...m, bactive: !m.bactive }
//                                                             : m
//                                                     );
//                                                     setLocalModules(updated);
//                                                 }}
//                                                 className="px-3 py-1 bg-red-500 text-black rounded  hover:bg-yellow-600"
//                                             >
//                                                 {/* Change Status */}
//                                                 {/* <FaSyncAlt size={16} />

//                                             </button> */} 
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* PAGINATION */}
//                  <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         setCurrentPage={setCurrentPage}
//                     />
            
                   
//             </div>
//         </div>
//     );
// }




