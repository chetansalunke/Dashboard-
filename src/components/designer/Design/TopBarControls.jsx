export default function TopBarControls({ searchTerm, setSearchTerm, setShowUploadForm, navigate, selectedProject }) {
    return (
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-600 mb-2">
          {selectedProject?.projectName || "No Project Selected"}
        </h1>
        <div className="flex justify-end gap-4 mb-2">
          <div className="relative w-[280px]">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-2 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
            />
          </div>
          <button onClick={() => setShowUploadForm(true)} className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">Upload Drawing</button>
          <button onClick={() => navigate(-1)} className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">Back</button>
        </div>
      </div>
    );
  }