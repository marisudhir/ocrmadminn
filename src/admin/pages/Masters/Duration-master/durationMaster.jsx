import React, { useState, useEffect } from "react";
import useDurationController from "./durationController";
import DurationForm from "./sub-component/duration-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../context/Pagination/pagination";
import usePagination from "../../../hooks/usePagination";
import CommonTable from "../../../context/TableStructure/CommonTable";
import AddNewButton from "../../../context/commonbutton/AddNewButton";
import CommonBackButton from "../../../context/commonbutton/CommonBackButton";
import CommonSearchBar from "../../../context/commonsearchbar/searchbar";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return dateString;
  }
};

const DurationMaster = () => {
  const {
    durations: rawDurations = [],
    fetchDuration,
    createDuration,
    updateDuration,
    deleteDuration,
    loading,
    error,
  } = useDurationController();

  const [showForm, setShowForm] = useState(false);

  const [currentDuration, setCurrentDuration] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState(""); // New state for form errors
  const [searchQuery, setSearchQuery] = useState("");

  // normalize durations to array
  const durations = Array.isArray(rawDurations)
    ? rawDurations
        .filter((d) => d?.bactive === true)
        .sort((a, b) => {
          const dateA = new Date(a?.updated_at ?? a?.created_at ?? a?.cCreate_dt ?? 0);
          const dateB = new Date(b?.updated_at ?? b?.created_at ?? b?.cCreate_dt ?? 0);
          return dateB - dateA; // latest first
        })
    : [];

  const filteredDurations = durations.filter((duration) =>
    `${duration?.duration_in_months ?? ""}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredDurations, itemsPerPage);

const durationColumns = [
  {
    header: "Duration (Months)",
    render: (row) => row.duration_in_months ?? "-",
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.bactive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
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
          onClick={() => handleEdit(row)}
          disabled={loading}
        >
          <EditIcon fontSize="small" className="text-indigo-600" />
        </button>

        <button
          onClick={() => handleDelete(row.plan_duration_id)}
          disabled={loading}
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];

  useEffect(() => {
    fetchDuration();
  }, [fetchDuration]);

  // Clear form error when form opens/closes
  useEffect(() => {
    if (showForm) {
      setFormError("");
    }
  }, [showForm]);

  const handleEdit = (duration) => {
    setCurrentDuration(duration);
    setFormError(""); 
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentDuration(null);
    setFormError(""); 
    setShowForm(true);
  };
const handleFormSubmit = async (formData) => {
  try {
    setFormError("");
    
    // Validate form data
    if (!formData.duration_in_months || formData.duration_in_months <= 0) {
      setFormError("Duration in months is required and must be greater than 0");
      return;
    }

    let success = false;

    // backend id is plan_duration_id
    if (formData.plan_duration_id) {
      success = await updateDuration(formData.plan_duration_id, formData);
    } else {
      success = await createDuration(formData);
    }

    if (success) {
      setSuccessMessage(
        formData.plan_duration_id ? "Duration updated successfully!"  : "Duration added successfully!"
      );

      // auto-clear message
      setTimeout(() => setSuccessMessage(""), 3000);

      setShowForm(false);
      await fetchDuration();
    }
  } catch (err) {
    console.error("Form submission error:", err);
    
    // Extract the actual backend error message
    const backendError = err.response?.data?.error || err.response?.data?.message || err.message || "An error occurred while saving duration";
    setFormError(backendError);
  }
};

  const handleDelete = async (id) => {
    if (!id) {
      setFormError("Invalid duration ID");
      return;
    }
    
    if (window.confirm("Are you sure you want to deactivate this duration?")) {
      try {
        const ok = await deleteDuration(id);
        if (ok) {
          setSuccessMessage("Duration deactivated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
          await fetchDuration();
        } else {
          setFormError("Failed to deactivate duration");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setFormError("Failed to deactivate duration. Please try again.");
      }
    }
  };

  if (loading && durations.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-9xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="mb-6 border-b pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 lg:min-w-fit">
              <CommonBackButton
                to="/masters"
                title="Duration Master"
                className="mb-0"
                buttonClassName="border border-gray-300 px-2 py-1 hover:bg-gray-100"
                titleClassName="text-3xl font-extrabold text-gray-800"
              />
            </div>

            <div className="w-full lg:max-w-xl">
              <CommonSearchBar
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search durations..."
                className="max-w-full"
              />
            </div>

            <div className="flex justify-start lg:justify-end lg:min-w-fit">
              <AddNewButton
                label="+ Add Duration"
                onClick={handleAdd}
                disabled={loading}
                className="px-4 py-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded border border-green-200">
            {successMessage}
          </div>
        )}


        {/* Form Error Message */}
        {formError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-200">
            {formError}
            <button
              onClick={() => setFormError("")}
              className="float-right text-red-600 hover:text-red-800 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <DurationForm
              initialData={currentDuration || {}}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading}
              error={formError} 
            />
          </div>
        )}

        {/* Table */}
        <CommonTable
          columns={durationColumns}
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

export default DurationMaster;



// import React, { useState, useEffect } from "react";
// import useDurationController from "./durationController";
// import DurationForm from "./sub-component/duration-form";
// import { useNavigate } from "react-router-dom";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Pagination from "../../../context/Pagination/pagination";
// import usePagination from "../../../hooks/usePagination";
// import CommonTable from "../../../context/TableStructure/CommonTable";

// const DurationMaster = () => {
//   const navigate = useNavigate();
//   const {
//     durations: rawDurations = [],
//     fetchDuration,
//     createDuration,
//     updateDuration,
//     deleteDuration,
//     loading,
//   } = useDurationController();

//   const [showForm, setShowForm] = useState(false);
//   const [currentDuration, setCurrentDuration] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [formError, setFormError] = useState(""); 

//   // normalize durations to array
//   const durations = Array.isArray(rawDurations)
//     ? rawDurations
//         .filter((d) => d?.bactive === true)
//         .sort((a, b) => {
//           const dateA = new Date(a?.updated_at ?? a?.created_at ?? a?.cCreate_dt ?? 0);
//           const dateB = new Date(b?.updated_at ?? b?.created_at ?? b?.cCreate_dt ?? 0);
//           return dateB - dateA; 
//         })
//     : [];

//     const itemsPerPage = 10;

// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: currentItems,
// } = usePagination(durations, itemsPerPage);

// const durationColumns = [
//   {
//     header: "Duration (Months)",
//     render: (row) => row.duration_in_months ?? "-",
//   },
//   {
//     header: "Status",
//     render: (row) => (
//       <span
//         className={`px-2 py-1 text-xs font-semibold rounded-full ${
//           row.bactive
//             ? "bg-green-100 text-green-800"
//             : "bg-red-100 text-red-800"
//         }`}
//       >
//         {row.bactive ? "Active" : "Inactive"}
//       </span>
//     ),
//   },
//   {
//     header: "Actions",
//     render: (row) => (
//       <div className="flex justify-center gap-3">
//         <button
//           onClick={() => handleEdit(row)}
//           disabled={loading}
//         >
//           <EditIcon fontSize="small" className="text-indigo-600" />
//         </button>

//         <button
//           onClick={() => handleDelete(row.plan_duration_id)}
//           disabled={loading}
//         >
//           <DeleteIcon fontSize="small" className="text-red-600" />
//         </button>
//       </div>
//     ),
//   },
// ];

//   useEffect(() => {
//     fetchDuration();
//   }, [fetchDuration]);

//   // Clear form error when form opens/closes
//   useEffect(() => {
//     if (showForm) {
//       setFormError("");
//     }
//   }, [showForm]);

//   const handleEdit = (duration) => {
//     setCurrentDuration(duration);
//     setFormError(""); 
//     setShowForm(true);
//   };

//   const handleAdd = () => {
//     setCurrentDuration(null);
//     setFormError(""); 
//     setShowForm(true);
//   };
// const handleFormSubmit = async (formData) => {
//   try {
//     setFormError("");
    
//     // Validate form data
//     if (!formData.duration_in_months || formData.duration_in_months <= 0) {
//       setFormError("Duration in months is required and must be greater than 0");
//       return;
//     }

//     let success = false;

//     // backend id is plan_duration_id
//     if (formData.plan_duration_id) {
//       success = await updateDuration(formData.plan_duration_id, formData);
//     } else {
//       success = await createDuration(formData);
//     }

//     if (success) {
//       setSuccessMessage(
//         formData.plan_duration_id ? "Duration updated successfully!"  : "Duration added successfully!"
//       );

//       // auto-clear message
//       setTimeout(() => setSuccessMessage(""), 3000);

//       setShowForm(false);
//       await fetchDuration();
//     }
//   } catch (err) {
//     console.error("Form submission error:", err);
    
//     // Extract the actual backend error message
//     const backendError = err.response?.data?.error || err.response?.data?.message || err.message || "An error occurred while saving duration";
//     setFormError(backendError);
//   }
// };

//   const handleDelete = async (id) => {
//     if (!id) {
//       setFormError("Invalid duration ID");
//       return;
//     }
    
//     if (window.confirm("Are you sure you want to deactivate this duration?")) {
//       try {
//         const ok = await deleteDuration(id);
//         if (ok) {
//           setSuccessMessage("Duration deactivated successfully!");
//           setTimeout(() => setSuccessMessage(""), 3000);
//           await fetchDuration();
//         } else {
//           setFormError("Failed to deactivate duration");
//         }
//       } catch (err) {
//         console.error("Delete error:", err);
//         setFormError("Failed to deactivate duration. Please try again.");
//       }
//     }
//   };

//   if (loading && durations.length === 0) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8 font-sans">
//       <div className="max-w-9xl mx-auto bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex justify-between items-center mb-6 border-b pb-4">
//          <button
//           onClick={() => navigate("/masters")}
//           className="text-2xl text-gray-600 hover:text-gray-900 
//                     border border-gray-300 rounded-md 
//                     px-2 py-1 hover:bg-gray-100"
//           title="Back to Common Masters"
//         >
//           &larr;
//         </button>
//         <h1 className="text-3xl font-extrabold text-gray-800">Duration Master</h1>
         

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-4 p-3 bg-green-100 text-green-800 rounded border border-green-200">
//             {successMessage}
//           </div>
//         )}


//         {/* Form Error Message */}
//         {formError && (
//           <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-200">
//             {formError}
//             <button
//               onClick={() => setFormError("")}
//               className="float-right text-red-600 hover:text-red-800 font-bold"
//             >
//               &times;
//             </button>
//           </div>
//         )}

//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 relative -left-[10px]" disabled={loading} >
//               + Add Duration
//             </button>
//           </div>

//           <div className="text-sm text-gray-600"> Total: <span className="font-medium">{durations.length}</span> </div>
//         </div>
//     </div>

//         {/* Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <DurationForm
//               initialData={currentDuration || {}}
//               onSubmit={handleFormSubmit}
//               onClose={() => setShowForm(false)}
//               loading={loading}
//               error={formError} 
//             />
//           </div>
//         )}

//         {/* Table */}
//         <CommonTable
//           columns={durationColumns}
//           data={currentItems}
//           currentPage={currentPage}
//           itemsPerPage={itemsPerPage}
//         />

//                <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 setCurrentPage={setCurrentPage}
//               />
//       </div>
//     </div>
//   );
// };

// export default DurationMaster;

