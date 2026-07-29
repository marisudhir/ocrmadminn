import React, { useState, useEffect } from "react";

function ToggleSwitch({ status, name, onToggle, data }) {
  const [isOn, setIsOn] = useState(status || false);

  // Sync with external status if it changes
  useEffect(() => {
    setIsOn(status);
  }, [status]);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);

    // Call parent function if provided
    if (onToggle) {
      onToggle(name, newState, data);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none
        ${isOn ? "bg-blue-600" : "bg-gray-300"}`}
    >
      {/* Circle */}
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300
          ${isOn ? "translate-x-6" : "translate-x-0"}`}
      ></div>
    </button>
  );
}

export default ToggleSwitch;
