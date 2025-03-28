import classNames from "classnames";
import React from "react";
function Button({
  children,
  variant = "primary",
  type = "button",
  className,
  ...props
}) {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      type={type}
      className={classNames(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
