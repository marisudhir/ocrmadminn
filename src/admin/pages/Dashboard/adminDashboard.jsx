import { useMemo, useState } from "react";
import Card from "../../components/card";
import { useDashboardController } from "./dashboardController";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonTable from "../../context/TableStructure/CommonTable";

function AdminDashboard() {
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("activeUsers");

  const {
    dashboardData,
    activeUsersData,
    activeUsersLoading,
  } = useDashboardController();

  const resellerList = useMemo(() => dashboardData?.resellerRanking || [], [dashboardData]);
  const {
    currentPage: resellerPage,
    setCurrentPage: setResellerPage,
    totalPages: resellerTotalPages,
    paginatedData: paginatedResellers,
  } = usePagination(resellerList, itemsPerPage);

  const activeUsersList = useMemo(() => activeUsersData?.details || [], [activeUsersData]);
  const {
    currentPage: activeUsersPage,
    setCurrentPage: setActiveUsersPage,
    totalPages: activeUsersTotalPages,
    paginatedData: paginatedActiveUsers,
  } = usePagination(activeUsersList, itemsPerPage);

  const activeUsersCount = activeUsersList.length;
  const activeCompanyCount = useMemo(() => {
    return new Set(
      activeUsersList
        .map((item) => item?.company)
        .filter((company) => typeof company === "string" && company.trim() !== "")
    ).size;
  }, [activeUsersList]);

  const activeUsersTotalLeads = useMemo(() => {
    return activeUsersList.reduce((sum, item) => {
      const leads = Number(item?.total_leads);
      return sum + (Number.isFinite(leads) ? leads : 0);
    }, 0);
  }, [activeUsersList]);

  const resellerColumns = [
    {
      header: "Name",
      accessor: "cFull_name",
      render: (row) => (
        <span className="font-medium text-gray-800">{row.cFull_name}</span>
      ),
    },
    {
      header: "Email",
      accessor: "cEmail",
    },
    {
      header: "Company",
      accessor: "iCompany_id",
      render: (row) => (
        <span className="text-center block ">{row.iCompany_id}</span>
      ),
    },
    {
      header: "Active Clients",
      accessor: "activeClients",
    },
    {
      header: "Commission Earned",
      accessor: "companyRevenue",
      render: (row) => `Rs ${row.companyRevenue}`,
    },
    {
      header: "Admin ID",
      accessor: "iUser_id",
    },
    {
      header: "Status",
      accessor: "bactive",
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            row.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {row.bactive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const activeUsersColumns = [
    {
      header: "User Name",
      accessor: "user_name",
      render: (row) => (
        <span className="font-medium text-gray-800">{row.user_name || "-"}</span>
      ),
    },
    { header: "Role", accessor: "role" },
    { header: "Company", accessor: "company" },
    {
      header: (
        <>
          Total
          <br />
          Leads
        </>
      ),
      accessor: "total_leads",
    },
    {
      header: "Active Session Count",
      accessor: "active_session_count",
      render: (row) => row?.active_session_count ?? "-",
    },
    {
      header: (
        <>
          Using
          <br />
          Member
        </>
      ),
      accessor: "using_member",
      render: (row) => row?.using_member ?? "-",
    },
    { header: "Session", accessor: "session_slug" },
    {
      header: "Login At",
      accessor: "login_at",
      render: (row) => {
        const date = row?.login_at ? new Date(row.login_at) : null;
        return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "-";
      },
    },
    {
      header: "Last Seen",
      accessor: "last_seen_at",
      render: (row) => {
        const date = row?.last_seen_at ? new Date(row.last_seen_at) : null;
        return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "-";
      },
    },
    {
      header: (
        <>
          Login
          <br />
          Method
        </>
      ),
      accessor: "login_method",
      render: (row) => row?.login_method || "-",
    },
    {
      header: "Device",
      accessor: "user_agent",
      render: (row) => row?.user_agent || "-",
    },
    {
      header: "IP Address",
      accessor: "ip_address",
      render: (row) => row?.ip_address || "-",
    },
    {
      header: "Expires At",
      accessor: "expires_at",
      render: (row) => {
        const date = row?.expires_at ? new Date(row.expires_at) : null;
        return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "-";
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 font-sans antialiased">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10 tracking-tight">
        <span className="text-gray-800">Admin</span> <span className="text-[#2737b8]">Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card
          title="Total Company"
          count={dashboardData?.totalCompany}
          icon="/icons/company_list.png"
          size="compact"
        />

        <Card
          title="Total Reseller"
          count={dashboardData?.totalReseller}
          icon="/icons/reseller_image.jpg"
          size="compact"
        />

        <Card
          title="Total Users"
          count={
            <>
              {dashboardData?.totalUsers}
              <div className="text-sm text-gray-600 mt-2 font-medium">
                <span className="text-green-600">Active: {dashboardData?.activeUsers}</span>
                <span className="ml-3 text-red-600">Inactive: {dashboardData?.inActiveUsers}</span>
              </div>
            </>
          }
          icon="/icons/crm_users.jpg"
          size="compact"
        />

        <Card
          title="Total Leads"
          count={dashboardData?.totalLeads ?? 0}
          icon="/icons/potential.svg"
          size="compact"
        />

        <Card
          title="Currently Logged In"
          count={
            <>
              {activeUsersCount}
              <div className="text-sm text-gray-600 mt-2 font-medium">
                <span className="text-blue-700">All active sessions</span>
              </div>
            </>
          }
          icon="/icons/user.png"
          size="compact"
        />
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "reseller"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("reseller")}
            >
              Reseller Rankings
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "activeUsers"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("activeUsers")}
            >
              Currently Logged In Users
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === "reseller" ? "Reseller Rankings" : "Current Login User Details"}
          </h2>
        </div>

        {activeTab === "activeUsers" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs text-gray-600">Active Users</p>
              <p className="text-xl font-bold text-blue-700">{activeUsersCount}</p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-3">
              <p className="text-xs text-gray-600">Companies Online</p>
              <p className="text-xl font-bold text-green-700">{activeCompanyCount}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs text-gray-600">Total Leads (Online Users)</p>
              <p className="text-xl font-bold text-amber-700">{activeUsersTotalLeads}</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <CommonTable
            columns={activeTab === "reseller" ? resellerColumns : activeUsersColumns}
            data={activeTab === "reseller" ? paginatedResellers : paginatedActiveUsers}
            currentPage={activeTab === "reseller" ? resellerPage : activeUsersPage}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {activeTab === "activeUsers" && activeUsersLoading && (
          <p className="text-sm text-gray-500 mt-3">Refreshing active users...</p>
        )}

        <Pagination
          currentPage={activeTab === "reseller" ? resellerPage : activeUsersPage}
          totalPages={activeTab === "reseller" ? resellerTotalPages : activeUsersTotalPages}
          setCurrentPage={activeTab === "reseller" ? setResellerPage : setActiveUsersPage}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
