import React, { useState, useEffect, useRef } from "react";
import BASE_URL from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import DisciplineTabs from "../../components/designer/Design/DisciplineTabs";
import FilterSortControls from "../../components/designer/Design/FilterSortControls";
import DrawingTable from "../../components/designer/Design/DrawingTable";
import TopBarControls from "../../components/designer/Design/TopBarControls";
import { List } from "lucide-react";

export default function Design() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [selectedProjectInfo, setSelectedProjectInfo] = useState({});
  const [users, setUsers] = useState({});
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedProject = JSON.parse(
    localStorage.getItem("selectedProject") || "{}"
  );

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      // Save full user objects directly
      // setUsers(userData.users);
      const userMap = {};
      userData.users.forEach((user) => {
        userMap[user.id] = user.username;
      });
      setUsers(userMap);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchSelectedProjectInfo = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/api/projects/${selectedProject.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setSelectedProjectInfo(data.project || {});
    } catch (error) {
      console.error("Error fetching project:", error);
      setSelectedProjectInfo({});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrawings = async () => {
    setIsLoading(true);
    try {
      if (!selectedProject?.id) {
        setDrawings([]);
        return;
      }

      const token = localStorage.getItem("accessToken");
      // Use the correct endpoint for fetching drawings
      const response = await fetch(
        `${BASE_URL}/api/projects/${selectedProject.id}/drawings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Process the drawings data to match the component's expected format
      const processedDrawings = Array.isArray(data.drawings)
        ? data.drawings.map((drawing) => ({
            drawing_id: drawing.drawing_id,
            drawing_name: drawing.drawing_name,
            discipline: drawing.discipline,
            status: drawing.status,
            last_updated: drawing.last_updated,
            latest_version_id: drawing.latest_version_id,
            latest_document_path: drawing.latest_document_path,
            latest_version_number: drawing.latest_version_number,
            previous_version_number: drawing.previous_version_number,
            previous_document_path: drawing.previous_document_path,
            sent_by_name: drawing.sent_by_name,
          }))
        : [];

      setDrawings(processedDrawings);
    } catch (error) {
      console.error("Error fetching drawings:", error);
      setDrawings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedProjectInfo();
    fetchDrawings();
  }, [selectedProject.id]);

  const filteredDrawings = drawings.filter((drawing) => {
    const matchesSearch = drawing.drawing_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDiscipline =
      activeTab === "All" || drawing.discipline === activeTab;
    return matchesSearch && matchesDiscipline;
  });

  const sortedDrawings = [...filteredDrawings].sort((a, b) => {
    if (sortOption === "date")
      return new Date(b.last_updated) - new Date(a.last_updated);
    if (sortOption === "a-z")
      return a.drawing_name.localeCompare(b.drawing_name);
    return 0;
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowActionDropdown(null);
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target)
      )
        setShowDropdown(false);
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target)
      )
        setShowFilterDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // return (
  //   <div className="bg-gray-100 min-h-screen">
  //     <main className="h-full overflow-y-auto">
  //       <div className="container px-6 py-6 mx-auto">
  //         {isLoading ? (
  //           <div className="flex justify-center items-center h-64">
  //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //           </div>
  //         ) : (
  //           <>
  //             <TopBarControls
  //               searchTerm={searchTerm}
  //               setSearchTerm={setSearchTerm}
  //               setShowUploadForm={setShowUploadForm}
  //               navigate={navigate}
  //               selectedProject={selectedProject}
  //             />

  //             <hr className="border border-gray-300 my-4" />

  //             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 bg-white p-4 rounded-lg shadow-sm w-full">
  //               <DisciplineTabs
  //                 activeTab={activeTab}
  //                 setActiveTab={setActiveTab}
  //               />
  //               <FilterSortControls
  //                 showDropdown={showDropdown}
  //                 setShowDropdown={setShowDropdown}
  //                 sortDropdownRef={sortDropdownRef}
  //                 sortOption={sortOption}
  //                 setSortOption={setSortOption}
  //                 showFilterDropdown={showFilterDropdown}
  //                 setShowFilterDropdown={setShowFilterDropdown}
  //                 filterDropdownRef={filterDropdownRef}
  //               />
  //             </div>

  //             <DrawingTable
  //               users={users}
  //               drawings={sortedDrawings}
  //               showActionDropdown={showActionDropdown}
  //               setShowActionDropdown={setShowActionDropdown}
  //               dropdownRef={dropdownRef}
  //               fetchDrawings={fetchDrawings}
  //             />
  //           </>
  //         )}
  //       </div>
  //     </main>
  //   </div>
  // );

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 py-6 mx-auto">
          {!selectedProject?.id ? (
            <div className="">
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <List size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">
                  Please select a project first.
                </p>
                <button
                  onClick={() => navigate("/designer-dashboard/projects")}
                  className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Go to Projects
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <TopBarControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowUploadForm={setShowUploadForm}
                navigate={navigate}
                selectedProject={selectedProject}
              />

              <hr className="border border-gray-300 my-4" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 bg-white p-4 rounded-lg shadow-sm w-full">
                <DisciplineTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <FilterSortControls
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  sortDropdownRef={sortDropdownRef}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  showFilterDropdown={showFilterDropdown}
                  setShowFilterDropdown={setShowFilterDropdown}
                  filterDropdownRef={filterDropdownRef}
                />
              </div>

              <DrawingTable
                users={users}
                drawings={sortedDrawings}
                showActionDropdown={showActionDropdown}
                setShowActionDropdown={setShowActionDropdown}
                dropdownRef={dropdownRef}
                fetchDrawings={fetchDrawings}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
