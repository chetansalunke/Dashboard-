import React from "react";
import { Trash2, AlertCircle } from "lucide-react";

const UserTable = ({ users, handleDelete }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl shadow-lg">
      <div className="w-full overflow-x-auto">
        {users.length > 0 ? (
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="text-gray-700 hover:bg-purple-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wider 
                      {user.role === 'designer' ? 'bg-blue-100 text-blue-800' : 
                       user.role === 'expert' ? 'bg-green-100 text-green-800' : 
                       'bg-purple-100 text-purple-800'}"
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wider ${
                        user.status === "internal_stakeholder"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status === "internal_stakeholder"
                        ? "Internal"
                        : "External"}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(index)}
                      className="flex items-center px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-150 ease-in-out shadow-sm"
                    >
                      <Trash2 size={12} className="mr-1" />
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white">
            <AlertCircle size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-gray-400 text-sm">
              Add a new user to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
