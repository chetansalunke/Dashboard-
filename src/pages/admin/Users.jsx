import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import BASE_URL from "../../config";

export default function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "Select",
    status: "internal_stakeholder",
  });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/all`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => { 
    fetchUsers();
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add user");

      const newUser = await response.json();
      setUsers((prev) => [...prev, newUser.user || newUser]);
      fetchUsers();

      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        role: "Select",
        status: "internal_stakeholder",
      });

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDelete = async (index) => {
    const userId = users[index]._id;
    try {
      const response = await fetch(`${BASE_URL}/api/auth/delete/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold tracking-wide text-left text-gray-500 uppercase">
              Welcome, Manage & Track Your Users
            </h1>

            <div className="flex justify-end gap-2">
              {isFormOpen ? (
                <>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600"
                  >
                    Back
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsFormOpen(true);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                      phone_number: "",
                      role: "Select",
                      status: "internal_stakeholder",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  New User
                </button>
              )}
            </div>
          </div>
          <br />
          {isFormOpen ? (
            <UserForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          ) : (
            <UserTable users={users} handleDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}
