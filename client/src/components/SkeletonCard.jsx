/**
 * Skeleton loader za kartice albuma/izvođača
 * @returns {JSX.Element}
 */
function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="flex mt-4 space-x-1">
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;