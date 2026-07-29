import React, { useState, useEffect, useContext, useMemo } from "react";
import { FaCrown, FaEnvelope, FaCity, FaTh, FaBars, FaSpinner,} from "react-icons/fa";
import ProfileHeader from "../../Components/common/ProfileHeader";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Pagination from "../../admin/context/Pagination/pagination";
import usePagination from "../../admin/hooks/usePagination";
import CommonTable from "../../admin/context/TableStructure/CommonTable";
import CommonCard from "../../admin/context/CardStructure/UserCard";

const UserPage = () => {
  const { users: user } = useContext(UserContext);
  const userModules = [];
  const companyUserLimit = Number.MAX_SAFE_INTEGER;
  // const effectRan = useRef(false);
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const navigate = useNavigate();

  const dynamicUserCreate = useMemo(() => {
    const filtered = userModules.filter(
      (attr) =>
        attr.module_id === 6 &&
        attr.bactive === true &&
        (attr.attributes_id === 16 || attr.attribute_name === "User Create")
    );

    return Array.from(new Map(filtered.map((item) => [item.attributes_id, item])).values());
  }, [userModules]);


  const getDecodedToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage.");
      return null;
    }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const getUserRole = () => {
    const payload = getDecodedToken();
    return payload?.roleType?.toLowerCase();
  };

  // Function to navigate to the user creation page
  const createUser = () => {
    if (users.length >= companyUserLimit) {
      setShowLimitPopup(true);
      return;
    }
    navigate("/users");
  };

 
useEffect(() => {
  if (user) {
    setUsers(user);
    setUserRole(getUserRole());
    setLoading(false);
  }
}, [user]);

  useEffect(() => {
    let currentFilteredUsers = users.filter((user) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        user.cFull_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.cEmail.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.cCompany_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.cUser_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.role?.cRole_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.cjob_title?.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.cCity?.toLowerCase().includes(lowerCaseSearchTerm);

      if (activeTab === "active") {
        return matchesSearch && user.bactive === true;
      } else if (activeTab === "inactive") {
        return matchesSearch && user.bactive === false;
      }
      return matchesSearch;
    });

    const sortedUsers = [...currentFilteredUsers].sort((a, b) =>
      sortOrder === "asc"
        ? a.cFull_name.localeCompare(b.cFull_name)
        : b.cFull_name.localeCompare(a.cFull_name)
    );

    setFiltered(sortedUsers);
    setCurrentPage(1);
  }, [searchTerm, users, activeTab, sortOrder]);
  
  const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: displayedUsers,
} = usePagination(filtered, 9);


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const goToLeadsPage = (userId) => {
    navigate(`/userprofile/${userId}`);
  };

