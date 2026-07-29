import React, { useEffect, useState } from "react";

const CommonSearchBar = ({
  value = "",
  onChange,
  placeholder = "Search",
  className = "",
  inputClassName = "",
  disabled = false,
  name,
  id,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const basePlaceholder = placeholder || "Search";

  useEffect(() => {
    if (disabled || isFocused || value) {
      setAnimatedPlaceholder(basePlaceholder);
      return;
    }

    const word = basePlaceholder;
    let index = 0;
    let direction = "forward";
    let timeoutId;

    const tick = () => {
      if (direction === "forward") {
        index += 1;
        setAnimatedPlaceholder(word.slice(0, index));

        if (index >= word.length) {
          direction = "pause-full";
          timeoutId = setTimeout(tick, 1100);
          return;
        }

        timeoutId = setTimeout(tick, 180);
        return;
      }

      if (direction === "pause-full") {
        direction = "backward";
      }

      if (direction === "backward") {
        index -= 1;
        setAnimatedPlaceholder(word.slice(0, Math.max(index, 0)));

        if (index <= 0) {
          direction = "pause-empty";
          timeoutId = setTimeout(tick, 400);
          return;
        }

        timeoutId = setTimeout(tick, 110);
        return;
      }

      if (direction === "pause-empty") {
        direction = "forward";
        timeoutId = setTimeout(tick, 220);
      }
    };

    timeoutId = setTimeout(tick, 350);

    return () => clearTimeout(timeoutId);
  }, [basePlaceholder, disabled, isFocused, value]);

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <style>{`
        @keyframes commonSearchBlink {
          0%, 100% { opacity: 1; color: #3b82f6; }
          50% { opacity: 0.35; color: #2563eb; }
        }
      `}</style>
      <span
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 ${
          isFocused ? "scale-105 text-blue-600" : value ? "scale-100 text-blue-500" : "scale-100 text-blue-500"
        }`}
        style={{
          animation: !value && !isFocused ? "commonSearchBlink 1.1s ease-in-out infinite" : "none",
        }}
      >
        <svg
          className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 ${
            isFocused ? "rotate-3" : "rotate-0"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M12.9 14.32a8 8 0 111.41-1.41l4.24 4.24-1.42 1.42-4.23-4.25zM8 14a6 6 0 100-12 6 6 0 000 12z" />
        </svg>
      </span>

      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={animatedPlaceholder}
        disabled={disabled}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onKeyDown={onKeyDown}
        className={`w-full rounded-2xl border border-slate-200 bg-white/95 py-2.5 pl-11 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-blue-500 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 ${inputClassName}`}
        style={{
          letterSpacing: value ? "0.01em" : "0em",
        }}
      />

      {value ? (
        <button
          type="button"
          onClick={() =>
            onChange?.({
              target: {
                value: "",
                name,
                id,
              },
            })
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Clear search"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
};

export default CommonSearchBar;
