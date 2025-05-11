import React, { useState, useEffect, useRef } from "react";
import BASE_URL from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import UploadDrawingForm from "../admin/UploadDrawingForm";
import DisciplineTabs from "../../components/designer/Design/DisciplineTabs";
import FilterSortControls from "../../components/designer/Design/FilterSortControls";
import DrawingTable from "../../components/designer/Design/DrawingTable";
import TopBarControls from "../../components/designer/Design/TopBarControls";

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
  const [selectedProjectInfo, setSelectedProjectInfo] = useState([]);

  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedProject = JSON.parse(
    localStorage.getItem("selectedProject") || "{}"
  );

  const fetchSelectedProjectInfo = async () => {
    setIsLoading(true);
    try {
      // const token = localStorage.getItem("accessToken");
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ2NjcxNjI3LCJleHAiOjE3NDcyNzY0Mjd9.DmuXa27o5BPt2wAjxBbPUjIkIrCOY_QN_ueIQ2E3elw";
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
      // console.log("Fetched project data:", data);
      setSelectedProjectInfo(data.project || {});
    } catch (error) {
      console.error("Error fetching project:", error);
      setSelectedProjectInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedProjectInfo();
  }, []);

  const fetchDrawings = async () => {
    if (!selectedProject?.id) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/projects/design_drawing/${selectedProject.id}`
      );
      const data = await response.json();
      setDrawings(
        Array.isArray(data.designDrawings) ? data.designDrawings : []
      );
    } catch (error) {
      console.error("Error fetching drawings:", error);
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  const filteredDrawings = drawings.filter((drawing) => {
    const matchesSearch = drawing.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDiscipline =
      activeTab === "All" || drawing.discipline === activeTab;
    return matchesSearch && matchesDiscipline;
  });

  const sortedDrawings = [...filteredDrawings].sort((a, b) => {
    if (sortOption === "date")
      return new Date(b.created_date) - new Date(a.created_date);
    if (sortOption === "a-z") return a.name.localeCompare(b.name);
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

  const handleUploadSubmit = (data) => {
    // Handle upload logic here
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        {showUploadForm ? (
          <div className="space-y-4 m-4">
            <h1 className="text-xl font-semibold tracking-wide text-left text-gray-500 uppercase">
              Upload Drawing
            </h1>
            <UploadDrawingForm
              onClose={() => setShowUploadForm(false)}
              onSubmit={handleUploadSubmit}
              selectedProject={selectedProjectInfo}
            />
          </div>
        ) : (
          <div className="container px-6 my-6 grid">
            <TopBarControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setShowUploadForm={setShowUploadForm}
              navigate={navigate}
              selectedProject={selectedProject}
            />
            <hr className="border border-gray-400" />
            <div className="flex justify-between items-center gap-3 mb-4 bg-white w-full mt-4">
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
              drawings={sortedDrawings}
              showActionDropdown={showActionDropdown}
              setShowActionDropdown={setShowActionDropdown}
              dropdownRef={dropdownRef}
            />
          </div>
        )}
      </main>
    </div>
  );
}
