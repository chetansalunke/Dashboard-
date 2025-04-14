import React, { useState, useEffect } from "react";
import BASE_URL from "../../config.js";

import RfiTable from "../../components/RFI /RfiTable";

import RfiControls from "../../components/RFI /RfiControls";
import RFIResolveForm from "../../components/RFI /RFIResolveForm";
import ProjectDropdown from "../../components/RFI /ProjectDropdown.jsx";
import CreateRFIForm from "../../components/RFI /CreateRFIForm.jsx";

export default function ClientRFI() {
  const [rfis, setRfis] = useState([]);
  const [filteredRfis, setFilteredRfis] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [resolvingRfi, setResolvingRfi] = useState(null);

  const storedUser = localStorage.getItem("user");
  const userID = storedUser ? JSON.parse(storedUser)?.id : null;

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    send_to: "",
    priority: "",
    documents: [],
  });

  const [projectList, setProjectList] = useState([]);

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
  }, [activeTab, rfis, searchText]);

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

  const filterRfisByTabAndSearch = () => {
    let filtered = [...rfis];
    if (activeTab === "Pending") {
      filtered = filtered.filter((rfi) => rfi.status === "Pending");
    } else if (activeTab === "Resolved") {
      filtered = filtered.filter((rfi) => rfi.status === "Resolved");
    }

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (rfi) =>
          rfi.title.toLowerCase().includes(lowerSearch) ||
          rfi.details.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredRfis(filtered);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullForm = new FormData();
    fullForm.append("title", formData.title);
    fullForm.append("details", formData.details);
    fullForm.append("send_to", formData.send_to);
    fullForm.append("priority", formData.priority);
    fullForm.append("status", "Pending");
    fullForm.append("created_by", userID);
    fullForm.append("project_id", selectedProjectId);

    formData.documents.forEach((file) => {
      fullForm.append("documents", file);
    });

    try {
      const response = await fetch(`${BASE_URL}/api/createRfi`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fullForm,
      });

      if (!response.ok) throw new Error("Failed to create RFI");

      // Reset form state
      setFormData({
        title: "",
        details: "",
        send_to: "",
        priority: "",
        documents: [],
      });

      // Optionally reset file input if using a ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowForm(false);
      fetchRfis(selectedProjectId);
    } catch (error) {
      console.error("Error creating RFI:", error);
    }
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
          <div className="flex justify-between mb-4">
            {!showForm && !resolvingRfi && (
              <ProjectDropdown
                projectList={projectList}
                selectedProjectId={selectedProjectId}
                onChange={(selectedId) => setSelectedProjectId(selectedId)}
              />
            )}

            {selectedProjectId && !showForm && !resolvingRfi && (
              <RfiControls
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onSearchChange={setSearchText}
                onCreateClick={() => setShowForm(true)}
              />
            )}
          </div>

          {selectedProjectId && showForm && (
            <CreateRFIForm
              formData={formData}
              setFormData={setFormData}
              users={users}
              userID={userID}
              selectedProjectId={selectedProjectId}
              onClose={() => setShowForm(false)}
              onSubmit={handleSubmit}
            />
          )}

          {resolvingRfi && (
            <RFIResolveForm
              rfi={resolvingRfi}
              users={users}
              token={token}
              onCancel={() => setResolvingRfi(null)}
              onSuccess={() => {
                setResolvingRfi(null);
                fetchRfis(selectedProjectId);
              }}
            />
          )}

          {!showForm && !resolvingRfi && (
            <RfiTable
              rfis={selectedProjectId ? filteredRfis : []}
              users={users}
              userID={userID}
              onResolve={(rfi) => setResolvingRfi(rfi)}
            />
          )}
          {!selectedProjectId && (
            <p className="text-center text-gray-500 mt-4">
              Please select a project.
            </p>
          )}
          {selectedProjectId && !loading && filteredRfis.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No RFIs found for this project.
            </p>
          )}
          {selectedProjectId && loading && (
            <p className="text-center text-gray-500 mt-4">Loading RFIs...</p>
          )}
        </div>
      </main>
    </div>
  );
}
