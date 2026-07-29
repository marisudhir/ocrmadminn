import { useState, useEffect } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { moduleAllocationController } from "./module_allocation_controller";
import ModuleAllocationForm from "./module_allocation_form";
import CommonTable from "../../context/TableStructure/CommonTable";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../context/Pagination/pagination";

export function ModuleAllocation() {
  const {
    moduleAllocation,
    subscriptionModuleAllocation,
    activeModules,
    activeSubscription,
    error,
    loading,
    createModuleAllocation,
    editModuleAllocationController,
    changeAllocationSts,
    getAllModuleAllocation,
    getAllocatedModulesBySubsId,
  } = moduleAllocationController();

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");
  const [checkedModules, setCheckedModules] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (selectedSubscriptionId && subscriptionModuleAllocation?.length > 0) {
      setCheckedModules(
        subscriptionModuleAllocation.map((allocated) => allocated.module_id),
      );
    } else {
      setCheckedModules([]);
    }
  }, [selectedSubscriptionId, subscriptionModuleAllocation]);

  useEffect(() => {
    if (error) {
      setSnackbar({ open: true, message: error });
      const timer = setTimeout(
        () => setSnackbar({ open: false, message: "" }),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [error]);

  const moduleAllocationObj = {
    subscription: activeSubscription,
    modules: activeModules,
  };

  const handleEditAllocation = (e) => {
    e.preventDefault();

    if (!selectedSubscriptionId) {
      setSnackbar({
        open: true,
        message: "Please select a subscription",
        type: "error",
      });
      return;
    }

    const currentlyAllocated = subscriptionModuleAllocation.map(
      (allocated) => allocated.module_id,
    );

    const deactivateModulesIds = currentlyAllocated.filter(
      (id) => !checkedModules.includes(id),
    );

    const newMouldesIds = checkedModules.filter(
      (id) => !currentlyAllocated.includes(id),
    );

    const requestBody = {
      subscriptionId: Number(selectedSubscriptionId),
      moduleAllocations: [{ deactivateModulesIds }, { newMouldesIds }],
    };

    editModuleAllocationController(requestBody);
  };

  const sortedModuleAllocation = [...(moduleAllocation || [])].sort((a, b) => {
    const subSort = a.subscriptionName.localeCompare(b.subscriptionName);
    if (subSort !== 0) return subSort;
    return a.moduleName.localeCompare(b.moduleName);
  });

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedModuleAllocation, 10);

  const moduleAllocationColumns = [
    {
      header: "Subscription",
      render: (row) => row.subscriptionName,
    },
    {
      header: "Module",
      render: (row) => row.moduleName,
    },
    {
      header: "Created By",
      render: (row) => row.createdBy,
    },
    {
      header: "Updated By",
      render: (row) => row.updatedBy,
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
      header: "Option",
      render: (row) => (
        <button
          className="p-2 rounded bg-yellow-500 hover:bg-yellow-600"
          onClick={() => {
            changeAllocationSts(row.id, !row.bactive);
            getAllModuleAllocation();
          }}
        >
          <FaSyncAlt size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 leading-tight">
          Module <span className="text-[#2737b8]">Allocation</span>
        </h1>

        {loading && (
          <div className="mb-4 animate-pulse rounded-xl border border-gray-200 bg-white p-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        )}

        {/* ===== UPDATED UI STARTS HERE ===== */}
        <form
          onSubmit={handleEditAllocation}
          className="bg-gray-200 p-6 rounded-xl shadow-md mt-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Edit Allocated Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 ">
            {/* LEFT — Select Subscription */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Select Subscription
              </label>

              <select
                value={selectedSubscriptionId}
                onChange={(e) => {
                  setSelectedSubscriptionId(e.target.value);
                  getAllocatedModulesBySubsId(
                    e.target.value,
                    "allocatedModules",
                  );
                }}
                className="w-48 border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {" "}
                  -- Select Subscription --{" "}
                </option>
                {activeSubscription?.map((sub) => (
                  <option key={sub.plan_id} value={sub.plan_id}>
                    {sub.plan_name}
                  </option>
                ))}
              </select>
            </div>

            {/* RIGHT — Module Checkbox Grid   */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Select Modules
              </label>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {activeModules
                  ?.sort((a, b) => a.cmodule_name.localeCompare(b.cmodule_name))
                  .map((module) => (
                    <label
                      key={module.imodule_id}
                      className="flex items-center gap-2 p-2 border rounded-lg hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={checkedModules.includes(module.imodule_id)}
                        onChange={() => {
                          setCheckedModules((prev) =>
                            prev.includes(module.imodule_id)
                              ? prev.filter((id) => id !== module.imodule_id)
                              : [...prev, module.imodule_id],
                          );
                        }}
                      />
                      <span>{module.cmodule_name}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Allocation
          </button>
        </form>
        {/* ===== UPDATED UI ENDS HERE ===== */}

        <ModuleAllocationForm
          onSubmit={(data) => {
            createModuleAllocation(data);
          }}
          moduleAllocationObj={moduleAllocationObj}
        />

        {/* ===== MODULE ALLOCATION TABLE ===== */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6">


          <CommonTable columns={moduleAllocationColumns} data={paginatedData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {snackbar.open && (
        <div className="fixed bottom-5 right-5 bg-red-400 text-white px-4 py-2 rounded shadow-lg">
          {snackbar.message}
        </div>
      )}
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { FaSyncAlt } from "react-icons/fa";
// import { moduleAllocationController } from "./module_allocation_controller";
// import ModuleAllocationForm from "./module_allocation_form";

// export function ModuleAllocation() {
//     const {
//         moduleAllocation,
//         subscriptionModuleAllocation,
//         activeModules,
//         activeSubscription,
//         error,
//         loading,
//         createModuleAllocation,
//         editModuleAllocationController,
//         changeAllocationSts,
//         getAllModuleAllocation,
//         getAllocatedModulesBySubsId
//     } = moduleAllocationController();

//     const [snackbar, setSnackbar] = useState({ open: false, message: "" });
//     const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");
//     const [checkedModules, setCheckedModules] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10; 

//     useEffect(() => {
//         if (selectedSubscriptionId && subscriptionModuleAllocation?.length > 0) {
//             setCheckedModules(
//                 subscriptionModuleAllocation.map((allocated) => allocated.module_id)
//             );
//         } else {
//             setCheckedModules([]);
//         }
//     }, [selectedSubscriptionId, subscriptionModuleAllocation]);

//     useEffect(() => {
//         if (error) {
//             setSnackbar({ open: true, message: error });
//             const timer = setTimeout(
//                 () => setSnackbar({ open: false, message: "" }),
//                 3000
//             );
//             return () => clearTimeout(timer);
//         }
//     }, [error]);

//     if (loading) return <p>Loading...</p>;

//     const moduleAllocationObj = {
//         subscription: activeSubscription,
//         modules: activeModules
//     };

//     const handleEditAllocation = (e) => {
//         e.preventDefault();

//         if (!selectedSubscriptionId) {
//             setSnackbar({ open: true, message: "Please select a subscription", type: "error" });
//             return;
//         }

//         const currentlyAllocated = subscriptionModuleAllocation.map(
//             (allocated) => allocated.module_id
//         );

//         const deactivateModulesIds = currentlyAllocated.filter(
//             (id) => !checkedModules.includes(id)
//         );

//         const newMouldesIds = checkedModules.filter(
//             (id) => !currentlyAllocated.includes(id)
//         );

//         const requestBody = {
//             subscriptionId: Number(selectedSubscriptionId),
//             moduleAllocations: [
//                 { deactivateModulesIds },
//                 { newMouldesIds }   
//             ]
//         };

//         editModuleAllocationController(requestBody);
//     };


//     //  Sort by Subscription alphabetically, then by Module name alphabetically
//     const sortedModuleAllocation = [...moduleAllocation].sort((a, b) => {
//         const subSort = a.subscriptionName.localeCompare(b.subscriptionName);
//         if (subSort !== 0) return subSort;

//         return a.moduleName.localeCompare(b.moduleName);
//     });
//     //  const sortedModuleAllocation = [...moduleAllocation].sort((a, b) => {
//     //     const subSort = a.subscriptionName.localeCompare(b.subscriptionName);
//     //     if (subSort !== 0) return subSort;
//     //     return a.moduleName.localeCompare(b.moduleName);
//     // });

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = sortedModuleAllocation.slice(
//         indexOfFirstItem,
//         indexOfLastItem
//     );
//     const totalPages = Math.ceil(
//         sortedModuleAllocation.length / itemsPerPage
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
//             <div className="max-w-9xl mx-auto">
//                 <h1 className="text-4xl font-extrabold text-gray-800 mb-8 leading-tight">
//                     Module Allocation
//                 </h1>

//                 {/* ===== UPDATED UI STARTS HERE ===== */}
//                 <form
//                     onSubmit={handleEditAllocation}
//                     className="bg-gray-200 p-6 rounded-xl shadow-md mt-6 mb-6"
//                 >
//                     <h2 className="text-xl font-bold text-gray-800 mb-4">
//                         Edit Allocated Modules
//                     </h2>

//                     <div className="grid grid-cols-1 md:grid-cols-2 ">

//                         {/* LEFT — Select Subscription */}
//                         <div>
//                             <label className="block text-sm font-semibold mb-2">
//                                 Select Subscription
//                             </label>

//                             <select
//                                 value={selectedSubscriptionId}
//                                 onChange={(e) => {
//                                     setSelectedSubscriptionId(e.target.value);
//                                     getAllocatedModulesBySubsId(e.target.value, "allocatedModules");
//                                 }}
//                                 className="w-48 border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-1 focus:ring-blue-500"
//                             >
//                                 <option value="" disabled> -- Select Subscription -- </option>
//                                 {activeSubscription?.map((sub) => (
//                                     <option key={sub.plan_id} value={sub.plan_id}>
//                                         {sub.plan_name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* RIGHT — Module Checkbox Grid   */}
//                         <div>
//                             <label className="block text-sm font-semibold mb-2">
//                                 Select Modules
//                             </label>

//                             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
//                                 {activeModules
//                                     ?.sort((a, b) =>
//                                         a.cmodule_name.localeCompare(b.cmodule_name)
//                                     )
//                                     .map((module) => (
//                                         <label
//                                             key={module.imodule_id}
//                                             className="flex items-center gap-2 p-2 border rounded-lg hover:bg-blue-50"
//                                         >
//                                             <input
//                                                 type="checkbox"
//                                                 checked={checkedModules.includes(module.imodule_id)}
//                                                 onChange={() => {
//                                                     setCheckedModules((prev) =>
//                                                         prev.includes(module.imodule_id)
//                                                             ? prev.filter((id) => id !== module.imodule_id)
//                                                             : [...prev, module.imodule_id]
//                                                     );
//                                                 }}
//                                             />
//                                             <span>{module.cmodule_name}</span>
//                                         </label>
//                                     ))}
//                             </div>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                         Update Allocation
//                     </button>
//                 </form>
//                 {/* ===== UPDATED UI ENDS HERE ===== */}

//                 <ModuleAllocationForm
//                     onSubmit={(data) => {
//                         createModuleAllocation(data);
//                     }}
//                     moduleAllocationObj={moduleAllocationObj}
//                 />

//                 {/* ===== MODULE ALLOCATION TABLE ===== */}
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6">
//                     <table className="min-w-full divide-y divide-gray-200 p-2">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="p-2">S.No </th>
//                                 <th className="p-2">Subscription</th>
//                                 <th className="p-2">Module</th>
//                                 <th className="p-2">Created By</th>
//                                 <th className="p-2">Updated By</th>
//                                 <th className="p-2">Status</th>
//                                 <th className="p-2">Option</th>
//                             </tr>
//                         </thead>

//                         <tbody className="bg-white divide-y text-center divide-gray-200">
//                             {sortedModuleAllocation.length > 0 ? (
//                                 // sortedModuleAllocation.map((module) => (
//                                     currentItems.map((module, index) => (
//                                     <tr key={module.id}>
//                                         <td className="p-2"> {(currentPage - 1) * itemsPerPage + index + 1} </td>
//                                         <td className="p-2">{module.subscriptionName}</td>
//                                         <td className="p-2">{module.moduleName}</td>
//                                         <td className="p-2">{module.createdBy}</td>
//                                         <td className="p-2">{module.updatedBy}</td>
//                                         <td className="p-2">
//                                             <span
//                                                 className={`px-3 py-1 rounded-full text-sm font-semibold 
//                                                 ${
//                                                     module.bactive
//                                                         ? "bg-green-100 text-green-700"
//                                                         : "bg-red-100 text-red-700"
//                                                 }`}
//                                             >
//                                                 {module.bactive ? "Active" : "Inactive"}
//                                             </span>
//                                         </td>

//                                         <td className="p-2 flex justify-evenly">
//                                             <button
//                                                 className="p-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600"
//                                                 onClick={() => {
//                                                     changeAllocationSts(module.id, !module.bactive);
//                                                     getAllModuleAllocation();
//                                                 }}
//                                             >
//                                                 <FaSyncAlt size={14} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="p-2 text-center">
//                                         No modules allocated
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//              <div className="flex justify-center gap-2 p-4">
//          <button
//                   disabled={currentPage === 1}
//                    onClick={() => setCurrentPage((p) => p - 1)}
//                    className={`px-3 py-1 border rounded disabled:opacity-50
//                    ${
//                      currentPage === totalPages
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "bg-white"
//                       }`}
//                       >
//                       Prev
//                       </button>

//                         <span className="px-3 py-1 text-sm">
//                             Page {currentPage} of {totalPages}
//                         </span>

//                  <button
//                     disabled={currentPage === totalPages}
//                      onClick={() => setCurrentPage((p) => p + 1)}
//                         className={`px-3 py-1 border rounded disabled:opacity-50
//                           ${
//                             currentPage === 1
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "bg-white"
//                             }`}
//                          >
//                            Next
//                        </button>
//                     </div>
//                 </div>
//             </div>

//             {snackbar.open && (
//                 <div className="fixed bottom-5 right-5 bg-red-400 text-white px-4 py-2 rounded shadow-lg">
//                     {snackbar.message}
//                 </div>
//             )}
//         </div>
//     );
// }

