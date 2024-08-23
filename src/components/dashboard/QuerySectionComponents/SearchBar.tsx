import React from "react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  onKeyPress,
}) => {
  return (
    <div className="flex items-stretch bg-gray-100 rounded-full overflow-hidden">
      <input
        className="flex-grow bg-transparent px-6 py-3 text-lg focus:outline-none text-gray-800"
        placeholder="Enter Course Name, Subject, Grade, or Grade Comparison (e.g., >B, <=A-)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyPress}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 transition duration-300 ease-in-out flex items-center justify-center"
        onClick={onSearch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
