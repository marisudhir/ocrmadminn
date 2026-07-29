import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { getWeekFromDate } from "../../utils/weeklyData";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
  scales,
} from "chart.js";

ChartJS.register(
  LineElement, // For Line charts
  BarElement, // For Bar charts
  CategoryScale, // X axis
  LinearScale, // Y axis
  PointElement, // Dots on lines
  Filler, // Area fill under line
  Tooltip,
  Legend
);
import { useState } from "react";

import { useEffect } from "react";
import { Label } from "recharts";

const AlertScreen = () => {
  const [week, setWeek] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Handle user selecting any date
  const handleDateSelect = (dateStr) => {
    const newDate = new Date(dateStr);
    const selectedWeek = getWeekFromDate(newDate);
    setSelectedDate(dateStr);
    setWeek(selectedWeek);
  };

  // Demo lead spike data
  const leadSpikeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [15000, 20000, 18000, 22000, 25000],
        borderColor: "#3b82f6", // Line color
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // Wait until chartArea is available
          if (!chartArea) return null;

          return getGradient(ctx, chartArea);
        },
        tension: 0.2, // Slight curve to the line
        fill: true, // 👈 This enables the fill
      },
    ],
  };

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        data: [12000, 19000, 3000, 5000, 20000],
        backgroundColor: "#1F1F1F",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  //Function to get the color gradient
  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );

    // Define your color stops
    gradient.addColorStop(0, "#164CA1"); // Top color (opaque)
    gradient.addColorStop(1, "#164CA100"); // Bottom color (transparent)

    return gradient;
  };
  const today = new Date().toISOString().split("T")[0]; // format: "YYYY-MM-DD"

  // To fetch the current weeks date
  useEffect(() => {
    const thisWeek = getWeekFromDate(); // today by default
    setWeek(thisWeek);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-casuten flex">
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="text-gray-500"></div>
          </div>
        </div>

        {/* Date Row */}
        <div className="flex items-center gap-4 mb-8 w-full">
          {week.map((day, idx) => {
            const isSelected = day.formatted === selectedDate;
            const isToday = day.formatted === today;

            return (
              <div
                key={idx}
                className={`rounded-xl px-4 py-3 text-center flex-1 shadow-sm
                            ${isSelected ? "bg-blue-600 text-white" : ""}
                            ${
                              isToday && !isSelected
                                ? "bg-blue-100 text-blue-600 font-semibold shadow-xl"
                                : ""
                            }
                            ${
                              !isSelected && !isToday
                                ? "bg-[#F9F9F9] border border-gray-200 text-gray-800 shadow-xl"
                                : ""
                            }
                        `}
              >
                <div className="text-sm">{day.label.split(" ")[0]}</div>{" "}
                {/* Day like "Mon" */}
                <div className="text-xl font-bold">
                  {day.label.split(" ")[1]}
                </div>{" "}
                {/* Date like "24" */}
              </div>
            );
          })}
        </div>
        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Lead volume spike</h2>
            {/* List items here */}
            <Line
              data={leadSpikeData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>

          {/* Machine Overview */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Storage warnings</h2>
            <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm mt-10">
              <thead className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Storage</th>
                  <th className="py-3 px-4">Message</th>
                </tr>
              </thead>

              <tbody></tbody>
            </table>
          </div>

          {/* Material Overview */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Falied login attempts
            </h2>
            {/* Material items here */}
            <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm mt-10">
              <thead className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">IP address</th>
                  <th className="py-3 px-4">Attempted time</th>
                </tr>
              </thead>

              <tbody></tbody>
            </table>
          </div>

          {/* Graph Card (Full width on large screens) */}
          <div className="bg-white p-6 rounded-xl shadow-md  ">
            <h2 className="text-lg font-semibold mb-4">Inactive graph time</h2>
            {/* Graph placeholder */}
            <Bar data={data} options={options} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlertScreen;