const userColumns = [
  { header: "Name", accessor: "cFull_name" },

  {
    header: "Role",
    render: (user) => user.role?.cRole_name || "-",
  },

  { header: "Email", accessor: "cEmail" },
  { header: "Job Title", accessor: "cjob_title" },

  {
    header: "Status",
    render: (user) => (
      <span className={user.bactive ? "text-green-600 font-semibold" : "text-red-600 font-semibold" }>
        {user.bactive ? "Active" : "Inactive"}
      </span>
    ),
  },
];



  return (
    <div className="p-6 min-h-screen text-gray-800">
      <ProfileHeader />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-1/2 md:w-1/3 px-5 py-2.5 text-sm bg-white rounded-2xl border border-gray-300 shadow focus:ring-2 focus:ring-blue-300 outline-none transition-all"
        />
        <div className="flex gap-3 items-center">
          {/* Conditional rendering for the "+ User" button */}
          {dynamicUserCreate.length > 0 &&
            dynamicUserCreate.map((i) => (
              <button
                key={i.attributes_id}
                onClick={createUser}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-900 shadow-md text-white transition hover:bg-blue-800"
              >
                {i.attribute_name}
              </button>
            ))}

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              activeTab === "active"
                ? "bg-blue-900 text-white shadow-md shadow-blue-900"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            } transition-all`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inactive")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              activeTab === "inactive"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 shadow-md shadow-gray-900 text-gray-700 hover:bg-gray-100"
            } transition-all`}
          >
            Inactive
          </button>

          <button
            type="button"
            onClick={handleSort}
            className="px-4 py-2 rounded-xl text-sm bg-white shadow-md shadow-gray-900 hover:bg-gray-50 transition-all w-32"
          >
            ↕ Sort ({sortOrder})
          </button>

          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-2 rounded-xl border shadow-md shadow-gray-900 ${
              view === "grid" ? "bg-blue-900 text-white" : "bg-white text-gray-600"
            } transition-all hover:bg-blue-100`}
          >
            <FaTh />
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            className={`p-2 rounded-xl shadow-md shadow-gray-900 border border-gray-200 ${
              view === "list" ? "bg-blue-900 text-white" : "bg-white text-gray-600"
            } transition-all hover:bg-blue-100`}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mr-3" />
          <p className="text-lg text-gray-600">Loading users...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center text-red-600 py-8 px-4 bg-red-50 rounded-xl border border-red-200">
          <p className="font-semibold text-lg">Error:</p>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && displayedUsers.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg font-medium">No users found for the current filters.</p>
          <p className="text-md">Try adjusting your search term or switching tabs.</p>
        </div>
      )}

      {/* Conditional Rendering for Grid or List View */}
      {!loading && !error && displayedUsers.length > 0 && (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayedUsers.map((user) => (
              // <div
              //   key={user.iUser_id}
              //   className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 cursor-pointer"
              //   onClick={() => goToLeadsPage(user.iUser_id)}
              // >
              //   <div className="flex items-center gap-4 mb-4">
              //     <img
              //       src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              //         user.cFull_name
              //       )}&background=random&color=fff&rounded=true`}
              //       alt="Profile"
              //       className="w-14 h-14 rounded-full object-cover"
              //     />
              //     <div className="flex flex-1 items-center justify-between min-w-0">
              //       <h2 className="text-lg font-semibold text-gray-800 truncate">
              //         {user.cFull_name}
              //       </h2>
              //       {user.role?.cRole_name && (
              //         <span
              //           className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${
              //             user.role.cRole_name === "Administrator"
              //               ? "bg-red-100 text-red-700"
              //               : "bg-blue-100 text-blue-700"
              //           }`}
              //         >
              //           {user.role.cRole_name}
              //         </span>
              //       )}
              //     </div>
              //   </div>
              //   <div className="text-sm text-gray-700 space-y-1">
              //     <p className="flex items-center gap-2">
              //       <FaEnvelope className="text-blue-500" /> {user.cEmail}
              //     </p>
              //     <p className="flex items-center gap-2">
              //       <FaCrown className="text-purple-500" />{" "}
              //       {user.cjob_title || "-"}
              //     </p>
              //     <p className="flex items-center gap-2">
              //       <FaCity className="text-gray-500" />{" "}
              //       {user.company?.cCompany_name || "-"}
              //     </p>
              //     <div className="pt-2">
              //       <span
              //         className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${
              //           user.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              //         }`}
              //       >
              //         {user.bactive ? "Active" : "Inactive"}
              //       </span>
              //     </div>
              //   </div>
              // </div>
              <CommonCard
  key={user.iUser_id}
  image={`https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.cFull_name
  )}&background=random&color=fff&rounded=true`}
  title={user.cFull_name}
  badge={user.role?.cRole_name}
  onClick={() => goToLeadsPage(user.iUser_id)}
  status={{
    active: user.bactive,
    text: user.bactive ? "Active" : "Inactive",
  }}
>
  <p className="flex items-center gap-2">
    <FaEnvelope className="text-blue-500" />
    {user.cEmail}
  </p>

  <p className="flex items-center gap-2">
    <FaCrown className="text-purple-500" />
    {user.cjob_title || "-"}
  </p>

  <p className="flex items-center gap-2">
    <FaCity className="text-gray-500" />
    {user.company?.cCompany_name || "-"}
  </p>
