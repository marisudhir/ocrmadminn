import { useEffect, useState, useMemo } from "react";
import { useLeadLostReason } from "./lead_lost_reason_controller";
import { useSharedController } from "../../../api/shared/controller";
import { LostReasonForm } from "./lead_lost_reason_form";
import formatDate from '../../../utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../context/Pagination/pagination";
import usePagination from "../../../hooks/usePagination";
import CommonTable from "../../../context/TableStructure/CommonTable";
import CommonBackButton from "../../../context/commonbutton/CommonBackButton";

export function LeadLostReason({ companyId, onBack }) {
  const {
    leadLostReasons,
    loading,
    error,
    message,
    getLeadLostReasonByCompanyId,
    createLeadLostReasonController,
    updateLeadLostReasonController,
    deleteLeadLostReasonController,
  } = useLeadLostReason();

  const { companies, fetchCompanies } = useSharedController();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);


  //  Fetch data based on companyId
  useEffect(() => {
    if (companyId) {
      getLeadLostReasonByCompanyId(companyId);
    }
    fetchCompanies();
  }, [companyId]);

  //  Filter data 
  // const filteredReasons = useMemo(() => {
  //   return leadLostReasons || [];
  // }, [leadLostReasons]);

  const filteredReasons = useMemo(() => {
  if (!Array.isArray(leadLostReasons)) return [];

  return [...leadLostReasons].sort((a, b) => {
    const dateA = new Date(
      a.updated_dt || a.created_dt || 0
    ).getTime();

    const dateB = new Date(
      b.updated_dt || b.created_dt || 0
    ).getTime();

    return dateB - dateA; 
  });
}, [leadLostReasons]);

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
  
} = usePagination(filteredReasons, itemsPerPage);
const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

const lostReasonColumns = [
  {
    header: "Reason",
    render: (row) => row.reason,
  },
  {
    header: "Created At",
    render: (row) =>
      formatDate(row.createdAt) || "Unknown Date",
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Actions",
    render: (row) => (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            setEditItem(row);
            setShowForm(true);
          }}
        >
          <EditIcon fontSize="small" className="text-blue-600" />
        </button>

        <button
          onClick={() => handleDelete(row.lostReasonId)}
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


useEffect(() => {
  setCurrentPage(1);
}, [companyId, filteredReasons.length]);


  const handleSubmit = async (formData) => {
    let success = false;
    if (editItem) {
      success = await updateLeadLostReasonController(
        editItem.lostReasonId, 
        formData
      );
    } else {
      success = await createLeadLostReasonController(formData);
    }
    
    if (success) {
      setShowForm(false);
      setEditItem(null);
      getLeadLostReasonByCompanyId(companyId); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reason?")) {
      try {
        const success = await deleteLeadLostReasonController(id, companyId);
        
        if (success) {
          getLeadLostReasonByCompanyId(companyId);
          alert("Reason deleted successfully");
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead lost reasons...</p>
      </div>
    );
  }

  return (
    <div className={companyId ? "font-sans antialiased" : "min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased"}>
      <div className="max-w-9xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          {companyId ? (
            <CommonBackButton title="Lead Lost Reasons" className="mb-0" onClick={onBack} />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight"> Lead Lost Reasons </h1>
          )}
          <button 
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            onClick={() => { setEditItem(null); setShowForm(true); }}
          >
            + Add New Reason
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
            {message}
          </div>
        )}


         {showForm && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
              onClick={() => { setShowForm(false); setEditItem(null); }}   
            >
              <div
                className="relative bg-white rounded-xl p-6 shadow-xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}  
              >
                <LostReasonForm
                  editData={editItem}
                  onSubmit={handleSubmit}
                  onCancel={() => { setShowForm(false); setEditItem(null); }}
                  companyId={companyId}
                />
              </div>
            </div>
          )}


        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <CommonTable
          columns={lostReasonColumns}
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


