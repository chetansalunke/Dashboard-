import React, { useEffect, useState } from "react";
import BASE_URL from "../../config";
import axios from "axios";

const TeamsDesignerDropdown = ({
  selectedProject,
  label = "Select Designer Team",
  width = "w-1/4",
  onSelect,
  value,
  onEmpty,
  onNotEmpty,
}) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(value || "");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (selectedProject?.id) {
          const response = await axios.get(
            `${BASE_URL}/api/projects/${selectedProject.id}/teams`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            }
          );

          const designerTeams = response.data.filter(
            (team) => team.role === "designer"
          );
          setTeams(designerTeams);

          // ✅ Notify parent if no designers
          if (designerTeams.length === 0 && typeof onEmpty === "function") {
            onEmpty();
          } else if (
            designerTeams.length > 0 &&
            typeof onNotEmpty === "function"
          ) {
            onNotEmpty();
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [selectedProject]);

  useEffect(() => {
    setSelectedTeamId(value || "");
  }, [value]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedTeamId(selectedId);
    const selectedTeam = teams.find((t) => t.id === parseInt(selectedId));
    onSelect(selectedTeam || null);
  };

  return (
    <div className={`${width}`}>
      <span className="text-gray-700 font-semibold">{label}</span>
      <select
        value={selectedTeamId}
        onChange={handleChange}
        className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full mt-1"
      >
        <option value="">-- Select Designer Team --</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.username} ({team.role})
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamsDesignerDropdown;
