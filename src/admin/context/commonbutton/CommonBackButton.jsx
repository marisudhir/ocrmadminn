import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CommonBackButton = ({
  to = -1,
  state = undefined,
  title,
  className = "",
  onClick,
  titleClassName = "",
}) => {
  const navigate = useNavigate();
  const words = String(title || "").split(" ").filter(Boolean);
  const firstWord = words[0] || "";
  const secondWord = words[1] || "";
  const remainingTitle = words.slice(2).join(" ");

  return (
    <div className={`flex items-center mb-6 ${className}`}>
      <button
        onClick={() => {
          if (onClick) {
            onClick();
            return;
          }
          navigate(to, { state });
        }}
        className="text-gray-600 hover:text-white mr-4 text-xl p-1.5 rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors"
      >
        <FaArrowLeft />
      </button>

      {title && (
        <h1 className={`text-3xl font-extrabold text-slate-800 tracking-tight ${titleClassName}`}>
          {firstWord}
          {secondWord ? <> <span className="text-[#2737b8]">{secondWord}</span></> : ""}
          {remainingTitle ? ` ${remainingTitle}` : ""}
        </h1>
      )}
    </div>
  );
};

export default CommonBackButton;
