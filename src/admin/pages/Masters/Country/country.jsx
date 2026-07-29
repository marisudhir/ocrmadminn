import React, { useState, useEffect } from "react";
import { useSharedController } from "../../../api/shared/controller";

const Country = () => {
  // Custom hooks for CRUD operations
  const { countries, fetchAllCountries } = useSharedController();

  // State to control the form visibility
  const [showForm, setShowForm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // You can adjust items per page here

  // Fetch data on component mount
  useEffect(() => {
    fetchAllCountries();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = Array.isArray(countries)
    ? countries.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Array.isArray(countries)
    ? Math.ceil(countries.length / itemsPerPage)
    : 0;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 leading-tight">
          Country
        </h1>

        <div className="flex justify-end mb-6">
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(true)}
          >
            + Add Lead Industry
          </button>
        </div>

        {/* Renders the form according to the state */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <IndustryForm
                onClose={() => setShowForm(false)}
                onSuccess={fetchAllCountries}
              />
            </div>
          </div>
        )}

        {/* Lead Industry Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  S.No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCountries.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No country found.
                  </td>
                </tr>
              ) : (
                currentCountries.map((country, index) => (
                  <tr
                    key={
                      country.iCountry_id ||
                      `industry-${indexOfFirstItem + index}`
                    } // Unique key, fallback with index for stability
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstItem + index + 1}{" "}
                      {/*S.No for pagination */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {country.cCountry_name || "Unknown"}{" "}
                      {/* Fill empty with "Unknown" */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        `<span
                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                            ${country.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                        {country.bactive ? "Active" : "Inactive"}
                        </span>     
                      {/* Fill empty with "Unknown" */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === number + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Country;
