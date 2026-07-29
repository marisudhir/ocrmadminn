import React from "react";

function Card({ title, count, icon, size = "default" }) {
  const isCompact = size === "compact";

  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-md
        hover:shadow-xl
        transform hover:-translate-y-1
        transition-all duration-300 ease-in-out
        p-6 sm:p-6
        w-full
        min-h-[140px]
        flex
        items-center
      "
    >
      <div className={`flex items-center justify-between w-full ${isCompact ? "gap-4" : "gap-6"}`}>
        
        {/* Left Section (Text) */}
        <div className="flex-1">
          <div className={`${isCompact ? "text-3xl" : "text-4xl"} font-bold text-blue-900 mb-1`}>
            {count}
          </div>
          <h3 className={`${isCompact ? "text-lg" : "text-2xl"} font-semibold text-gray-900`}>
            {title}
          </h3>
        </div>

        {/* Right Section (Icon) */}
        <div className={`${isCompact ? "w-16 h-16" : "w-40 h-40"} flex-shrink-0`}>
          <img
            src={icon}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
