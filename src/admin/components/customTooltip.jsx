import React from 'react';

const CustomTooltip = ({ active, payload, label, suffix }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-red-600 font-semibold">
            {payload[0].value} {suffix}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
