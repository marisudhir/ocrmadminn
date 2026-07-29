import React from "react";

export default function CommonCard({
  title,
  subtitle,
  children,
  footer,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 
                 hover:shadow-lg transition cursor-pointer 
                 flex flex-col justify-between group"
    >
      <div>
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg truncate 
                       group-hover:text-blue-600 transition-colors mb-0.5">
          {title}
        </h3>

        {/* Organization */}
        {subtitle && (
          <p className="text-[11px] text-gray-800 uppercase font-bold 
                        tracking-wider truncate border-b pb-3 mb-4">
            {subtitle}
          </p>
        )}

        {/* Content */}
        <div className="space-y-2.5 mb-5">
          {children}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="flex justify-between items-center border-t pt-4 mt-2">
          {footer}
        </div>
      )}
    </div>
  );
}