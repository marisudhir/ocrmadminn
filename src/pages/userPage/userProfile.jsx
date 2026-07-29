import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ENDPOINTS } from '../../api/constraints';
import ProfileHeader from '../../Components/common/ProfileHeader';
import SettingsPage from '../userPage/settingsPage';

import {
  FaEdit, FaUser, FaEnvelope,
  FaIdBadge, FaCalendarAlt, FaFingerprint, FaBriefcase, FaUserTie
} from 'react-icons/fa';

const tabs = ['Target', 'History', 'Settings', 'Achievement'];

const UserProfile = () => {
  const { userId } = useParams();
  const user_id = userId;
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Target');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${ENDPOINTS.USER_GET}/${user_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user by ID:", error);
        setUser({}); 
      }
    };

    fetchUser();
  }, [user_id]);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading profile...</div>;

  const openForm = () => {
    setFormData({
      cFull_name: user.cFull_name || '',
      cUser_name: user.cUser_name || '',
      cEmail: user.cEmail || '',
      cjob_title: user.cjob_title || '',
      reports_to: user.reports_to || '',
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${ENDPOINTS.USER_GET}/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error('Failed to update user');
      const updated = await res.json();
      setUser(updated);
      setShowForm(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ProfileHeader />
      <div className="flex flex-col md:flex-row gap-6 p-6 flex-grow overflow-hidden items-start">
        <div className="w-full md:w-80 lg:w-96 bg-white p-6 rounded-xl shadow relative
                    flex-shrink-0
                    h-[450px] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">About</h2>
            <button onClick={openForm} className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <FaEdit size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4 mb-6 md:flex-row md:items-start md:gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              alt="avatar"
              className="w-20 h-20 rounded-full border border-gray-200 object-cover"
            />
            <div className="flex flex-col items-center md:items-start">
                <h3 className="text-2xl font-semibold text-gray-900">{user.cFull_name}</h3>
                {user.role || user.bactive !== undefined ? (
                    <span
                        className={`px-3 py-1 mt-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${
                            user.bactive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {user.bactive ? "Active" : "Disabled"} {user.role || ''}
                    </span>
                ) : (
                    <span className="text-gray-400 text-xs mt-1">Status/Role unknown</span>
                )}
            </div>
          </div>

          <div className="mt-4 space-y-3 text-gray-700">
            <div className="flex items-center gap-2"><FaEnvelope className="text-gray-500" /> <span>{user.cEmail}</span></div>
            <div className="flex items-center gap-2"><FaIdBadge className="text-gray-500" /> <span>@{user.cUser_name}</span></div>
            <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500" /> <span>Joined: {user.dCreate_dt ? new Date(user.dCreate_dt).toLocaleDateString() : 'N/A'}</span></div>
            <div className="flex items-center gap-2"><FaBriefcase className="text-gray-500" /> Job Title: {user.cjob_title || 'Not defined'}</div>
            <div className="flex items-center gap-2"><FaUserTie className="text-gray-500" /> Reports to: {user.reports_to || 'N/A'}</div>
            <div className="flex items-center gap-2"><FaFingerprint className="text-gray-500" /> User ID: {user.iUser_id}</div>
          </div>
        </div>

        <div className="w-full md:flex-1 flex flex-col gap-4 min-h-0 max-h-[60vh] overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium border border-slate-600 transition-colors duration-200 whitespace-nowrap
                  ${activeTab === tab ? 'bg-blue-900 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content area */}
          <div className="bg-white p-6 rounded-2xl shadow flex-grow overflow-auto min-h-0">
            {activeTab === 'Target' && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">🎯 Your Target</h3>
                <p className="text-gray-700">Track goals, KPIs and milestones here.</p>
              </div>
            )}
            {activeTab === 'History' && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">📜 Activity History</h3>
                <p className="text-gray-700">Your past activity and timeline.</p>
              </div>
            )}
            {activeTab === 'Settings' && (
              <div className="h-full overflow-y-auto">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">⚙️ Account Settings</h3>
                <SettingsPage />
              </div>
            )}
            {activeTab === 'Achievement' && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">🏆 Achievements</h3>
                <p className="text-gray-700">Your badges, completed goals, and recognitions.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal (remains unchanged) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative animate-fade-in-up">
            <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">✖</button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  name="cFull_name"
                  placeholder="Full Name"
                  value={formData.cFull_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div className="relative">
                <FaIdBadge className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  name="cUser_name"
                  placeholder="Username"
                  value={formData.cUser_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="email"
                  name="cEmail"
                  placeholder="Email"
                  value={formData.cEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div className="relative">
                <FaBriefcase className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  name="cjob_title"
                  placeholder="Job Title"
                  value={formData.cjob_title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="relative">
                <FaUserTie className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  name="reports_to"
                  placeholder="Reports To"
                  value={formData.reports_to}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors duration-200 font-semibold"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;