import React, { useState, useEffect, useMemo } from 'react';
import LeadStatusForm from '../../../admin/pages/Masters/Status/Sub-Components/leadStatusForm';
import { useLeadStatusController } from '../../../admin/pages/Masters/Status/leadStatusController';
import formatDate from '../../../admin/utils/formatDate';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '../../../admin/context/Pagination/pagination';
import usePagination from '../../../admin/hooks/usePagination';
import CommonTable from '../../../admin/context/TableStructure/CommonTable';
import AddNewButton from '../../../admin/context/commonbutton/AddNewButton';
import CommonBackButton from '../../../admin/context/commonbutton/CommonBackButton';

  const LeadStatus = ({ companyId }) => {
  const { 
    leadStatus, 
    fetchLeadStatus, 
    loading, 
    error, 
    updateLeadStatus, 
    deleteLeadStatus 
  } = useLeadStatusController();
  
  const [showForm, setShowForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
 
const itemsPerPage = 10;

  const filteredLeadStatus = useMemo(() => {
  if (!leadStatus || leadStatus.length === 0) return [];

  const filtered = !companyId
    ? leadStatus
    : leadStatus.filter(
        status => status.icompany_id === companyId && status.bactive === true
      );
  return [...filtered].sort((a, b) => {
    return (
      new Date(b.updated_at || b.dcreated_dt).getTime() -
      new Date(a.updated_at || a.dcreated_dt).getTime()
    );
  });

}, [leadStatus, companyId]);

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentItems,
} = usePagination(filteredLeadStatus, itemsPerPage);

const leadStatusColumns = [
  {
    header: "Status Name",
    render: (row) => row.clead_name || "Unknown",
  },
  {
    header: "Order ID",
    render: (row) => row.orderId || "-",
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
          onClick={() => handleDelete(row.ilead_status_id)}
          title="Delete"
        >
          <DeleteIcon fontSize="small" className="text-red-600" />
        </button>
      </div>
    ),
  },
];


useEffect(() => {
  setCurrentPage(1);
}, [filteredLeadStatus.length]);
  

  // Handle Edit
  const handleEdit = (status) => {
    setEditingStatus(status);
    setShowForm(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead status?')) {
      const success = await deleteLeadStatus(id);
      if (success) {
        alert('Lead status deleted successfully!');
      }
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingStatus(null);
  };

  // Handle form success
  const handleFormSuccess = () => {
    fetchLeadStatus();
    handleFormClose();
  };

  useEffect(() => {
    fetchLeadStatus();
  }, []);

  if (loading && leadStatus.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead status data...</p>
      </div>
    );
  }

  if (error && leadStatus.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
        <div className="min-h-screen bg-gray-100 p-6 sm:p-8 font-sans antialiased">
    {/* <div className="min-h-screen bg-gradient-to-br from-black via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased"> */}
      <div className="max-w-9xl mx-auto ">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <CommonBackButton title="Lead Statuses" className="mb-0" />
          <AddNewButton
            label="+ Add Lead Status"
            onClick={() => setShowForm(true)}
          />
        </div>
        
        {/* Form Modal */}
        {showForm && (
         <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    onClick={handleFormClose}  
  >
    <div
      className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4"
      onClick={(e) => e.stopPropagation()} 
    >
      <LeadStatusForm 
        onClose={handleFormClose} 
        onSuccess={handleFormSuccess}
        editingStatus={editingStatus}
        companyId={companyId}               
      />
    </div>
  </div>
        )}

        {/* Lead Status Table */}
        <CommonTable
  columns={leadStatusColumns}
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

export default LeadStatus;
