const Input = ({
  value,
  onChange,
  placeholder = "",
  color = "neutral",
  variant = "outlined",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const base =
    "rounded-lg outline-none transition w-full bg-transparent";

  /* ---------- SIZE ---------- */

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  /* ---------- COLOR + VARIANT ---------- */

  const styles = {
    neutral: {
      solid:
        "bg-gray-800 text-white border border-gray-700 focus:border-gray-500",
      soft:
        "bg-gray-700/40 text-gray-200 border border-gray-600 focus:border-gray-400",
      outlined:
        "border border-gray-600 text-gray-200 focus:border-blue-500",
      plain:
        "border-b border-gray-600 text-gray-200 focus:border-blue-500 rounded-none",
    },

    primary: {
      solid:
        "bg-blue-900/40 text-blue-200 border border-blue-600 focus:border-blue-400",
      soft:
        "bg-blue-600/20 text-blue-300 border border-blue-500 focus:border-blue-400",
      outlined:
        "border border-blue-500 text-blue-300 focus:border-blue-400",
      plain:
        "border-b border-blue-500 text-blue-300 focus:border-blue-400 rounded-none",
    },

    danger: {
      solid:
        "bg-red-900/40 text-red-200 border border-red-600 focus:border-red-400",
      soft:
        "bg-red-600/20 text-red-300 border border-red-500 focus:border-red-400",
      outlined:
        "border border-red-500 text-red-300 focus:border-red-400",
      plain:
        "border-b border-red-500 text-red-300 focus:border-red-400 rounded-none",
    },

    success: {
      solid:
        "bg-green-900/40 text-green-200 border border-green-600 focus:border-green-400",
      soft:
        "bg-green-600/20 text-green-300 border border-green-500 focus:border-green-400",
      outlined:
        "border border-green-500 text-green-300 focus:border-green-400",
      plain:
        "border-b border-green-500 text-green-300 focus:border-green-400 rounded-none",
    },

    warning: {
      solid:
        "bg-yellow-900/40 text-yellow-200 border border-yellow-600 focus:border-yellow-400",
      soft:
        "bg-yellow-600/20 text-yellow-300 border border-yellow-500 focus:border-yellow-400",
      outlined:
        "border border-yellow-500 text-yellow-300 focus:border-yellow-400",
      plain:
        "border-b border-yellow-500 text-yellow-300 focus:border-yellow-400 rounded-none",
    },
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        ${base}
        ${sizes[size]}
        ${styles[color][variant]}
        ${disabled && disabledStyle}
        ${className}
      `}
      {...props}
    />
  );
};

export default Input;
