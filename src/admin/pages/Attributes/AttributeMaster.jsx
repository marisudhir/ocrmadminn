import { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import { attributeController } from "./attributeController"; 
import AttributeForm from "../Attributes/sub-Component/AttributeForm";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonTable from "../../context/TableStructure/CommonTable";

// Helper component for displaying notifications
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    
    const baseStyle = "p-4 mb-4 rounded-lg shadow-md flex justify-between items-center transition-opacity duration-300";
    const colorStyle = type === 'error' 
        ? "bg-red-100 text-red-700 border border-red-200"
        : "bg-green-100 text-green-700 border border-green-200";

    return (
        <div className={`${baseStyle} ${colorStyle}`}>
            <p className="font-medium">{message}</p>
            <button onClick={onClose} className="text-lg font-semibold ml-4 hover:text-opacity-80">
                &times;
            </button>
        </div>
    );
};


export default function AttributePage() {
    const {
        attributes,
        modules,
        error,
        loading,
        addNewAttribute,
        updateAttribute,
        deactivateAttribute,
        fetchAttributes
    } = attributeController(); 

    const [localAttributes, setLocalAttributes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [notification, setNotification] = useState(null); 

    // Sync attributes from controller
    useEffect(() => {
        setLocalAttributes(attributes);
    }, [attributes]);

    // Handle incoming errors from the controller (e.g., failed fetch)
    useEffect(() => {
        if (error) {
            setNotification({ message: error, type: 'error' });
        }
    }, [error]);

    // Function to clear notifications
    const clearNotification = useCallback(() => setNotification(null), []);

    
    // Handler for Create and Update actions
    const handleFormSubmit = async (data) => {
        try {
            if (editing) {
                await updateAttribute({
                    id: editing.iattribute_id,
                    ...data
                });
                setNotification({ message: "Attribute updated successfully!", type: 'success' });
                setEditing(null);
            } else {
                await addNewAttribute(data);
                setNotification({ message: "Attribute created successfully!", type: 'success' });
            }
            // Fetch after success to update the table
            fetchAttributes();
        } catch (e) {
            setNotification({ message: e.message || "Operation failed.", type: 'error' });
        }
    };
    
    // Handler for Deactivation (Delete) action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this attribute?")) {
            try {
                await deactivateAttribute(id);
                setNotification({ message: "Attribute deactivated successfully!", type: 'success' });
                fetchAttributes();
            } catch (e) {
                setNotification({ message: e.message || "Deactivation failed.", type: 'error' });
            }
        }
    };

    // Handler for status toggle 
    const handleStatusToggle = (attribute) => {
        alert("Status Toggle Clicked! Implement API call to re-activate the attribute if needed.");
        
        const updated = localAttributes.map((a) =>
            a.iattribute_id === attribute.iattribute_id
                ? { ...a, bactive: !a.bactive }
                : a
        );
        setLocalAttributes(updated);
    };

    
    // Sort attributes by name (case insensitive)
    const sortedAttributes = [...localAttributes].sort((a, b) => {
        return a.cattribute_name?.toLowerCase().localeCompare(b.cattribute_name?.toLowerCase());
    });

    const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: currentAttributes,
} = usePagination(sortedAttributes, 10);

    const indexOfFirstItem = (currentPage - 1) * 10;

    const attributeColumns = [
    {
        header: "Attribute Name",
        accessor: "cattribute_name",

        render: (row) => (
        <span className="font-medium text-gray-800">
            {row.cattribute_name || "-"}
        </span>
        ),
    },
    {
        header: "Module",
        accessor: "imodule_id",
        render: (row) =>
        row.module_table?.cmodule_name ||
        getModuleName(row.imodule_id),
    },
    {
        header: "Status",
        accessor: "bactive",
        render: (row) => (
        <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
            row.bactive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
            {row.bactive ? "Active" : "Inactive"}
        </span>
        ),
    },
    {
        header: "Actions",
        render: (row) => (
        <div className="flex justify-center gap-2">
            <button
            onClick={() => setEditing(row)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Edit"
            >
            <FaEdit size={14} />
            </button>

            <button
            onClick={() => handleDelete(row.iattribute_id)}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={!row.bactive}
            title="Deactivate"
            >
            <FaTrash size={14} />
            </button>

            <button
            onClick={() => handleStatusToggle(row)}
            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            title="Toggle Status"
            >
            <FaSyncAlt size={14} />
            </button>
        </div>
        ),
    },
    ];


    // Get module name by ID (Fallback, as 'module_table' should be included in the API response)
    const getModuleName = (moduleId) => {
        const module = modules.find(m => m.imodule_id === moduleId);
        return module ? module.cmodule_name : "N/A";
    };

    return (
        <div className="min-h-screen bg-white p-6 sm:p-8 font-sans antialiased">
            <div className="max-w-9xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                    Attribute <span className="text-[#2737b8]">Management</span>
                </h1>

                {loading && (
                    <div className="mb-4 animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                        <div className="h-4 w-40 rounded bg-gray-200" />
                    </div>
                )}

                {/* Global Notification/Toast Component */}
                <Notification 
                    message={notification?.message} 
                    type={notification?.type} 
                    onClose={clearNotification}
                />

                {/* Attribute Form */}
                <AttributeForm
                    onSubmit={handleFormSubmit}
                    attribute={editing}
                    modules={modules}
                    onCancel={() => setEditing(null)} 
                />

                {/* Debug info */}
                {/* <div className="mb-4 p-2 bg-yellow-100 rounded">
                    <p>Total Active Attributes: {localAttributes.length}</p>
                    <p>Current Page: {currentPage}</p>
                    <p>Showing: {currentAttributes.length} attributes</p>
                </div> */}

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6">
                    <CommonTable
                    columns={attributeColumns}
                    data={currentAttributes}
                    currentPage={currentPage}
                    itemsPerPage={10}
                    />

                </div>

                {/* PAGINATION */}
                
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
            </div>
        </div>
    );
}



// import { useState, useEffect, useCallback } from "react";
// import { FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
// import { attributeController } from "./attributeController"; 
// import AttributeForm from "../Attributes/sub-Component/AttributeForm";
// import Pagination from "../../context/Pagination/pagination";
// import usePagination from "../../hooks/usePagination"


// // Helper component for displaying notifications
// const Notification = ({ message, type, onClose }) => {
//     if (!message) return null;
    
//     const baseStyle = "p-4 mb-4 rounded-lg shadow-md flex justify-between items-center transition-opacity duration-300";
//     const colorStyle = type === 'error' 
//         ? "bg-red-100 text-red-700 border border-red-200"
//         : "bg-green-100 text-green-700 border border-green-200";

//     return (
//         <div className={`${baseStyle} ${colorStyle}`}>
//             <p className="font-medium">{message}</p>
//             <button onClick={onClose} className="text-lg font-semibold ml-4 hover:text-opacity-80">
//                 &times;
//             </button>
//         </div>
//     );
// };


// export default function AttributePage() {
//     const {
//         attributes,
//         modules,
//         error,
//         loading,
//         addNewAttribute,
//         updateAttribute,
//         deactivateAttribute,
//         fetchAttributes
//     } = attributeController();

//     const [localAttributes, setLocalAttributes] = useState([]);
//     const [editing, setEditing] = useState(null);
//     const [notification, setNotification] = useState(null); 

//     // Sync attributes from controller
//     useEffect(() => {
//         setLocalAttributes(attributes);
//     }, [attributes]);

//     useEffect(() => {
//         if (error) {
//             setNotification({ message: error, type: 'error' });
//         }
//     }, [error]);

//     // Function to clear notifications
//     const clearNotification = useCallback(() => setNotification(null), []);

    
//     // Handler for Create and Update actions
//     const handleFormSubmit = async (data) => {
//         try {
//             if (editing) {
//                 await updateAttribute({
//                     id: editing.iattribute_id,
//                     ...data
//                 });
//                 setNotification({ message: "Attribute updated successfully!", type: 'success' });
//                 setEditing(null);
//             } else {
//                 await addNewAttribute(data);
//                 setNotification({ message: "Attribute created successfully!", type: 'success' });
//             }
//             // Fetch after success to update the table
//             fetchAttributes();
//         } catch (e) {
//             setNotification({ message: e.message || "Operation failed.", type: 'error' });
//         }
//     };
    
//     // Handler for Deactivation (Delete) action
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to deactivate this attribute?")) {
//             try {
//                 await deactivateAttribute(id);
//                 setNotification({ message: "Attribute deactivated successfully!", type: 'success' });
//                 fetchAttributes();
//             } catch (e) {
//                 setNotification({ message: e.message || "Deactivation failed.", type: 'error' });
//             }
//         }
//     };

//     // Handler for status toggle (NOTE: This currently uses local state and needs an API call for permanent status change)
//     const handleStatusToggle = (attribute) => {
//         alert("Status Toggle Clicked! Implement API call to re-activate the attribute if needed.");
        
//         const updated = localAttributes.map((a) =>
//             a.iattribute_id === attribute.iattribute_id
//                 ? { ...a, bactive: !a.bactive }
//                 : a
//         );
//         setLocalAttributes(updated);
//     };

    
//     // Sort attributes by name (case insensitive)
//     const sortedAttributes = [...localAttributes].sort((a, b) => {
//         return a.cattribute_name?.toLowerCase().localeCompare(b.cattribute_name?.toLowerCase());
//     });

//     const {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedData: currentAttributes,
// } = usePagination(sortedAttributes, 10);

// const indexOfFirstItem = (currentPage - 1) * 10;


//     // Get module name by ID (Fallback, as 'module_table' should be included in the API response)
//     const getModuleName = (moduleId) => {
//         const module = modules.find(m => m.imodule_id === moduleId);
//         return module ? module.cmodule_name : "N/A";
//     };

//     if (loading) return <p className="text-gray-600">Loading attributes...</p>;
    
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
//             <div className="max-w-9xl mx-auto">
//                 <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
//                     Attribute Management
//                 </h1>

//                 {/* Global Notification/Toast Component */}
//                 <Notification 
//                     message={notification?.message} 
//                     type={notification?.type} 
//                     onClose={clearNotification}
//                 />

//                 {/* Attribute Form */}
//                 <AttributeForm
//                     onSubmit={handleFormSubmit}
//                     attribute={editing}
//                     modules={modules}
//                     onCancel={() => setEditing(null)} 
//                 />

//                 {/* Debug info */}
//                 {/* <div className="mb-4 p-2 bg-yellow-100 rounded">
//                     <p>Total Active Attributes: {localAttributes.length}</p>
//                     <p>Current Page: {currentPage}</p>
//                     <p>Showing: {currentAttributes.length} attributes</p>
//                 </div> */}

//                 {/* TABLE */}
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">S.No</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Attribute Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Module</th>
//                                 {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Created By</th> */}
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {currentAttributes.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                                         {localAttributes.length === 0 ? "No active attributes found." : "No attributes on this page."}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 currentAttributes.map((attribute, index) => (
//                                     <tr key={attribute.iattribute_id} className="hover:bg-blue-50">
//                                         <td className="px-6 py-4 text-sm font-medium">{indexOfFirstItem + index + 1}</td>
//                                         <td className="px-6 py-4 text-sm">{attribute.cattribute_name || "-"}</td>
//                                         <td className="px-6 py-4 text-sm">
//                                             {attribute.module_table?.cmodule_name || getModuleName(attribute.imodule_id)}
//                                         </td>
//                                         {/* <td className="px-6 py-4 text-sm">{attribute.created_by || "-"}</td> */}
//                                         <td className="px-6 py-4">
//                                             <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                                                 attribute.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                                             }`}>
//                                                 {attribute.bactive ? "Active" : "Inactive"}
//                                             </span>
//                                         </td>

//                                         <td className="px-6 py-4 text-sm space-x-2">
//                                             <button
//                                                 onClick={() => setEditing(attribute)}
//                                                 className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                                                 title="Edit Attribute"
//                                             >
//                                                 <FaEdit size={14} />
//                                             </button>

//                                             {/* Delete/Deactivate Button */}
//                                             <button
//                                                 onClick={() => handleDelete(attribute.iattribute_id)}
//                                                 className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                                 title="Deactivate Attribute"
//                                                 disabled={!attribute.bactive} // Optionally disable if already inactive
//                                             >
//                                                 <FaTrash size={14} />
//                                             </button>

//                                             {/* Status Toggle Button (currently local state only) */}
//                                             <button
//                                                 onClick={() => handleStatusToggle(attribute)}
//                                                 className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
//                                                 title="Toggle Status (Needs API for re-activation)"
//                                             >
//                                                 <FaSyncAlt size={14} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* PAGINATION */}
               
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         setCurrentPage={setCurrentPage}
//                     />
//             </div>
//         </div>
//     );
// }


