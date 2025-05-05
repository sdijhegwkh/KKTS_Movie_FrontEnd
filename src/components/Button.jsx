"use client";
import PropTypes from "prop-types";

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
}) => {
  const baseClasses =
    "py-3 px-6 rounded-md font-medium transition-all duration-300 focus:outline-none";

  const variantClasses = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    link: "bg-transparent text-orange-500 hover:text-orange-600 underline",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "link"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
