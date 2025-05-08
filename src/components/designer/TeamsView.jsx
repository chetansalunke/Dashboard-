import React, { useState, useEffect } from "react";
import BASE_URL from "../../config";
import axios from "axios";
import { UserPlus, Users, RefreshCw, AlertCircle } from "lucide-react";

export default function TeamsView({ selectedProject }) {
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
