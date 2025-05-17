import React, { useEffect, useState } from "react";
import BASE_URL from "../../config";
import axios from "axios";

const RoleDropdown = ({
  role = [],
  label = "Select User",
  width = "w-1/4",
  onSelect,
  value,
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(value || "");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const roles = Array.isArray(role) ? role : [role];

        const allResponses = await Promise.all(
          roles.map((r) => axios.get(`${BASE_URL}/api/auth/role?role=${r}`))
        );

        const mergedUsers = allResponses.flatMap((res) => res.data.users);
        setUsers(mergedUsers);
      } catch (error) {
        console.error(`Error fetching roles:`, error);
      }
    };

    fetchUsers();
  }, [role]);

  useEffect(() => {
    setSelectedUserId(value || "");
  }, [value]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedUserId(selectedId);
    const selectedUser = users.find((u) => u.id === parseInt(selectedId));
    onSelect(selectedUser || null);
  };

  return (
    <div className={`${width}`}>
      <span className="text-gray-700 font-semibold">{label}</span>
      <select
        value={selectedUserId}
        onChange={handleChange}
        className="text-sm border border-gray-300 rounded-lg px-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
      >
        <option value="">-- Select --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.role})
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(RoleDropdown);
