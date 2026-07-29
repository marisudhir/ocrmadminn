import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyController } from "./companyController";
import CompanyForm from "./companyForm";
import { Link } from "react-router-dom";
// import formatDate from '../../../utils/formatDate';
import formatDate from "../../utils/formatDate";
import CommonTable from "../../context/TableStructure/CommonTable";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonCard from "../../context/CardStructure/CompanyCard";
import CommonSearchBar from "../../context/commonsearchbar/searchbar";
import { Phone, Crown, MapPin, Check } from "lucide-react";

// ---
// ## Reusable Company Card (CompanyGrid) Enhanced Design
// ---
// const CompanyGrid = ({ data }) => {
//   const initial = data.cCompany_name?.charAt(0).toUpperCase() || "?";

//   return (
//     <Link to={`/company-profile/${data.iCompany_id}`} className="block h-full">
//       <div
//         className=" bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out 
//         transform hover:-translate-y-0.5 overflow-hidden p-7 sm:p-8 border border-gray-200 flex flex-col h-full  "
//       >
//         <div className="flex items-start gap-5 mb-6">
//           <div
//             className="
//             w-14 h-14 flex items-center justify-center
//             bg-blue-50 text-blue-700 font-bold rounded-full text-2xl
//             flex-shrink-0
//             border border-blue-200 {/* Subtle border */}
//           "
//           >
//             {initial}
//           </div>
//           <div className="flex-grow">
//             <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight mb-0.5">
//               {data.cCompany_name}
//             </h2>
//             <p className="text-base text-blue-600 hover:underline">
//               {data.cWebsite}
//             </p>
//           </div>
//         </div>
//         <div className="border-t border-gray-100 my-4"></div>
//         <div className="text-base text-gray-700 flex-grow">
//           <div className="flex justify-between items-center mb-3">
//             <span className="font-medium text-gray-500">Phone:</span>
//             <span className="font-semibold text-gray-800">
//               {data.iPhone_no}
//             </span>
//           </div>
//           <div className="flex justify-between items-center mb-3">
//             <span className="font-medium text-gray-500">Plan:</span>
//             <span
//             >
//               {data.pricing_plan?.plan_name}
//             </span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-gray-500">City:</span>
//             <span className="font-semibold text-gray-800">
//               {data.city?.cCity_name}
//             </span>
//           </div>
//         </div>
//         <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
//           <span
//             className={`
//               text-sm font-semibold px-4 py-2 rounded-full
//               uppercase tracking-wide
//               ${data.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
//             `}
//           >
//             {data.bactive ? "Active" : "Inactive"}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// };
const CompanyGrid = ({ data }) => {
  const initial =
    data.cCompany_name?.charAt(0).toUpperCase() || "?";
  const companyUrl = data.cWebsite
    ? data.cWebsite.startsWith("http")
      ? data.cWebsite
      : `https://${data.cWebsite}`
    : null;

  return (
    <Link to={`/company-profile/${data.iCompany_id}`} className="block h-full">
      <CommonCard
        header={
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <div className="w-12 h-12 flex items-center justify-center bg-sky-100 text-sky-700 font-bold rounded-2xl text-lg border border-sky-200">
                {initial}
              </div>
              <span
                className={`absolute -right-1 -bottom-1 inline-flex items-center justify-center w-4 h-4 rounded-full shadow-sm ${
                  data.bactive ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <Check size={10} strokeWidth={3} className="text-white" />
              </span>
            </div>

            <div className="flex-grow min-w-0">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold text-slate-800 leading-tight mb-1 truncate">
                  {data.cCompany_name}
                </h2>
              </div>
              <a
                href={companyUrl || undefined}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-[#2737b8] hover:text-[#1f2ea3] hover:underline break-all"
              >
                {data.cWebsite || "-"}
              </a>
            </div>
          </div>
        }
      >
        <div className="grid gap-2.5 pb-1">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#E8ECFF] text-[#2737b8] shrink-0">
              <Phone size={16} strokeWidth={2} />
            </span>
            <span className="text-sm font-bold text-slate-700">
              {data.iPhone_no || "-"}
            </span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2.5">
            <span className="inline-flex items-center justify-center text-amber-500 shrink-0">
              <Crown size={16} strokeWidth={2} />
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-amber-700">
              {data.pricing_plan?.plan_name || "-"}
            </span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#E8ECFF] text-[#2737b8] shrink-0">
              <MapPin size={16} strokeWidth={2} />
            </span>
            <span className="text-sm font-bold text-slate-700">
              {data.city?.cCity_name || "-"}
            </span>
          </div>
        </div>
      </CommonCard>
    </Link>
  );
};

// ---
// ## Main Company Page (Company) Enhanced Design
// ---
const Company = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewType, setViewType] = useState("grid");
  const navigate = useNavigate();
  // const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  // const [sortConfig, setSortConfig] = useState({ key: 'dModifiedDate', direction: 'descending' });
  //   const [sortConfig, setSortConfig] = useState({
  //   key: 'cCompany_name',
  //   direction: 'ascending'
  // });
  const [sortConfig, setSortConfig] = useState({
    key: "dCreated_dt",
    direction: "descending",
  });

  const { companyData, fetchAllCompanyData, createCompany } =
    useCompanyController();

  useEffect(() => {
    fetchAllCompanyData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    // Ensure companyData is always an array
    const dataArray = Array.isArray(companyData) ? companyData : [];

    return dataArray.filter((company) => {
      // Ensure all properties exist before calling .toLowerCase()
      const companyName = company.cCompany_name || "";
      const website = company.cWebsite || "";
      const phone = company.iPhone_no || "";
      const cityName = company.city?.cCity_name || "";
      const planName = company.pricing_plan?.plan_name || "";
      const org = company.cOrg || "";
      const email = company.cEmail || "";
      const status = company.bactive ? "active" : "inactive";

      return `${companyName} ${website} ${phone} ${cityName} ${planName} ${org} ${email} ${status} `
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [companyData, searchQuery]);

  // Sort data based on sortConfig
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        // Handle nested properties for sorting
        if (sortConfig.key.includes(".")) {
          const [parentKey, childKey] = sortConfig.key.split(".");
          aValue = a[parentKey]?.[childKey];
          bValue = b[parentKey]?.[childKey];
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        // Handle string comparison (case-insensitive for most fields)
        if (typeof aValue === "string" && typeof bValue === "string") {
          // Special handling for dates
          // if (sortConfig.key === 'dModifiedDate' || sortConfig.key === 'dCreatedDate')
          if (
            sortConfig.key === "dModifiedDate" ||
            sortConfig.key === "dCreatedDate" ||
            sortConfig.key === "dCreated_dt"
          ) {
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            if (dateA < dateB) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (dateA > dateB) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
          }
          // Default string comparison
          if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        // Handle boolean (status)
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          if (aValue === bValue) return 0;
          if (sortConfig.direction === "ascending") {
            return aValue ? -1 : 1; // Active (true) comes before Inactive (false)
          } else {
            return aValue ? 1 : -1; // Inactive (false) comes before Active (true)
          }
        }
        // Default number comparison or fallback
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedData, itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      key = null;
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const companyColumns = [
    {
      header: "Name",
      render: (row) => row.cCompany_name,
    },
    {
      header: "Website",
      render: (row) => row.cWebsite || "-",
    },
    {
      header: "Created At",
      render: (row) => (row.dCreated_dt ? formatDate(row.dCreated_dt) : "-"),
    },
    {
      header: "Phone",
      render: (row) => row.iPhone_no || "-",
    },
    {
      header: "City",
      render: (row) => row.city?.cCity_name || "-",
    },
    {
      header: "Plan",
      render: (row) => (
        <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase bg-indigo-50 text-indigo-700">
          {row.pricing_plan?.plan_name || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide ${
            row.bactive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.bactive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white px-6 pb-6 pt-3 sm:px-8 sm:pb-8 sm:pt-4 font-sans antialiased">
      <div className="mb-7 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="shrink-0">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Companies <span className="text-[#2737b8]">Overview</span>
          </h1>
        </div>

        <div className="flex-1 xl:max-w-xl">
          <CommonSearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, website, phone, city, plan, org, or email..."
            className="max-w-full"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 flex-shrink-0">
          <button
            onClick={() => setViewType("grid")}
            className={`
              p-2.5 border border-[#2737b8]/15 rounded-2xl shadow-sm
              ${viewType === "grid" ? "bg-[#2737b8] text-white border-[#2737b8]" : "text-slate-500 bg-white"}
              hover:bg-[#E8ECFF] focus:outline-none focus:ring-2 focus:ring-[#2737b8]/20 transition-colors
            `}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3h5v5H3V3zm0 9h5v5H3v-5zm9-9h5v5h-5V3zm0 9h5v5h-5v-5z" />
            </svg>
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`
              p-2.5 border border-[#2737b8]/15 rounded-2xl shadow-sm
              ${viewType === "list" ? "bg-[#2737b8] text-white border-[#2737b8]" : "text-slate-500 bg-white"}
              hover:bg-[#E8ECFF] focus:outline-none focus:ring-2 focus:ring-[#2737b8]/20 transition-colors
            `}
            title="List View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
            </svg>
          </button>
          <button
            className="p-2 text-slate-400 hover:text-[#2737b8] focus:outline-none focus:ring-2 focus:ring-[#2737b8]/20 rounded-full transition-colors"
            title="Notifications"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            className="
              px-5 py-3 bg-[#2737b8] text-white font-semibold rounded-2xl
              shadow-[0_12px_30px_rgba(39,55,184,0.22)] hover:bg-[#1f2ea3] hover:shadow-[0_16px_34px_rgba(39,55,184,0.28)] transition-all
              flex items-center justify-center gap-2
            "
            onClick={() => setShowForm(true)}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Create Company
          </button>

          {/* Renders the form according to the state (Modal) */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div
                className="
                bg-white p-7 rounded-xl shadow-2xl
                w-full max-w-xl md:max-w-3xl lg:max-w-4xl
                transform scale-95 animate-fade-in
              "
              >
                <CompanyForm
                  onClose={() => setShowForm(false)}
                  onSuccess={fetchAllCompanyData}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Rendering of Grid or List */}
      {sortedData.length > 0 ? (
        viewType === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {paginatedData.map((company) => (
              <CompanyGrid key={company.iCompany_id} data={company} />
            ))}
          </div>
        ) : (
          <CommonTable
            columns={companyColumns}
            data={paginatedData}
            onRowClick={(row) =>
              navigate(`/company-profile/${row.iCompany_id}`)
            }
          />
        )
      ) : (
        <p className="text-slate-500 text-lg text-center col-span-full py-10">
          No companies match your search criteria.
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Company;


