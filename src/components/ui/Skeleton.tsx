const Skeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="animate-pulse bg-gray-300 h-12 mb-4"></div>
        <div className="animate-pulse bg-gray-300 h-4 mb-2"></div>
        <div className="animate-pulse bg-gray-300 h-4"></div>
      </div>
      <div className="p-6">
        <div className="animate-pulse bg-gray-300 h-12 mb-4"></div>
        <div className="animate-pulse bg-gray-300 h-4 mb-2"></div>
        <div className="animate-pulse bg-gray-300 h-4"></div>
      </div>
    </div>
  );
};

export default Skeleton;
