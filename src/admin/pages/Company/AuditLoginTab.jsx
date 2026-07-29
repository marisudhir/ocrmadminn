import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from "@mui/material";
import { useCompanyController } from './companyController';
import Pagination from '../../context/Pagination/pagination';
import usePagination from '../../hooks/usePagination';
import CommonTable from '../../context/TableStructure/CommonTable';
import CommonSearchBar from '../../context/commonsearchbar/searchbar';

const AuditLoginTab = ({company_id}) => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [auditLogs, setAuditLogs] = useState({ data: [] });
  const [error, setError] = useState(null);  
  const {fetchAuditLogs} = useCompanyController();

  // Pagination settings
  const logsPerPage = 10;

  // In a real application, you'd fetch data here
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAuditLogs(company_id);

        // Sort by latest login first
        const sorted = data.data.sort((a, b) => b.ilast_loggedin - a.ilast_loggedin);

        setAuditLogs({ data: sorted });

      } catch (err) {
        console.error("Failed to fetch logs", err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchData();
  }, [company_id]);


  const totalLogs = auditLogs?.data || [];

  const auditColumns = [
  {
    header: "Log Id",
    accessor: "iacitivity_log",
    render: (row) => (
      <span className="text-gray-600">
        {row.iacitivity_log}
      </span>
    ),
  },
  {
    header: "User Name",
    accessor: "userName",
    render: (row) => (
      <span className="font-medium text-gray-900">
        {row.userName}
      </span>
    ),
  },
  {
    header: "Login Time (IST)",
    accessor: "ilast_loggedin",
    render: (row) =>
      new Date(row.ilast_loggedin * 1000).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
  },
];



const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: paginatedLogs,
} = usePagination(totalLogs, logsPerPage);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // const filteredLogs = auditLogs.filter(log =>
  //   log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   log.iuser_id.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    
    <Box sx={{ p: 3 }}>

      {/* Search Bar */}
      <CommonSearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by User..."
        className="mb-4 max-w-full"
      />
  
      {auditLogs?.data?.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <CommonTable
            columns={auditColumns}
            data={paginatedLogs}
            currentPage={currentPage}
            itemsPerPage={logsPerPage}
          />
        </div>
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
        </>
        
      ) : (
        <Paper className="p-6 text-center text-gray-500 rounded-xl shadow-md border border-gray-100">
          <Typography variant="body1">No audit login records found.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AuditLoginTab;



// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
// import SearchIcon from '@mui/icons-material/Search';
// import { TextField, InputAdornment } from '@mui/material';
// import { useCompanyController } from './companyController';
// import Pagination from '../../context/Pagination/pagination';
// import usePagination from '../../hooks/usePagination';

// const AuditLoginTab = ({company_id}) => {
//   const [searchTerm, setSearchTerm] = useState(''); 
//   const [auditLogs, setAuditLogs] = useState({ data: [] });
//   const [error, setError] = useState(null);  
//   const {fetchAuditLogs} = useCompanyController();

//   // Pagination settings
//   const logsPerPage = 10;

//   // In a real application, you'd fetch data here
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchAuditLogs(company_id);

//         // Sort by latest login first
//         const sorted = data.data.sort((a, b) => b.ilast_loggedin - a.ilast_loggedin);

//         setAuditLogs({ data: sorted });

//       } catch (err) {
//         console.error("Failed to fetch logs", err);
//         setError(err.message || 'Something went wrong');
//       }
//     };

//     fetchData();
//   }, [company_id]);


//   const totalLogs = auditLogs?.data || [];


// const {
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   paginatedData: paginatedLogs,
// } = usePagination(totalLogs, logsPerPage);


//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // const filteredLogs = auditLogs.filter(log =>
//   //   log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   log.iuser_id.toLowerCase().includes(searchTerm.toLowerCase())
//   // );

//   return (
    
//     <Box sx={{ p: 3 }}>

//       {/* Search Bar */}
//       <TextField
//         fullWidth
//         variant="outlined"
//         placeholder="Search by User..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon />
//             </InputAdornment>
//           ),
//         }}
//         sx={{ mb: 4 }}
//       />
  
//       {auditLogs?.data?.length > 0 ? (
//         <>
//         <TableContainer component={Paper} className="shadow-md border border-gray-100 rounded-xl h-[60vh]">
//           <Table sx={{ minWidth: 650 }} aria-label="audit login table">
//             <TableHead className="bg-gray-50">
//               <TableRow>
//                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log Id </TableCell> 

//                 <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</TableCell>
//                 <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time (IST)</TableCell>
//                 {/* <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</TableCell>
//                 <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableCell> */}
//               </TableRow>
//             </TableHead>
//             <TableBody className="bg-white divide-y divide-gray-200">
//               {paginatedLogs.map((log, index) => (
//                 <TableRow key={index}>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.iacitivity_log}</TableCell>

//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.userName}</TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    
//                     {new Date(log.ilast_loggedin * 1000).toLocaleString('en-IN', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: '2-digit',
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       second: '2-digit',
//                       hour12: true,
//                       timeZone: 'Asia/Kolkata'
//                     })}

//                   </TableCell>
//                   {/* <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">143.110.178.254</TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap">
//                    <Chip
//                     label={log.status}
//                     color={log.status === 'Success' ? 'success' : 'error'}
//                     size="small"
//                   />
//                   </TableCell> */}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
                
//         </TableContainer>

//                <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   setCurrentPage={setCurrentPage}
//                 />
//         </>
        
//       ) : (
//         <Paper className="p-6 text-center text-gray-500 rounded-xl shadow-md border border-gray-100">
//           <Typography variant="body1">No audit login records found.</Typography>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default AuditLoginTab;

