import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTabs } from '../../context/TabContext';
import { Tabs, Tab, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const ADMIN_ROLE_ID = Number(import.meta.env.VITE_ADMIN_ROLE_ID);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRoleId, setUserRoleId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const { tabs, activeTab, openTab, closeTab } = useTabs();
  const navigate = useNavigate();

  //  FULL MENU (Admin / God)
  const fullMenuItems = [
    { iconPath: '/images/nav/home.svg', label: 'Dashboard', route: '/dashboard-admin' },
    { iconPath: '/images/nav/org.svg', label: 'Company', route: '/company' },
    { iconPath: '/images/nav/customers.svg', label: 'Reseller', route: '/reseller' },
    { iconPath: '/images/nav/masters.svg', label: 'Masters', route: '/masters' },
    { iconPath: '/images/nav/subscription.svg', label: 'Subscription', route: '/subscriptions' },
    { iconPath: '/images/nav/subscription.svg', label: 'Packs', route: '/packspage' },
    { iconPath: '/images/nav/reports.png', label: 'Reports', route: '/reportpage' },
    { iconPath: '/images/nav/module.svg', label: 'Module', route: '/module' },
    { iconPath: '/images/nav/module_allocation.svg', label: 'Module Allocation', route: '/moduleAllocation' },
    { iconPath: '/images/nav/entity.svg', label: 'Attribute', route: '/attribute' },
    { iconPath: '/images/nav/storage.svg', label: 'Storage', route: '/storage' },
    { iconPath: '/images/nav/settings.png', label: 'Razorpay', route: '/razorpay' },

  ];

  //  USER MENU (role_id = 3)
  const userMenuItems = [
    { iconPath: '/images/nav/home.svg', label: 'Dashboard', route: '/dashboard' },
    { iconPath: '/images/nav/leads.svg', label: 'Leads', route: '/leads' },
    { iconPath: '/images/nav/calendar.svg', label: 'Calendar', route: '/calendar' },
    { iconPath: '/images/nav/customers.svg', label: 'Customer', route: '/customer' },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMenuItems([]);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roleIdFromToken = Number(payload.role_id);
      setUserRoleId(roleIdFromToken);

      //  ROLE BASED MENU LOGIC (ONLY CHANGE)
      if (roleIdFromToken === 1 || roleIdFromToken === 6) {
        setMenuItems(fullMenuItems);
      } else if (roleIdFromToken === 3) {
        setMenuItems(userMenuItems);
      } else {
        setMenuItems([]);
      }

    } catch (error) {
      console.error("Error decoding token:", error);
      setMenuItems([]);
    }
  }, []);

  const handleTabChange = (_, newValue) => {
    if (activeTab !== newValue) {
      const menuItem = menuItems.find(item => item.route === newValue);
      navigate(newValue);
      openTab(newValue, menuItem?.label || 'New');
    }
  };

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className={`bg-white border-r flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-center mt-6 h-20">
          <img
            src={isCollapsed ? '/images/nav/shortinkli.png' : '/images/nav/loginkli.png'}
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-48'} h-auto`}
          />
        </div>

        <div className="flex flex-col items-center py-4 space-y-2">
          {menuItems.length > 0 ? (
            menuItems.map(item => (
              <div
                key={item.route}
                onClick={() => {
                  navigate(item.route);
                  openTab(item.route, item.label);
                }}
                className={`flex items-center w-full cursor-pointer hover:bg-blue-100 rounded-lg px-4 py-2 transition-all duration-200 text-gray-700 ${
                  activeTab === item.route ? 'bg-blue-100 font-semibold text-blue-600' : ''
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  <img src={item.iconPath} alt={item.label} className="w-5 h-5 object-contain" />
                </div>
                {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm mt-4">No menu available for your role.</p>
          )}
        </div>

        <div className="flex flex-col items-center py-6 space-y-4 mb-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center space-x-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            <img src="/images/nav/collab.svg" alt="Toggle" className="w-6 h-6" />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center bg-black text-white space-x-2 px-4 py-2 hover:bg-red-600 rounded transition"
          >
            <img src="/images/nav/logout.svg" alt="Logout" className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f9fafb', width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 48, width: '100%' }}
          >
            {tabs.map(tab => (
              <Tab
                key={tab.path}
                value={tab.path}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {tab.label}
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        closeTab(tab.path);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                }
                sx={{
                  textTransform: 'none',
                  minHeight: 48,
                  minWidth: 'unset',
                  px: 2,
                  '&.Mui-selected': { color: 'primary.main', fontWeight: 'bold' },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <div className="flex-1 overflow-x-hidden overflow-y-scroll w-full h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


// -------------------------------------------------------------------------------------------------------- 


// import React, { useState, useEffect } from 'react';
// import { useLocation, Outlet, useNavigate } from 'react-router-dom';
// import { useTabs } from '../../context/TabContext';
// import { Tabs, Tab, IconButton, Box } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const Sidebar = () => {
//   const ADMIN_ROLE_ID = Number(import.meta.env.VITE_ADMIN_ROLE_ID);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [userRoleId, setUserRoleId] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);           
//   const { tabs, activeTab, openTab, closeTab } = useTabs();
//   const navigate = useNavigate();

//   const fullMenuItems = [
//     { iconPath: '/images/nav/home.svg', label: 'Dashboard', route: '/dashboard-admin' },
//     { iconPath: '/images/nav/org.svg', label: 'Company', route: '/company' },
//     { iconPath: '/images/nav/customers.svg', label: 'Reseller', route: '/reseller' },
//     { iconPath: '/images/nav/masters.svg', label: 'Masters', route: '/masters' },
//     { iconPath: '/images/nav/subscription.svg', label: 'Subscription', route: '/subscriptions' },
//     { iconPath: '/images/nav/module.svg', label: 'Module', route: '/module' },
//     { iconPath: '/images/nav/module_allocation.svg', label: 'Module Allocation', route: '/moduleAllocation' },
//     { iconPath: '/images/nav/entity.svg', label: 'Attribute', route: '/attribute' },
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem("token");
    
//     if (token) {
//       try {
//         const base64Url = token.split(".")[1];
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const payload = JSON.parse(atob(base64));
//         const roleIdFromToken = Number(payload.role_id);
//         setUserRoleId(roleIdFromToken);

//         if (roleIdFromToken === ADMIN_ROLE_ID) {
//           setMenuItems(fullMenuItems);
//         } else {
//           setMenuItems([]);
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setMenuItems([]);
//       }
//     } else {
//       setMenuItems([]);
//     }
//   }, [ADMIN_ROLE_ID]);

//   const handleTabChange = (_, newValue) => {
//     if (activeTab !== newValue) {
//       const menuItem = menuItems.find(item => item.route === newValue);
//       navigate(newValue);
//       openTab(newValue, menuItem?.label || 'New');
//     }
//   };

//   const toggleSidebar = () => setIsCollapsed(prev => !prev);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/', { replace: true });
//   };

//   const used = 20;
//   const radius = 45;
//   const circumference = 2 * Math.PI * radius;
//   const usedOffset = circumference * (1 - used / 100);

//   return (
//     <div className="flex h-screen w-full">
//       {/* Sidebar */}
//       <div className={`bg-white border-r flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
//         <div className="flex items-center justify-center mt-6 h-20">
//           <img
//             src={isCollapsed ? '/images/nav/shortinkli.png' : '/images/nav/loginkli.png'}
//             alt="Logo"
//             className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-48'} h-auto`}
//           />
//         </div>

//         <div className="flex flex-col items-center py-4 space-y-2">
//           {menuItems.length > 0 ? (
//             menuItems.map(item => (
//               <div
//                 key={item.route}
//                 onClick={() => {
//                   navigate(item.route);
//                   openTab(item.route, item.label);
//                 }}
//                 className={`flex items-center w-full cursor-pointer hover:bg-blue-100 rounded-lg px-4 py-2 transition-all duration-200 text-gray-700 ${
//                   activeTab === item.route ? 'bg-blue-100 font-semibold text-blue-600' : ''
//                 }`}
//               >
//                 <div className="flex items-center justify-center w-8">
//                   <img src={item.iconPath} alt={item.label} className="w-5 h-5 object-contain" />
//                 </div>
//                 {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400 text-sm mt-4">No menu available for your role.</p>
//           )}
//         </div>

//         <div className="flex flex-col items-center py-6 space-y-4 mb-4">
//           <button onClick={toggleSidebar}
//             className="flex items-center justify-center space-x-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
//           >
//             <img src="/images/nav/collab.svg" alt="Toggle" className="w-6 h-6" />
//             {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
//           </button>

//           <button onClick={handleLogout}
//             className="flex items-center bg-black text-white space-x-2 px-4 py-2 hover:bg-red-600 rounded transition"
//           >
//             <img src="/images/nav/logout.svg" alt="Logout" className="w-5 h-5" />
//             {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
//           </button>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Tab Bar */}
//         <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f9fafb', width: '100%' }}>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             sx={{ minHeight: 48, width: '100%' }}
//           >
//             {tabs.map(tab => (
//               <Tab
//                 key={tab.path}
//                 label={
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {tab.label}
//                     <IconButton
//                       size="small"
//                       onClick={e => {
//                         e.stopPropagation();
//                         closeTab(tab.path);
//                       }}
//                       sx={{ ml: 1 }}
//                     >
//                       <CloseIcon sx={{ fontSize: 16 }} />
//                     </IconButton>
//                   </Box>
//                 }
//                 value={tab.path}
//                 sx={{ textTransform: 'none', minHeight: 48, minWidth: 'unset', px: 2, '&.Mui-selected': { color: 'primary.main', fontWeight: 'bold' }, }}
//               />
//             ))}
//           </Tabs>
//         </Box>

//         {/* Page Content Area */}
//         <div className="flex-1 overflow-x-hidden overflow-y-scroll w-full h-full p-4">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// -----------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { useLocation, Outlet, useNavigate } from 'react-router-dom';
// import { useTabs } from '../../context/TabContext';
// import { Tabs, Tab, IconButton, Box } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [userRoleId, setUserRoleId] = useState(null);
//   const [menuItems, setMenuItems] = useState([]);           
//   const { tabs, activeTab, openTab, closeTab } = useTabs();
//   const navigate = useNavigate();

//   const fullMenuItems = [
//     { iconPath: '/images/nav/home.svg', label: 'Dashboard', route: '/dashboard-admin' },
//     { iconPath: '/images/nav/org.svg', label: 'Company', route: '/company' },
//     { iconPath: '/images/nav/customers.svg', label: 'Reseller', route: '/reseller' },
//     { iconPath: '/images/nav/masters.svg', label: 'Masters', route: '/masters' },
//     { iconPath: '/images/nav/subscription.svg', label: 'Subscription', route: '/subscriptions' },
//     { iconPath: '/images/nav/module.svg', label: 'Module', route: '/module' },
//     { iconPath: '/images/nav/module_allocation.svg', label: 'Module Allocation', route: '/moduleAllocation' },
//     { iconPath: '/images/nav/entity.svg', label: 'Attribute', route: '/attribute' },

    
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem("token");
    
//     if (token) {
//       try {
//         const base64Url = token.split(".")[1];
//         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//         const payload = JSON.parse(atob(base64));
//         const roleIdFromToken = payload.role_id;
//         setUserRoleId(roleIdFromToken);

//         // Apply dynamic menu filtering
//         if (roleIdFromToken === 1) {
//           // Full access
//           setMenuItems(fullMenuItems);
//         } else {
//           // Restricted access
//           setMenuItems(
//             fullMenuItems.filter(item =>
//               ['Home', 'Lead', 'Calendar', 'Reports'].includes(item.label)
//             )
//           );
//         }
//     }  catch (error) {
//         console.error("Error decoding token:", error);
//         setUserRoleId(null);
//         setMenuItems([]);
//       }
//     } else {
//       console.log("No access token found in localStorage.");
//       setUserRoleId(null);
//       setMenuItems([]);
//     }
//   }, []);

//   const handleTabChange = (_, newValue) => {
//     if (activeTab !== newValue) {
//       const menuItem = menuItems.find(item => item.route === newValue);
//       navigate(newValue);
//       openTab(newValue, menuItem?.label || 'New');
//     }
//   };

//   const toggleSidebar = () => setIsCollapsed(prev => !prev);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/', { replace: true });
//   };

//   const used = 20;
//   const radius = 45;
//   const circumference = 2 * Math.PI * radius;
//   const usedOffset = circumference * (1 - used / 100);

//   return (
//     <div className="flex h-screen w-full">
//       {/* Sidebar */}
//       <div className={`bg-white border-r flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
//         <div className="flex items-center justify-center mt-6 h-20">
//           <img
//             src={isCollapsed ? '/images/nav/shortinkli.png' : '/images/nav/loginkli.png'}
//             alt="Logo"
//             className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-48'} h-auto`}
//           />
//         </div>

//         <div className="flex flex-col items-center py-4 space-y-2">
//           {menuItems.length > 0 ? (
//             menuItems.map(item => (
//               <div
//                 key={item.route}
//                 onClick={() => {
//                   navigate(item.route);
//                   openTab(item.route, item.label);
//                 }}
//                 className={`flex items-center w-full cursor-pointer hover:bg-blue-100 rounded-lg px-4 py-2 transition-all duration-200 text-gray-700 ${
//                   activeTab === item.route ? 'bg-blue-100 font-semibold text-blue-600' : ''
//                 }`}
//               >
//                 <div className="flex items-center justify-center w-8">
//                   <img src={item.iconPath} alt={item.label} className="w-5 h-5 object-contain" />
//                 </div>
//                 {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400 text-sm mt-4">No menu available for your role.</p>
//           )}
//         </div>

//         <div className="flex flex-col items-center py-6 space-y-4 mb-4">
//           <button
//             onClick={toggleSidebar}
//             className="flex items-center justify-center space-x-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
//           >
//             <img src="/images/nav/collab.svg" alt="Toggle" className="w-6 h-6" />
//             {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
//           </button>

//           <button
//             onClick={handleLogout}
//             className="flex items-center bg-black text-white space-x-2 px-4 py-2 hover:bg-red-600 rounded transition"
//           >
//             <img src="/images/nav/logout.svg" alt="Logout" className="w-5 h-5" />
//             {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
//           </button>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Tab Bar */}
//         <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f9fafb', width: '100%' }}>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             sx={{ minHeight: 48, width: '100%' }}
//           >
//             {tabs.map(tab => (
//               <Tab
//                 key={tab.path}
//                 label={
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {tab.label}
//                     <IconButton
//                       size="small"
//                       onClick={e => {
//                         e.stopPropagation();
//                         closeTab(tab.path);
//                       }}
//                       sx={{ ml: 1 }}
//                     >
//                       <CloseIcon sx={{ fontSize: 16 }} />
//                     </IconButton>
//                   </Box>
//                 }
//                 value={tab.path}
//                 sx={{
//                   textTransform: 'none',
//                   minHeight: 48,
//                   minWidth: 'unset',
//                   px: 2,
//                   '&.Mui-selected': { color: 'primary.main', fontWeight: 'bold' },
//                 }}
//               />
//             ))}
//           </Tabs>
//         </Box>

//         {/* Page Content Area */}
//         <div className="flex-1 overflow-x-hidden overflow-y-scroll w-full h-full p-4">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
