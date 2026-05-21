interface UsersFilterAndSortProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: "name" | "pendingTodos";
  setSortField: (field: "name" | "pendingTodos") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  filter: string;
  setFilter: (filter: string) => void;
}

export default function UsersFilterAndSort({
  searchQuery,
  setSearchQuery,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  filter,
  setFilter,
}: UsersFilterAndSortProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between w-full">
      {/* Search Input Container */}
      <div className="relative flex-1 max-w-full lg:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <label htmlFor="search-users" className="sr-only">
          Search by name or email
        </label>
        <input
          id="search-users"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-800 dark:text-zinc-150 placeholder-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none focus:border-indigo-500 transition-all duration-150"
        />
      </div>

      {/* Controls: Filter & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Filter Select Pills */}
        <div 
          role="group" 
          aria-label="Filter users by activity state"
          className="flex bg-zinc-50 dark:bg-zinc-950 p-1 border border-zinc-150 dark:border-zinc-850 rounded-2xl"
        >
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending Tasks" },
            { value: "no-completed", label: "Inactive" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                filter === item.value
                  ? "bg-white dark:bg-zinc-850 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/50 dark:border-zinc-800/30"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sort Selectors */}
        <div className="flex items-center gap-2">
          {/* Toggle Sort Field */}
          <button
            onClick={() => setSortField(sortField === "name" ? "pendingTodos" : "name")}
            aria-label={`Sort criteria: currently sorting by ${sortField === "name" ? "Name" : "Pending Tasks"}. Click to toggle.`}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:bg-zinc-100 transition-colors duration-150 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            <span className="opacity-80">
              Sort by: {sortField === "name" ? "Name" : "Pending Tasks"}
            </span>
          </button>

          {/* Toggle Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            aria-label={`Toggle sort order. Currently sorting ${sortOrder === "asc" ? "ascending" : "descending"}. Click to sort ${sortOrder === "asc" ? "descending" : "ascending"}.`}
            className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:bg-zinc-100 transition-colors duration-150 cursor-pointer shadow-sm flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                sortOrder === "desc" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
