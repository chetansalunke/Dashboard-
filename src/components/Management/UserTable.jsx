import React from "react";

const UserTable = ({ users, handleDelete }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {users.map((user, index) => (
              <tr key={index} className="text-gray-700">
                <td className="px-4 py-3 text-sm">{user.username}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm">{user.role}</td>
                <td className="p-3 flex space-x-2">
                  {/* Uncomment to enable editing */}
                  {/* <button
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
