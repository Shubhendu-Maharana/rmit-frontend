import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      {/* Material-inspired circular progress */}
      <div className="relative">
        {/* Outer ring (lighter color) */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-200"></div>

        {/* Inner spinning ring */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
      </div>

      {/* Material design typically uses subtle, understated text */}
      <p className="mt-4 text-sm font-medium text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
