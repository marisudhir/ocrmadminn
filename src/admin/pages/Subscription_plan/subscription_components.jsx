import { FiEdit, FiCheck } from "react-icons/fi";
import React, { useState } from "react";
import { subscriptionCRUDOperation } from "./subscription_controller";
import SubscriptionForm from "./subscription_form";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonTable from "../../context/TableStructure/CommonTable";

export default function SubscriptionPage() {
  const {
    subscriptions,
    loading,
    error,
    addSubscription,
    editSubscription,
    changeSubscriptionStatusController,
    currencies
  } = subscriptionCRUDOperation();

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);


  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    return a.plan_name.localeCompare(b.plan_name);
  });

  const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData,
} = usePagination(sortedSubscriptions, 10);

const subscriptionColumns = [

  {
    header: "Plan Name",
    render: (row) => (
      <span className="font-medium">{row.plan_name}</span>
    ),
  },
  {
    header: "Max Users",
    render: (row) => row.max_users,
  },
  {
    header: "Price",
    render: (row) => row.price,
  },
  {
    header: "Currency",
    render: (row) =>
      `${row.currency_code} ${row.currency_symbol}`,
  },
  {
    header: "Duration",
    render: (row) =>
      `${row.duration_in_months} Months`,
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
        className={`font-semibold ${
          row.bactive
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {row.bactive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() =>
            {
              setEditing({
                plan_id: row.plan_id,
                planName: row.plan_name,
                maxUserCount: row.max_users,
                price: row.price,
                currencyId: row.currencyId,
                durationId: row.durationId,
                storageLimit: row.storageLimit,
              });
              setShowForm(true);
            }
          }
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          <FiEdit />
        </button>

        <button
          onClick={() =>
            changeSubscriptionStatusController(
              row.plan_id,
              { status: !row.bactive }
            )
          }
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          <FiCheck />
        </button>
      </div>
    ),
  },
];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-extrabold text-gray-800">Subscriptions</h2>
        <button
          className="px-6 py-2.5 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 self-start sm:self-auto"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Subscription
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <SubscriptionForm
              onSubmit={(sub) => {
                if (editing) {
                  const payload = { ...sub, plan_id: editing.plan_id };
                  editSubscription(editing.plan_id, payload);
                  setEditing(null);
                } else {
                  addSubscription(sub);
                }
                setShowForm(false);
              }}
              initialData={editing}
              currencyList={currencies}
              onCancel={() => {
                setEditing(null);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      {loading && <div className="mb-4 text-gray-600">Loading...</div>}
      {error && <div className="mb-4 text-red-500">Error: {error}</div>}

      {/* TABLE */}
     
        <CommonTable
  columns={subscriptionColumns}
  data={paginatedData}
/>

        <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  setCurrentPage={setCurrentPage}
/>
      </div>
    
  );

}



// import { FiEdit, FiCheck } from "react-icons/fi";
// import React, { useState } from "react";
// import { subscriptionCRUDOperation } from "./subscription_controller";
// import SubscriptionForm from "./subscription_form";
// import Pagination from "../../context/Pagination/pagination";
// import usePagination from "../../hooks/usePagination";

// export default function SubscriptionPage() {
//   const {
//     subscriptions,
//     loading,
//     error,
//     addSubscription,
//     editSubscription,
//     changeSubscriptionStatusController,
//     currencies
//   } = subscriptionCRUDOperation();

//   const [editing, setEditing] = useState(null);
//   const sortedSubscriptions = [...subscriptions].sort((a, b) => {
//     return a.plan_name.localeCompare(b.plan_name);
//   });

//   const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData,
// } = usePagination(sortedSubscriptions, 10);


//   if (loading) return <p className="text-gray-600">Loading...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;
  
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>

//       {/* FORM remains same */}
//       <SubscriptionForm
//         onSubmit={(sub) => {
//           if (editing) {
//             const payload = { ...sub, plan_id: editing.plan_id };
//             editSubscription(editing.plan_id, payload);
//             setEditing(null);
//           } else {
//             addSubscription(sub);
//           }
//         }}
//         initialData={editing}
//         currencyList={currencies}
//       />

//       {/* TABLE */}
//       <div className="overflow-x-auto mt-6">
//         <table className="min-w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border w-12">S.No</th> 
//               <th className="px-4 py-2 border">Plan Name</th>
//               <th className="px-4 py-2 border">Max Users</th>
//               <th className="px-4 py-2 border">Price</th>
//               <th className="px-4 py-2 border">Currency</th>
//               <th className="px-4 py-2 border">Duration</th>
//               <th className="px-4 py-2 border">Created By</th>
//               <th className="px-4 py-2 border">Updated By</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {/* USE THE SORTED ARRAY HERE */}
//             {/* {sortedSubscriptions.map((sub, index) => ( */}
//             {paginatedData.map((sub, index) => (

//               <tr key={sub.plan_id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                 <td className="px-4 py-2 border text-center">{(currentPage - 1) * 10 + index + 1}</td>
//                 <td className="px-4 py-2 border text-center font-medium">{sub.plan_name}</td>
//                 <td className="px-4 py-2 border text-center">{sub.max_users}</td>
//                 <td className="px-4 py-2 border text-center">{sub.price}</td>
//                 <td className="px-4 py-2 border text-center">{sub.currency_code} {sub.currency_symbol}</td>
//                 <td className="px-4 py-2 border text-center">{sub.duration_in_months} Months</td>
//                 <td className="px-4 py-2 border text-center">{sub.createdBy}</td>
//                 <td className="px-4 py-2 border text-center">{sub.updatedBy}</td>
//                 <td className={`px-4 py-2 border text-center font-semibold ${sub.bactive ? "text-green-600" : "text-red-600"}`}>
//                   {sub.bactive ? "Active" : "Inactive"}
//                 </td>
//                 <td className="px-4 py-2 border text-center space-x-2">
//                   <button
//                     onClick={() => setEditing({
//                         plan_id: sub.plan_id,
//                         planName: sub.plan_name,
//                         maxUserCount: sub.max_users,
//                         price: sub.price,
//                         currencyId: sub.currencyId,   
//                         durationId: sub.durationId,   
//                         storageLimit: sub.storageLimit
//                       })
//                     }
//                     className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     <FiEdit />
//                   </button>
//                   <button
//                     onClick={() => changeSubscriptionStatusController(sub.plan_id, { status: !sub.bactive })}
//                     className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                   >
//                     <FiCheck />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//         />
//       </div>
//     </div>
//   );

// }




