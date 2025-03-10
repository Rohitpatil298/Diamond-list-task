import React from "react";
import classNames from "classnames";

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  required = false,
  ...props
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={classNames(
          "mt-1 block w-full p-2 rounded-md shadow-sm",
          "sm:text-sm",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
