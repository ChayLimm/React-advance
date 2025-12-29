
interface searchBarProps {
  searchValue: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ searchValue, onSearch }: searchBarProps) {
  return (
    <div className="flex justify-between mt-4 mb-4">
      <input
        type="text"
        placeholder="Search task"
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className="text-white w-full px-4 py-2 mr-8 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
      />

    </div>
  );
}
