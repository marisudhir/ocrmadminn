import React from "react";

export default function CompanyCard({
  children,
  footer,
  header,
  onClick,
  className = "",
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-[0_12px_28px_rgba(148,163,184,0.14)] hover:shadow-[0_18px_34px_rgba(148,163,184,0.2)]
        transition-all duration-300 ease-out
        transform hover:-translate-y-1
        border border-slate-100
        flex flex-col h-full
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      {header && (
        <div className="p-5 sm:p-6 pb-3">
          {header}
        </div>
      )}

      {/* Body */}
      <div className="px-5 sm:px-6 flex-grow">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-5 sm:px-6 pt-3 pb-4 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
}
