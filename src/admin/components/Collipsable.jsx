// CollapsibleButton.jsx
import { Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";

export default function CollapsibleButton({
  title = "Toggle",
  defaultOpen = false,
  children,
  className = "",
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    // update max-height to content's scrollHeight when open, else 0
    if (contentRef.current) {
      setMaxHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open, children]);

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between rounded-md"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700">
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 8l4 4 4-4" />
            </svg>
          </span>
          <Typography className="text-left font-bold text-gray-800" sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1rem" }}>
            {title}
          </Typography>
        </div>
      </button>

      {/* animated container: transition on max-height */}
      <div
        ref={contentRef}
        style={{ maxHeight, transition: "max-height 240ms ease" }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        <div className="p-3 bg-white rounded-b-md">
          {children}
        </div>
      </div>
    </div>
  );
}
