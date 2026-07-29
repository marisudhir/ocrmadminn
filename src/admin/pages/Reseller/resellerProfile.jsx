import { Line, Pie } from 'react-chartjs-2';
import { Button } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CallIcon from '@mui/icons-material/Call';
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useResellerController } from "./resellerController";
import formatDate from "../../utils/formatDate";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ResellerProfile = () => {
  const { fetchResellerDataById } = useResellerController();
  const [reseller, setReseller] = useState(null);
  const { id } = useParams();
  

  const created_at = useMemo(() => formatDate(reseller?.dCreated_dt), [reseller?.dCreated_dt]);
  const modified_at = useMemo(() => formatDate(reseller?.dUpdated_dt), [reseller?.dUpdated_dt]);

  useEffect(() => {
    const loadReseller = async () => {
      try {
        const data = await fetchResellerDataById(id);
        setReseller(data);
      } catch (error) {
        console.error("Failed to fetch reseller data:", error);
        setReseller(null);
      }
    };
    if (id) {
      loadReseller();
    } else {
      setReseller(null);
    }
  }, [id]);

  // --- Chart Data & Options ---
  const lineData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Revenue',
      data: [15000, 20000, 18000, 22000, 25000],
      borderColor: 'rgb(75, 192, 192)', // Keep original chart color for consistency with previous charts
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Soft fill
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
      pointHoverBackgroundColor: 'rgb(60, 150, 150)',
      pointHoverBorderColor: '#fff',
    }]
  }), []);

  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#4B5563'
        }
      },
      tooltip: {
        backgroundColor: '#374151',
        titleFont: { size: 14, family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'Inter, sans-serif' } },
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#E5E7EB' },
        ticks: {
          color: '#6B7280',
          font: { family: 'Inter, sans-serif' },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(value);
          }
        },
        border: { display: false }
      },
    },
  }), []);

  const pieData = useMemo(() => ({
    labels: ['Used Storage', 'Available Storage'],
    datasets: [{
      data: [65, 35],
      backgroundColor: ['#4299E1', '#E2E8F0'], // Adjusted for softer blue and light gray
      borderColor: '#fff',
      borderWidth: 2,
    }]
  }), []);

  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#4B5563'
        }
      },
      tooltip: {
        backgroundColor: '#374151',
        titleFont: { size: 14, family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    }
  }), []);


  if (reseller === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading reseller profile...</p>
      </div>
    );
  }

  if (reseller === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg">Reseller not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 min-h-screen font-sans antialiased">
      <div className="max-w-9xl mx-auto">
        {/* Header Section: Reseller Name, Actions, Edit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"> {/* Reduced shadow, rounded-xl */}
          <div className="flex items-center space-x-6 mb-4 sm:mb-0">
            <div className="w-20 h-20 bg-blue-50 text-blue-700 flex items-center justify-center rounded-full text-3xl font-bold uppercase shadow-inner"> {/* Softer blue background for avatar */}
              {reseller?.creseller_name?.charAt(0) || 'R'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                {reseller?.creseller_name || "Unknown Reseller"}
              </h1>
              <div className="flex flex-wrap gap-3 mt-3">
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<ChatIcon />}
                  sx={{
                    bgcolor: '#3B82F6', // Tailwind blue-500
                    '&:hover': { bgcolor: '#2563EB' }, // Darker blue on hover
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: '0.5rem', // Match Tailwind rounded-lg
                    boxShadow: 'none', // Remove material UI shadow
                  }}
                >
                  Message
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<NotificationsIcon />}
                  sx={{
                    borderColor: '#D1D5DB', // gray-300
                    color: '#4B5563', // gray-700
                    '&:hover': { bgcolor: '#F3F4F6', borderColor: '#9CA3AF' }, // light gray hover
                    textTransform: 'none',
                    borderRadius: '0.5rem', // Match Tailwind rounded-lg
                  }}
                >
                  Reminders
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<CallIcon />}
                  sx={{
                    borderColor: '#D1D5DB',
                    color: '#4B5563',
                    '&:hover': { bgcolor: '#F3F4F6', borderColor: '#9CA3AF' },
                    textTransform: 'none',
                    borderRadius: '0.5rem', // Match Tailwind rounded-lg
                  }}
                >
                  Call
                </Button>
              </div>
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"> {/* Changed to indigo, reduced shadow */}
            Edit Profile
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center"> {/* Rounded-xl, shadow-sm */}
            <h3 className="text-base font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-4xl font-extrabold text-blue-600">321</p> {/* Consistent blue */}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
            <h3 className="text-base font-semibold text-gray-700 mb-2">Companies</h3>
            <p className="text-4xl font-extrabold text-green-600">12</p> {/* Consistent green */}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
            <h3 className="text-base font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-4xl font-extrabold text-purple-600">₹1.2L</p> {/* Consistent purple */}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
            <h3 className="text-base font-semibold text-gray-700 mb-2">Active Plans</h3>
            <p className="text-4xl font-extrabold text-orange-600">5</p> {/* Consistent orange */}
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8"> {/* Reduced shadow, rounded-xl */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reseller Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {[{
              label: "Reseller Name",
              value: reseller?.creseller_name || "N/A"
            }, {
              label: "Reseller ID",
              value: reseller?.ireseller_id || "N/A"
            }, {
              label: "Status",
              value: reseller?.bactive ?
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span> :
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
            }, {
              label: "Plan",
              value: reseller?.plan_id || "N/A"
            }, {
              label: "Email",
              value: reseller?.cEmail || "N/A"
            }, {
              label: "Industry",
              value: reseller?.iindustry_id || "N/A"
            }, {
              label: "Created At",
              value: created_at || "N/A"
            }, {
              label: "Modified At",
              value: modified_at || "N/A"
            }].map(({ label, value }, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">{label}</span>
                <span className="text-base font-semibold text-gray-800 break-words">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[380px] flex flex-col"> {/* Rounded-xl, shadow-sm */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Revenue Trend</h2>
            <div className="flex-grow relative">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[380px] flex flex-col justify-center items-center"> {/* Rounded-xl, shadow-sm */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Storage Usage</h2>
            <div className="w-full max-w-xs h-full relative flex items-center justify-center">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerProfile;