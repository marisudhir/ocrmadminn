import React from "react";

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
       <div className="flex justify-center items-center gap-3 p-5">
         <button
                  disabled={isFirstPage}
                   onClick={() => setCurrentPage((p) => p - 1)}
                   className={`px-4 py-2 border rounded-2xl disabled:opacity-50 transition-colors
                   ${
                     !isFirstPage
                      ? "bg-[#2737b8] text-white border-[#2737b8]"
                      : "bg-white text-slate-400 border-slate-200"
                      }`}
                      >
                      Prev
                      </button>

                        <span className="px-4 py-2 text-sm rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                            Page {currentPage} of {totalPages}
                        </span>

                 <button
                    disabled={isLastPage}
                     onClick={() => setCurrentPage((p) => p + 1)}
                        className={`px-4 py-2 border rounded-2xl disabled:opacity-50 transition-colors
                          ${
                            !isLastPage
                              ? "bg-[#2737b8] text-white border-[#2737b8]"
                              : "bg-white text-slate-400 border-slate-200"
                            }`}
                         >
                           Next
                       </button>
                    </div>            

  );
}

export default Pagination;


// import React from "react";

// function Pagination({ currentPage, totalPages, setCurrentPage }) {

//   const isFirstPage = currentPage === 1;
//   const isLastPage = currentPage === totalPages;

//   return (
//     <div className="flex justify-center gap-2 p-4">

//       {/* PREV BUTTON */}
//       <button
//         disabled={isFirstPage}
//         onClick={() => setCurrentPage((p) => p - 1)}
//         className={`px-3 py-1 border rounded disabled:opacity-50
//           ${
//             !isFirstPage
//               ? "bg-blue-600 text-white border-blue-600"
//               : "bg-white"
//           }`}
//       >
//         Prev
//       </button>

//       <span className="px-3 py-1 text-sm">
//         Page {currentPage} of {totalPages}
//       </span>

//       {/* NEXT BUTTON */}
//       <button
//         disabled={isLastPage}
//         onClick={() => setCurrentPage((p) => p + 1)}
//         className={`px-3 py-1 border rounded disabled:opacity-50
//           ${
//             !isLastPage
//               ? "bg-blue-600 text-white border-blue-600"
//               : "bg-white"
//           }`}
//       >
//         Next
//       </button>

//     </div>
//   );
// }

// export default Pagination;
