import React from "react";

interface FilterButtonsProps {
  selectedFilters: string[];
  onFilterSelect: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  selectedFilters,
  onFilterSelect,
}) => {
  return (
    <div className="mt-4 flex flex-row items-start">
      <div>
        <span className="text-sm font-semibold text-gray-700">Group By:</span>
        <div className="flex flex-row gap-2 mt-1">
          {["term", "subject"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilters.includes(filter)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition duration-300 ease-in-out`}
              onClick={() => onFilterSelect(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 self-stretch flex items-center">
        <div className="w-px bg-gray-300 h-full"></div>
      </div>

      <div className="flex-1">
        <span className="text-sm font-semibold text-gray-700">
          Sort By Grade:
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {["gradeAscending", "gradeDescending"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFilters.includes(filter)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition duration-300 ease-in-out`}
              onClick={() => onFilterSelect(filter)}
            >
              {filter === "gradeAscending"
                ? "Lowest to Highest"
                : "Highest to Lowest"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterButtons;
