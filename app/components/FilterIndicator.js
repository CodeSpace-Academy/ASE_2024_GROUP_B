export default function FilterIndicator({ selectedFilter }) {
    return (
      <div className="mb-4 text-center">
        {selectedFilter !== "none" ? (
          <span>
            <span className="text-md font-semibold">Applied Filter:</span>{" "}
            <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">
              {selectedFilter}
            </span>
          </span>
        ) : (
          <span className="text-md text-gray-600">No filters applied</span>
        )}
      </div>
    );
  }