</CommonCard>

            ))}
          </div>
        ) : (
          // List View
          // <div className="rounded-3xl shadow border border-gray-100 overflow-hidden">
          //   <div className="grid grid-cols-6 gap-2 sm:gap-4 px-4 py-3 bg-gray-100 font-semibold text-gray-600 text-center text-sm">
          //     <div>Profile</div>
          //     <div>Name</div>
          //     <div>Role</div>
          //     <div>Email</div>
          //     <div>Job Title</div>
          //     <div>Company</div>
          //   </div>
          //   {displayedUsers.map((user) => (
          //     <div
          //       key={user.iUser_id}
          //       className="grid grid-cols-6 gap-2 sm:gap-4 px-4 py-3 bg-white text-center text-sm items-center border-t hover:bg-gray-50 cursor-pointer"
          //       onClick={() => goToLeadsPage(user.iUser_id)}
          //     >
          //       <div className="flex justify-center">
          //         <img
          //           src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          //             user.cFull_name
          //           )}&background=random&color=fff&rounded=true`}
          //           alt="Profile"
          //           className="w-10 h-10 rounded-full object-cover"
          //         />
          //       </div>
          //       <div className="truncate">{user.cFull_name}</div>
          //       <div className="flex justify-center">
          //         {user.role?.cRole_name ? (
          //           <span
          //             className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          //               user.role.cRole_name === "Administrator"
          //                 ? "bg-red-100 text-red-700"
          //                 : "bg-blue-100 text-blue-700"
          //             }`}
          //           >
          //             {user.role.cRole_name}
          //           </span>
          //         ) : (
          //           <span className="text-gray-400">-</span>
          //         )}
          //       </div>
          //       <div className="truncate">{user.cEmail}</div>
          //       <div>{user.cjob_title || "Nil"}</div>
          //       <div className="truncate">
          //         {user.company?.cCompany_name || "Nil"}
          //       </div>
          //     </div>
          //   ))}
          // </div>
          <CommonTable
  columns={userColumns}
  data={displayedUsers}
  currentPage={currentPage}
  itemsPerPage={9}
  onRowClick={(row) => goToLeadsPage(row.iUser_id)}
/>
        )
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />


      {showLimitPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2"> User limit reached </h2>
            <p className="text-gray-700 mb-4">  You have reached the limit for user creation. To add more users, please contact{" "}
              <span className="font-semibold">Inklidox Technologies</span>.
            </p>

            <button onClick={() => setShowLimitPopup(false)} className="px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800">
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserPage;


// import React, { useState, useEffect } from "react";
// import {
//   FaCrown,
//   FaEnvelope,
//   FaCity,
//   FaIdCard,
//   FaTh,
//   FaBars,
// } from "react-icons/fa";
// import ProfileHeader from "../../Components/common/ProfileHeader";
// import { ENDPOINTS } from "../../api/constraints";
// import CreateUserForm from "../../Components/registerUser";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const UserPage = () => {
//   const [users, setUsers] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [view, setView] = useState("grid");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const usersPerPage = 6;
//   const navigate = useNavigate();

//   const getCompanyId = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const payload = JSON.parse(atob(base64));
//       return payload.company_id;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const companyId = getCompanyId();
//       if (!companyId) {
//         console.warn("No company ID found in token. Cannot fetch users.");
//         return;
//       }

//       try {
//         const response = await fetch(ENDPOINTS.USER_GET, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`);
//         }
//         const data = await response.json();
//         const companyUsers = data.filter(
//           (user) => user.iCompany_id === companyId
//         );

//         setUsers(companyUsers);
//         setFiltered(companyUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filteredUsers = users.filter(
//       (user) =>
//         user.cFull_name.toLowerCase().includes(value) ||
//         user.cEmail.toLowerCase().includes(value) ||
//         user.cUser_name?.toLowerCase().includes(value) ||
//         user.role?.cRole_name?.toLowerCase().includes(value) ||
//         user.cjob_title?.toLowerCase().includes(value) ||
//         user.cCity?.toLowerCase().includes(value)
//     );

//     setFiltered(filteredUsers);
//     setCurrentPage(1);
//   };

//   const handleSort = () => {
//     const newOrder = sortOrder === "asc" ? "desc" : "asc";
//     setSortOrder(newOrder);

//     const sortedUsers = [...filtered].sort((a, b) =>
//       newOrder === "asc"
//         ? a.cFull_name.localeCompare(b.cFull_name)
//         : b.cFull_name.localeCompare(a.cFull_name)
//     );

//     setFiltered(sortedUsers);
//     setCurrentPage(1);
//   };

//   const handleCreateUserClick = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

// const goToLeadsPage = (userId) => {
//       navigate(`/userprofile/${userId}`);
//   };

//   const totalPages = Math.ceil(filtered.length / usersPerPage);
//   const startIndex = (currentPage - 1) * usersPerPage;
//   const displayedUsers = filtered.slice(startIndex, startIndex + usersPerPage);

//   return (
//     <div className="p-6 bg-gradient-to-b from-slate-100 to-white min-h-screen rounded-3xl shadow-inner font-sans text-gray-800">
//       <ProfileHeader />

//       {/* Search & View Controls */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="w-full sm:w-1/2 md:w-1/3 px-5 py-2.5 text-sm bg-white rounded-2xl border border-gray-300 shadow focus:ring-2 focus:ring-blue-300 outline-none transition-all"
//         />
//         <button
//           onClick={handleCreateUserClick}
//           className="relative inline-flex items-center ms-[320px] gap-2 px-5 py-2 rounded-full text-blue-600 font-semibold bg-white border border-black"
//         >
//           + User
//         </button>

//         <div className="flex gap-3 items-center">
//           <button
//             onClick={handleSort}
//             className="px-4 py-2 rounded-xl text-sm bg-white border border-gray-300 shadow hover:bg-gray-50 transition-all w-32"
//           >
//             ↕ Sort ({sortOrder})
//           </button>
//           <button
//             onClick={() => setView("grid")}
//             className={`p-2 rounded-xl border shadow-sm ${
//               view === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
//             } transition-all hover:bg-blue-100`}
//           >
//             <FaTh />
//           </button>
//           <button
//             onClick={() => setView("list")}
//             className={`p-2 rounded-xl border shadow-sm ${
//               view === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
//             } transition-all hover:bg-blue-100`}
//           >
//             <FaBars />
//           </button>
//         </div>
//       </div>

//       {/* Conditional Rendering for Grid or List View */}
//       {view === "grid" ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {displayedUsers.map((user) => (
//             <div
//               key={user.iUser_id}
//               className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 cursor-pointer"
//               onClick={() => goToLeadsPage(user.iUser_id)} 
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <img
//                   src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                     user.cFull_name
//                   )}&background=random&color=fff&rounded=true`}
//                   alt="Profile"
//                   className="w-14 h-14 rounded-full object-cover"
//                 />
//                 <div className="flex flex-1 items-center justify-between min-w-0">
//                   <h2 className="text-lg font-semibold text-gray-800 truncate">
//                     {user.cFull_name}
//                   </h2>

//                   {user.role?.cRole_name && (
//                     <span
//                       className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${
//                         user.role.cRole_name === "Administrator"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-blue-100 text-blue-700"
//                       }`}
//                     >
//                       {user.role.cRole_name}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="text-sm text-gray-700 space-y-1">
//                 <p className="flex items-center gap-2">
//                   <FaEnvelope className="text-blue-500" /> {user.cEmail}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaCrown className="text-purple-500" /> {user.cjob_title || "N/A"}
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <FaCity className="text-gray-500" /> {user.company.cCompany_name || "N/A"}
//                 </p>
//                 <div className="pt-2">
//                   {user.role ? (
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${
//                         user.bactive
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {user.bactive ? "Active" : "Disabled"}
//                     </span>
//                   ) : (
//                     <span className="text-gray-400 text-xs">Role not assigned</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         // List View
//         <div className="rounded-3xl shadow border border-gray-100 overflow-hidden">
//           <div className="grid grid-cols-6 gap-2 sm:gap-4 px-4 py-3 bg-gray-100 font-semibold text-gray-600 text-center text-sm">
//             <div>Profile</div>
//             <div>Name</div>
//             <div>Role</div>
//             <div>Email</div>
//             <div>Phone</div>
//             <div>Address</div>
//           </div>
//           {displayedUsers.map((user) => (
//             <div
//               key={user.iUser_id}
//               className="grid grid-cols-6 gap-2 sm:gap-4 px-4 py-3 text-center text-sm items-center border-t hover:bg-gray-50 cursor-pointer"
//               onClick={() => goToLeadsPage(user.iUser_id)} // Added onClick to navigate
//             >
//               <div className="flex justify-center">
//                 <img
//                   src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
//                     user.cFull_name
//                   )}&background=random&color=fff&rounded=true`}
//                   alt="Profile"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//               </div>
//               <div className="truncate">{user.cFull_name}</div>
//               <div className="flex justify-center">
//                 {user.role?.cRole_name ? (
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
//                       user.role.cRole_name === "Administrator"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-blue-100 text-blue-700"
//                     }`}
//                   >
//                     {user.role.cRole_name}
//                   </span>
//                 ) : (
//                   <span className="text-gray-400">N/A</span>
//                 )}
//               </div>
//               <div className="truncate">{user.cEmail}</div>
//               <div>{user.cPhone || "Nil"}</div>
//               <div className="truncate">{user.cAddress || "Nil"}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center gap-2 mt-8 flex-wrap">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-2 text-sm rounded-xl shadow-sm ${
//                 currentPage === i + 1
//                   ? "bg-blue-600 text-white"
//                   : "bg-white border border-gray-300 hover:bg-gray-100"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* User Creation Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm overflow-auto p-4">
//           <div
//             className={`relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl transform transition-transform duration-300 ease-out ${
//               isModalOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
//             }`}
//           >
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-white hover:text-gray-800 text-2xl"
//             >
//               &times;
//             </button>
//             <CreateUserForm onClose={closeModal} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserPage;
