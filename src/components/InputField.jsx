"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { EyeIcon, EyeOffIcon } from "./Icons";

const InputField = ({
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="relative mb-4">
      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showPasswordToggle: PropTypes.bool,
};

export default InputField;
