import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import ProjectDropdown from "./RFI/ProjectDropdown";
import ChangeOrderControl from "./ChangeOrderControl";
import ChangeOrderTable from "./ChangeOrderTable";

export default function ChangeOrder() {
  const [rfis, setRfis] = useState([]);
  const [filteredRfis, setFilteredRfis] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [openedChangeOrder, setOpenedChangeOrder] = useState(null);
  const [sortOption, setSortOption] = useState("a-z");


  const storedUser = localStorage.getItem("user");
  const userID = storedUser ? JSON.parse(storedUser)?.id : null;

  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedProjectId) {
      fetchRfis(selectedProjectId);
    }
  }, [token, selectedProjectId]);

useEffect(() => {
  filterRfisByTabAndSearch();
}, [activeTab, rfis, searchText, sortOption]); // ✅ Added sortOption


  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      const data = await response.json();
      setProjectList(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectList([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
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

  const fetchRfis = async (projectIdToFetch) => {
    if (!projectIdToFetch) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/getAllRfi`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        await handleRefreshToken();
        return fetchRfis(projectIdToFetch);
      }

      if (!response.ok) throw new Error("Failed to fetch RFIs");

      const data = await response.json();
      const filtered = data.filter(
        (rfi) => rfi.project_id === Number(projectIdToFetch)
      );
      setRfis(filtered);
    } catch (err) {
      console.error("Error fetching RFIs:", err);
      setError("Failed to load RFIs");
    } finally {
      setLoading(false);
    }
  };

  const filterRfisByTabAndSearch = () => {
    let filtered = [...rfis];
    if (sortOption === "a-z") {
  filtered.sort((a, b) => a.title.localeCompare(b.title));
} else if (sortOption === "date") {
  filtered.sort( (a, b) => new Date(b.dateRequested) - new Date(a.dateRequested));
}
    setFilteredRfis(filtered);
  };

  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      setToken(data.accessToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      setError("Session expired. Please log in again.");
    }
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full w-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <h1 className="text-xl font-semibold tracking-wide text-black uppercase mb-1">
            {selectedProjectName && `${selectedProjectName}`}
          </h1>

          {!openedChangeOrder && (
            <div className="flex justify-between">
              <ProjectDropdown
                projectList={projectList}
                selectedProjectId={selectedProjectId}
                onChange={(selectedId) => {
                  setSelectedProjectId(selectedId);
                  const selectedProject = projectList.find(
                    (p) => p.id === Number(selectedId)
                  );
                  setSelectedProjectName(selectedProject?.projectName || "");
                }}
              />

              <ChangeOrderControl
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onSearchChange={setSearchText}
                onCreateClick={() => setShowForm(true)}
                setSortOption={setSortOption}
                user = {storedUser}
              />
            </div>
          )}

          {selectedProjectId && (
            <ChangeOrderTable
              rfis={filteredRfis}
              users={users}
              onOpen={(rfi) => setOpenedChangeOrder(rfi)} 
              sortOption={sortOption}
            />
          )}

        </div>
      </main>
    </div>
  );
}
