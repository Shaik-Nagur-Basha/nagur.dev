export function ButtonPrimary({ children, className = "", ...props }) {
  return (
    <button
      className={`
        px-6 py-3 
        bg-linear-to-r from-blue-600 to-purple-600 
        text-white font-semibold rounded-xl
        hover:shadow-xl hover:scale-105 hover:shadow-blue-500/50
        active:scale-95
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({ children, className = "", ...props }) {
  return (
    <button
      className={`
        px-6 py-3 
        border-2 border-gray-300 dark:border-gray-600 
        text-gray-700 dark:text-gray-300 
        font-semibold rounded-xl
        hover:bg-gray-100 dark:hover:bg-gray-800
        hover:border-gray-400 dark:hover:border-gray-500
        hover:shadow-lg
        active:scale-95
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonOutline({ children, className = "", ...props }) {
  return (
    <button
      className={`
        px-6 py-3 
        border-2 border-gray-300 dark:border-gray-600 
        text-gray-700 dark:text-gray-300 
        font-semibold rounded-xl
        hover:bg-white/5 dark:hover:bg-gray-700/5
        hover:border-blue-500 dark:hover:border-blue-400
        active:scale-95
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonSmall({ children, className = "", ...props }) {
  return (
    <button
      className={`
        px-4 py-2 
        bg-blue-600 text-white
        font-semibold rounded-lg text-sm
        hover:bg-blue-700 
        hover:shadow-md
        active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
