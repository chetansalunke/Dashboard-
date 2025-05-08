export default function FilterSortControls({
    showDropdown,
    setShowDropdown,
    sortDropdownRef,
    sortOption,
    setSortOption,
    showFilterDropdown,
    setShowFilterDropdown,
    filterDropdownRef
  }) {
    return (
      <div className="flex gap-4">
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className="px-3 py-1 bg-white border text-sm font-medium rounded hover:bg-gray-100"
          >
            Filter By ▼
          </button>
          {showFilterDropdown && (
            <div ref={filterDropdownRef} className="absolute left-0 mt-1 w-44 bg-white border shadow-lg rounded text-sm z-20">
              {["Version", "Sent By", "Status", "Discipline"].map((filter) => (
                <button key={filter} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
  
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-1 bg-white border text-sm font-medium rounded hover:bg-gray-100"
          >
            Sort by ▼
          </button>
          {showDropdown && (
            <div ref={sortDropdownRef} className="absolute right-0 mt-1 w-44 bg-white border shadow-lg rounded text-sm z-20">
              <button onClick={() => { setSortOption("date"); setShowDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">Date</button>
              <button onClick={() => { setSortOption("a-z"); setShowDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">A to Z</button>
            </div>
          )}
        </div>
      </div>
    );
  }
  