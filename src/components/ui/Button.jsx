const Button = ({
  children,
  color = "primary",
  variant = "solid",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
}) => {
  const base =
    "rounded-lg font-medium transition flex items-center justify-center gap-2";

  /* ---------- SIZE SYSTEM ---------- */

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  /* ---------- COLOR SYSTEM ---------- */

  const colors = {
    primary: {
      solid: "bg-blue-600 text-white hover:bg-blue-700",
      soft: "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
      outlined:
        "border border-blue-500 text-blue-400 hover:bg-blue-600/10",
      plain: "text-blue-400 hover:bg-blue-600/10",
    },

    neutral: {
      solid: "bg-gray-700 text-white hover:bg-gray-800",
      soft: "bg-gray-700/30 text-gray-300 hover:bg-gray-700/40",
      outlined:
        "border border-gray-600 text-gray-300 hover:bg-gray-700/20",
      plain: "text-gray-300 hover:bg-gray-700/20",
    },

    danger: {
      solid: "bg-red-600 text-white hover:bg-red-700",
      soft: "bg-red-600/20 text-red-400 hover:bg-red-600/30",
      outlined:
        "border border-red-500 text-red-400 hover:bg-red-600/10",
      plain: "text-red-400 hover:bg-red-600/10",
    },

    success: {
      solid: "bg-green-600 text-white hover:bg-green-700",
      soft: "bg-green-600/20 text-green-400 hover:bg-green-600/30",
      outlined:
        "border border-green-500 text-green-400 hover:bg-green-600/10",
      plain: "text-green-400 hover:bg-green-600/10",
    },

    warning: {
      solid: "bg-yellow-600 text-white hover:bg-yellow-700",
      soft: "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30",
      outlined:
        "border border-yellow-500 text-yellow-400 hover:bg-yellow-600/10",
      plain: "text-yellow-400 hover:bg-yellow-600/10",
    },
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base}
        ${sizes[size]}
        ${colors[color][variant]}
        ${(disabled || loading) && disabledStyle}
        ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}

      {children}
    </button>
  );
};

export default Button;
