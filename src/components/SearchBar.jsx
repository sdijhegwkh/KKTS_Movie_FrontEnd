"use client";

import { useState, useRef } from "react";

const SearchBar = ({ value, onChange, placeholder = "Tìm kiếm..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange("");
    inputRef.current.focus();
  };

  return (
    <div
      className={`relative flex items-center w-full rounded-lg transition-all duration-300 ${
        isFocused ? "bg-gray-700 ring-2 ring-orange-500" : "bg-gray-800"
      }`}
    >
      <div className="flex items-center justify-center pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-colors ${
            isFocused ? "text-orange-500" : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 px-4 bg-transparent text-white focus:outline-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <button
          onClick={handleClear}
          className="flex items-center justify-center pr-4 text-gray-400 hover:text-white"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
