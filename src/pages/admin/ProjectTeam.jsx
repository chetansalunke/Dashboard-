import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import RoleDropdown from "./RoleDropdown";
import axios from "axios";

export default function ProjectTeam({ selectedProject }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownKey, setDropdownKey] = useState(0); // 🔑 key for forcing RoleDropdown re-render

  const token = localStorage.getItem("accessToken");

  // 🔄 Fetch team members when selectedProject changes
  const fetchTeamMembers = async () => {
    if (!selectedProject?.id) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/projects/${selectedProject.id}/teams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeamMembers(response.data); // Assuming API returns an array
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };


  useEffect(() => {
    fetchTeamMembers();
  }, [selectedProject, token]);  // Only trigger when selectedProject or token changes
  

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleAddTeamMember = async () => {
    if (!selectedUser) {
      alert("Please select a user to add to the team.");
      return;
    }

    const formattedStatus = selectedUser.status
      ? selectedUser.status.replace(/_/g, " ")
      : "";

    try {
      const response = await axios.post(
        `${BASE_URL}/api/projects/createTeam`,
        {
          projectId: selectedProject.id,
          userId: selectedUser.id,
          email: selectedUser.email,
          designation: selectedUser.role,
          status: formattedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update team members with newly added one
      setTeamMembers((prev) => [...prev, response.data]);

      // ✅ Re-fetch complete team from backend
      fetchTeamMembers();

      // ✅ Properly clear selection
      setSelectedUser(null);

      // 🔄 Reset the dropdown by updating its key
      setDropdownKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Member name</th>
                  <th className="px-4 py-3">Email ID</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {teamMembers.map((member, idx) => (
                  <tr key={idx} className="text-gray-700">
                    <td className="px-4 py-3 text-sm">{member.username}</td>
                    <td className="px-4 py-3 text-sm">{member.email}</td>
                    <td className="px-4 py-3 text-sm">{member.role}</td>
                    <td className="px-4 py-3 text-sm">{member.status}</td>
                  </tr>
                ))}

                {/* New Team Member Input Row */}
                <tr className="bg-gray-50 text-sm">
                  <td className="px-4 py-2 text-sm">
                    <RoleDropdown
                      key={dropdownKey} // 👈 Force re-render to clear previous selection
                      role={["designer", "expert", "consultant"]}
                      label=""
                      width=""
                      onSelect={handleUserSelect}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {selectedUser?.email || "—"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {selectedUser?.role || "—"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {selectedUser?.status || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-100">
            <button
              onClick={handleAddTeamMember}
              className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
