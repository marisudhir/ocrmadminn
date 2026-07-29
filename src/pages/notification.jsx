import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../api/constraints";
import axios from "axios";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let userId = null;

  if (userString) {
    try {
      const userObject = JSON.parse(userString);
      userId = userObject.iUser_id;
    } catch (e) {
      console.error("Error parsing user object from localStorage", e);
    }
  }

  useEffect(() => {
    if (!userId || !token) {
      console.warn("User ID or token missing. Cannot fetch notifications.");
      return;
    }

    axios
      .get(`${ENDPOINTS.NOTIFICATIONS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const sortedData = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sortedData);
      })
      .catch((err) => {
        console.error("Error fetching notifications", err);
      });
  }, [userId, token]);

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Format date as DD-MM-YYYY HH:mm
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months start from 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border text-center align-middle">S. No</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Message</th>
              <th className="py-2 px-4 border">Created Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {currentNotifications.length > 0 ? (
              currentNotifications.map((notification, index) => (
                <tr key={notification.id} className="border-t">
                  <td className="py-2 px-4 border text-center align-middle">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-2 px-4 border capitalize">{notification.type}</td>
                  <td className="py-2 px-4 border">{notification.title}</td>
                  <td className="py-2 px-4 border">{notification.message}</td>
                  <td className="py-2 px-4 border">
                    {formatDateTime(notification.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {notifications.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;