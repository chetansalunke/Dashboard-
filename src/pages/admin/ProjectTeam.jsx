import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import RoleDropdown from "./RoleDropdown";
import axios from "axios";
import { UserPlus, Users, RefreshCw, AlertCircle } from "lucide-react";

export default function ProjectTeam({ selectedProject }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const token = localStorage.getItem("accessToken");

  const fetchTeamMembers = async () => {
    if (!selectedProject?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/projects/${selectedProject.id}/teams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [selectedProject, token]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleAddTeamMember = async () => {
    if (!selectedUser) {
      setError("Please select a user to add to the team.");
      return;
    }

    setIsLoading(true);
    setError(null);

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

      setTeamMembers((prev) => [...prev, response.data]);
      fetchTeamMembers();
      setSelectedUser(null);
      setDropdownKey((prev) => prev + 1);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error adding team member:", error);
      setError("Failed to add team member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Users className="text-purple-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">Project Team</h2>
        </div>
        <button
          onClick={fetchTeamMembers}
          className="flex items-center text-sm text-purple-600 hover:text-purple-800"
        >
          <RefreshCw size={16} className="mr-1" />
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading team data...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-4 my-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}

      {showSuccessMessage && (
        <div className="mx-4 my-2 p-2 bg-green-50 border border-green-200 text-green-600 rounded-md">
          Team member added successfully!
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">Member Name</th>
              <th className="px-4 py-3">Email ID</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, idx) => (
                <tr key={idx} className="text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {member.username}
                  </td>
                  <td className="px-4 py-3 text-sm">{member.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-600"
                          : member.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No team members found for this project.
                </td>
              </tr>
            )}

            {/* New Team Member Input Row */}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="px-4 py-3 text-sm">
                <RoleDropdown
                  key={dropdownKey}
                  role={["designer", "expert", "consultant"]}
                  label=""
                  width=""
                  onSelect={handleUserSelect}
                />
              </td>
              <td className="px-4 py-3 text-sm">
                {selectedUser?.email || "—"}
              </td>
              <td className="px-4 py-3 text-sm">
                {selectedUser?.role ? (
                  <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                    {selectedUser.role}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                {selectedUser?.status ? (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedUser.status === "active"
                        ? "bg-green-100 text-green-600"
                        : selectedUser.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"}
        </span>
        <button
          onClick={handleAddTeamMember}
          disabled={isLoading || !selectedUser}
          className={`px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md flex items-center ${
            isLoading || !selectedUser
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-700"
          }`}
        >
          <UserPlus size={16} className="mr-2" />
          Add Team Member
        </button>
      </div>
    </div>
  );
}
