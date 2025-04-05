import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../config";
import Projects from "../admin/Projects";

export default function RFI() {
  const [rfis, setRfis] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [activeTab, setActiveTab] = useState("");
  const [filteredRfis, setFilteredRfis] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const location = useLocation();
  const projectId = location?.state?.projectId || null;
  const projectName = location?.state?.projectName || "RFI";

  const storedUser = localStorage.getItem("user");
  const userID = storedUser ? JSON.parse(storedUser)?.id : null;
  // console.log(userID);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    status: "Pending",
    send_to: "",
    documents: [],
    project_id: "",
    priority: "",
    created_by: userID,
  });

  const [projectList, setProjectList] = useState([]);
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setProjectList(Array.isArray(data.projects) ? data.projects : []);
      // console.log("Projects:", data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);

      setProjectList([]);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    if (projectId) {
      setFormData((prev) => ({
        ...prev,
        project_id: projectId,
      }));
    }
  }, [projectId]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRfis();
    }
  }, [token, projectId]);

  useEffect(() => {
    filterRfisByTab();
  }, [activeTab, rfis]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await response.json();
      const usersArray = userData.users;

      if (!Array.isArray(usersArray)) {
        throw new Error("Invalid user list");
      }

      const userMap = {};
      usersArray.forEach((user) => {
        userMap[user.id] = user.username;
      });

      setUsers(userMap);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    }
  };

  const fetchRfis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/getAllRfi`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        await handleRefreshToken();
        return fetchRfis();
      }

      if (!response.ok) throw new Error("Failed to fetch RFIs");

      const data = await response.json();

      // Filter RFIs based on navigation
      const filteredRfis = projectId
        ? data.filter((rfi) => rfi.project_id === projectId) // From Projects page
        : data.filter((rfi) => rfi.send_to === userID); // Directly from Sidebar

      setRfis(filteredRfis);
      setFilteredRfis(filteredRfis);
    } catch (err) {
      console.error("Error fetching RFIs:", err);
      setError("Failed to load RFIs");
    } finally {
      setLoading(false);
    }
  };

  const filterRfisByTab = () => {
    if (activeTab === "Pending") {
      setFilteredRfis(rfis.filter((rfi) => rfi.status === "Pending"));
    } else if (activeTab === "Resolved") {
      setFilteredRfis(rfis.filter((rfi) => rfi.status === "Resolved"));
    } else {
      setFilteredRfis(rfis);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("send_to", formData.send_to);
    formDataToSend.append("created_by", formData.created_by);
    formDataToSend.append("project_id", formData.project_id);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("details", formData.details);

    formData.documents.forEach((file) => {
      formDataToSend.append("documents", file);
    });
    console.log(formData);
    try {
      const response = await fetch(`${BASE_URL}/api/createRfi`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      console.log(formData);
      if (!response.ok) throw new Error("Failed to create RFI");

      setShowForm(false);
      fetchRfis(); // Refresh list
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
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          {!showForm && (
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h5 className="text-2xl font-semibold text-gray-700">
                {projectId ? projectName : "RFI"}
              </h5>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex border border-purple-600 rounded-md overflow-hidden shadow-md">
                  <button
                    className={`px-4 py-2 font-medium transition-colors duration-150 ${
                      activeTab === "Pending"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setActiveTab("Pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`px-4 py-2 font-medium transition-colors duration-150 ${
                      activeTab === "Resolved"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setActiveTab("Resolved")}
                  >
                    Resolved
                  </button>
                </div>

                <div className="relative w-[280px]">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    className="w-full pl-10 pr-2 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </div>

                <button
                  className="px-4 py-2 text-white text-sm font-medium bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => setShowForm(true)}
                >
                  Create RFI
                </button>
              </div>
            </div>
          )}

          <hr className="border-t border-black mb-4" />

          {loading ? (
            <p className="text-center text-gray-500">Loading RFIs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : null}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">
                Create an RFI
              </h3>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <label className="block text-sm">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input mb-4"
                  required
                />

                <label className="block text-sm">Details:</label>
                <input
                  type="text"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input mb-4"
                  required
                />

                <label className="block text-sm">Project:</label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input mb-4"
                  disabled
                >
                  <option value={formData.project_id}>
                    {projectList.find(
                      (project) => project.id === formData.project_id
                    )?.projectName || "Loading project..."}
                  </option>
                </select>

                <label className="block text-sm">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input mb-4"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <label className="block text-sm">Send To:</label>
                <select
                  name="send_to"
                  value={formData.send_to}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input mb-4"
                  required
                >
                  <option value="">Select User</option>
                  {Object.entries(users).map(([id, username]) => (
                    <option key={id} value={id}>
                      {username}
                    </option>
                  ))}
                </select>

                <label className="block text-sm">Created By:</label>
                <select
                  name="created_by"
                  value={formData.created_by}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-input mb-4"
                  disabled
                >
                  <option value={userID}>{users[userID] ?? "You"}</option>
                </select>

                <label className="block text-sm">Priority:</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="block w-full mt-1 text-sm form-select mb-4"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 text-sm font-semibold">
                    Upload Documents
                  </span>
                  <input
                    name="documents"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}

          {!showForm && (
            <div className="w-full overflow-hidden rounded-lg shadow">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                      <th className="px-4 py-3">RFI</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date Requested</th>
                      <th className="px-4 py-3">Sent To</th>
                      <th className="px-4 py-3">Document</th>
                      <th className="px-4 py-3">Created By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {filteredRfis.length > 0 ? (
                      filteredRfis.map((rfi) => (
                        <tr key={rfi.id} className="text-gray-700">
                          <td className="px-4 py-3 text-sm">
                            {rfi.title ?? "No Title"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {rfi.status ?? "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(rfi.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {users[rfi.send_to] ?? "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {rfi.document_upload ? (
                              <a
                                href={rfi.document_upload}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                Document
                              </a>
                            ) : (
                              "No file"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {users[rfi.created_by] ?? "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-3 text-sm text-center"
                        >
                          No RFIs available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
