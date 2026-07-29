import React from "react";

export default function CommonLeadCard({
  children,
  footer,
  topLeft,
  topRight,
  onClick,
  blink,
  innerRef,
}) {
  return (
    <div
      ref={innerRef}
      onClick={onClick}
      className={`
        relative group bg-white rounded-xl shadow-lg p-10
        cursor-pointer flex flex-col justify-between
        transition-all duration-300
        ${
          blink
            ? "ring-4 ring-blue-500 bg-blue-50 animate-pulse"
            : "border border-gray-200 hover:shadow-xl"
        }
      `}
    >
      {/* Top Left Icons */}
      {topLeft && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {topLeft}
        </div>
      )}

      {/* Top Right Actions */}
      {topRight && (
        <div className="absolute top-3 right-3">
          {topRight}
        </div>
      )}

      {/* Body */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}