import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResellerController } from '../Reseller/resellerController';
import CompanyForm from '../Company/companyForm';
import formatDate from '../../utils/formatDate';
import Card from '../../components/card';
import { useDashboardController } from '../Dashboard/dashboardController';
import Pagination from '../../context/Pagination/pagination';
import usePagination from '../../hooks/usePagination';
import CommonTable from '../../context/TableStructure/CommonTable';
import CommonSearchBar from '../../context/commonsearchbar/searchbar';

const ResellerGrid = ({ data }) => {
  const navigate = useNavigate();

  const handleRowClick = (resellerId) => {
    navigate(`/reseller-profile/${resellerId}`);
  };

  const resellerColumns = [
    {
      header: "Reseller ID",
      render: (row) => row.ireseller_id,
    },
    {
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
            {row.creseller_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="font-semibold">
            {row.creseller_name || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      render: (row) => row.cEmail || "-",
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          row.bactive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {row.bactive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created Date",
      render: (row) => formatDate(row.dCreated_dt),
    },
  ];

  return (
    <CommonTable
      columns={resellerColumns}
      data={data}
      onRowClick={(row) => handleRowClick(row.ireseller_id)}
    />
  );
};



// Main Component
const Reseller = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { fetchAllResellerData, resellerData } = useResellerController();
  const { dashboardData } = useDashboardController();

  useEffect(() => {
    fetchAllResellerData();
  }, []);

  const filteredData = resellerData.filter((reseller) =>
    `${reseller.cEmail} ${reseller.creseller_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

const itemsPerPage = 10;

const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData,
} = usePagination(filteredData, itemsPerPage);


  // ✅ reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 ">
      <div className="max-w-9xl mx-auto">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
          <div className="shrink-0">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Reseller <span className="text-[#2737b8]">Dashboard</span>
            </h1>
          </div>

          <div className="flex-1 xl:max-w-xl">
            <CommonSearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resellers by Name or Email..."
              className="max-w-full"
            />
          </div>

          <button
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 self-start xl:self-auto"
            onClick={() => setShowForm(true)}
          >
            + Add Reseller
          </button>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
                <CompanyForm
                  onClose={() => setShowForm(false)}
                  onSuccess={fetchAllResellerData}
                />
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card title="Total Company" count={dashboardData?.totalCompany} icon="/icons/company_list.png" size="compact" />
          <Card title="Total Reseller" count={dashboardData?.totalReseller} icon="/icons/reseller_count.jpg" size="compact" />
          <Card
            title="Total Users"
            count={
              <>
                {dashboardData?.totalUsers}
                <div className="text-sm text-gray-600 mt-2">
                  <span className="text-green-600">Active: {dashboardData?.activeUsers}</span>
                  <span className="ml-3 text-red-600">Inactive: {dashboardData?.inActiveUsers}</span>
                </div>
              </>
            }
            icon="/icons/crm_users.jpg"
            size="compact"
          />
        </div>

        {/* Reseller Grid */}
        <div className="mt-8">
          {filteredData.length > 0 ? (
            <>
              <ResellerGrid data={paginatedData} />


                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />

            </>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No resellers match your search.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reseller;

