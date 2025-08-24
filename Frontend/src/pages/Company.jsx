// import { useEffect, useMemo, useState } from "react";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaTimes,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSearch,
//   FaSortAlphaDown,
//   FaSortAlphaUpAlt,
// } from "react-icons/fa";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const Company = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [newCompany, setNewCompany] = useState({ name: "", address: "" });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortAsc, setSortAsc] = useState(true);

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   // Memoized filtered companies
//   const filteredCompanies = useMemo(() => {
//     return companies
//       .filter(
//         (company) =>
//           company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           company.address.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .sort((a, b) => {
//         return sortAsc
//           ? a.name.localeCompare(b.name)
//           : b.name.localeCompare(a.name);
//       });
//   }, [companies, searchTerm, sortAsc]);

//   // Pagination calculations
//   const totalItems = filteredCompanies.length; // 11
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   // Current page items
//   const currentItems = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredCompanies.slice(startIndex, endIndex);
//   }, [filteredCompanies, currentPage, itemsPerPage]);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, sortAsc, itemsPerPage]);

//   // Navigation functions
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const renderPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     if (startPage > 1) {
//       pages.push(
//         <button
//           key={1}
//           onClick={() => goToPage(1)}
//           className={`px-3 py-1 rounded-md ${
//             1 === currentPage
//               ? "bg-indigo-600 text-white"
//               : "bg-white text-gray-700 hover:bg-gray-100"
//           } transition-colors`}
//         >
//           1
//         </button>
//       );
//       if (startPage > 2) {
//         pages.push(
//           <span key="start-ellipsis" className="px-2 flex items-end">
//             •••
//           </span>
//         );
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <button
//           key={i}
//           onClick={() => goToPage(i)}
//           className={`px-3 py-1 rounded-md ${
//             i === currentPage
//               ? "bg-indigo-600 text-white"
//               : "bg-white text-gray-700 hover:bg-gray-100"
//           } transition-colors`}
//         >
//           {i}
//         </button>
//       );
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pages.push(
//           <span key="end-ellipsis" className="px-2 flex items-end">
//             •••
//           </span>
//         );
//       }
//       pages.push(
//         <button
//           key={totalPages}
//           onClick={() => goToPage(totalPages)}
//           className={`px-3 py-1 rounded-md ${
//             totalPages === currentPage
//               ? "bg-indigo-600 text-white"
//               : "bg-white text-gray-700 hover:bg-gray-100"
//           } transition-colors`}
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return pages;
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   const fetchCompanies = () => {
//     setLoading(true);
//     fetch(`${API_BASE_URL}/company/all`)
//       .then((response) => {
//         if (!response.ok)
//           throw new Error(`HTTP error! status: ${response.status}`);
//         return response.json();
//       })
//       .then((data) => {
//         setCompanies(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   };

//   const handleInputChange = (e) => {
//     setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const url = editMode
//       ? `${API_BASE_URL}/company/update/${selectedCompany.id}`
//       : `${API_BASE_URL}/company/create`;

//     const method = editMode ? "PUT" : "POST";

//     fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newCompany),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to save company");
//         return res.json();
//       })
//       .then(() => {
//         setShowForm(false);
//         setEditMode(false);
//         setSelectedCompany(null);
//         setNewCompany({ name: "", address: "" });
//         fetchCompanies();
//         alert("Company saved successfully");
//       })
//       .catch((err) => alert("Error: " + err.message));
//   };

//   const handleDelete = (id) => {
//     if (!confirm("Are you sure to delete this company?")) {
//       return;
//     }

//     fetch(`${API_BASE_URL}/company/delete/${id}`, { method: "DELETE" })
//       .then((res) => {
//         if (!res.ok) throw new Error("Delete failed");
//         fetchCompanies();
//         alert("Deleted successfully");
//       })
//       .catch((err) => {
//         alert("Error: " + err.message);
//       });
//   };

//   const handleEdit = (company) => {
//     setSelectedCompany(company);
//     setNewCompany({ name: company.name, address: company.address });
//     setEditMode(true);
//     setShowForm(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 py-8 px-4 sm:px-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Company Management
//             </h1>
//             <p className="text-gray-600 mt-1">
//               Manage your company records with ease
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               setShowForm(true);
//               setEditMode(false);
//               setNewCompany({ name: "", address: "" });
//             }}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
//           >
//             <FaPlus className="text-sm" /> Add Company
//           </button>
//         </div>

//         {/* Search and Sort Controls */}
//         <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="relative w-full md:w-96">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search companies by name or address..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={() => setSortAsc(!sortAsc)}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               {sortAsc ? (
//                 <>
//                   <FaSortAlphaDown className="text-indigo-600" />
//                   <span>A-Z</span>
//                 </>
//               ) : (
//                 <>
//                   <FaSortAlphaUpAlt className="text-indigo-600" />
//                   <span>Z-A</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="h-5 w-5 text-red-500"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   <span className="font-medium">Error:</span> {error}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         ) : (
//           <>
//             {/* Company Table */}
//             <div className="bg-white shadow-sm rounded-xl overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         No
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Company Name
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Address
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentItems.length > 0 ? (
//                       currentItems.map((company, index) => (
//                         <tr
//                           key={company.id}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {(currentPage - 1) * itemsPerPage + index + 1}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
//                             {company.name}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                             {company.address}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
//                             <div className="flex justify-end space-x-3">
//                               <button
//                                 onClick={() => handleEdit(company)}
//                                 className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-md hover:bg-indigo-50"
//                                 title="Edit"
//                               >
//                                 <FaEdit className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(company.id)}
//                                 className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
//                                 title="Delete"
//                               >
//                                 <FaTrash className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="4"
//                           className="px-6 py-4 text-center text-sm text-gray-500"
//                         >
//                           No companies found. Try adjusting your search or add a
//                           new company.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
//                 <div className="flex items-center space-x-2 mb-4 sm:mb-0">
//                   <span className="text-sm text-gray-700">
//                     Showing{" "}
//                     <span className="font-medium">
//                       {(currentPage - 1) * itemsPerPage + 1}
//                     </span>{" "}
//                     to{" "}
//                     <span className="font-medium">
//                       {Math.min(currentPage * itemsPerPage, totalItems)}
//                     </span>{" "}
//                     of <span className="font-medium">{totalItems}</span>{" "}
//                     {totalItems === 1 ? "result" : "results"}
//                   </span>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   {/* Items per page selector */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-700">Show:</span>
//                     <select
//                       value={itemsPerPage}
//                       onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                       className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                       <option value={50}>50</option>
//                     </select>
//                   </div>

//                   {/* Page navigation */}
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => goToPage(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       aria-label="Previous page"
//                     >
//                       <FaChevronLeft className="h-4 w-4" />
//                     </button>

//                     <div className="flex space-x-1">{renderPageNumbers()}</div>

//                     <button
//                       onClick={() => goToPage(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                       aria-label="Next page"
//                     >
//                       <FaChevronRight className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Modal Form */}
//         {showForm && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
//               <div className="flex justify-between items-center border-b px-6 py-4">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {editMode ? "Edit Company" : "Add New Company"}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowForm(false);
//                     setEditMode(false);
//                     setNewCompany({ name: "", address: "" });
//                   }}
//                   className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
//                 >
//                   <FaTimes className="h-5 w-5" />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Company Name
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={newCompany.name}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                     placeholder="Enter company name"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="address"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Address
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="address"
//                     name="address"
//                     value={newCompany.address}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                     placeholder="Enter company address"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditMode(false);
//                       setNewCompany({ name: "", address: "" });
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//                   >
//                     {editMode ? "Update Company" : "Add Company"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Company;
