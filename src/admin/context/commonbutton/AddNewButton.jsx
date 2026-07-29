import React from "react";

const AddNewButton = ({
  label = "Add New",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default AddNewButton;