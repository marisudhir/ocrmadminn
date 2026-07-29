import React from "react";

export default function CommonCard({
  image,
  title,
  badge,
  children,
  status,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {image && (
          <img
            src={image}
            alt="profile"
            className="w-14 h-14 rounded-full object-cover"
          />
        )}

        <div className="flex flex-1 items-center justify-between min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {title}
          </h2>

          {badge && (
            <span className="ml-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-gray-700 space-y-1">
        {children}
      </div>

      {/* Status */}
      {status && (
        <div className="pt-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.text}
          </span>
        </div>
      )}
    </div>
  );
}