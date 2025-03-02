import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

export default function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Select",
  });

  const [users, setUsers] = useState([]);

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/all");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission to add a new user
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add user");

      const newUser = await response.json(); // Get the newly added user

      setUsers((prevUsers) => [...prevUsers, newUser]); // Add without refresh

      // Reset form state & close form
      setFormData({ username: "", email: "", password: "", role: "Select" });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     let imageUrl = formData.profilePicture;

  //     if (formData.profilePicture && typeof formData.profilePicture !== "string") {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         imageUrl = reader.result;
  //         saveUser(imageUrl);
  //       };
  //       reader.readAsDataURL(formData.profilePicture);
  //     } else {
  //       saveUser(imageUrl);
  //     }
  //   };

  //   // Save user to local storage
  //   const saveUser = (imageUrl) => {
  //     const newUser = { ...formData, profilePicture: imageUrl };
  //     const updatedUsers = [...users, newUser];

  //     setUsers(updatedUsers);
  //     localStorage.setItem("users", JSON.stringify(updatedUsers));

  //     // Clear form
  //     setFormData({
  //       fullName: "",
  //       email: "",
  //       role: "Select",
  //       phone: "",
  //       profilePicture: null,
  //     });
  //     setIsFormOpen(false);
  //   };

  // Handle user deletion
  const handleDelete = async (index) => {};

  // Handle edit (mock function for now)
  const handleEdit = (index) => {};

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <h1 className="text-xl font-semibold tracking-wide text-left text-gray-700 uppercase">
            Users
          </h1>
          <br />
          <div
            className={`flex ${isFormOpen ? "justify-between" : "justify-end"}`}
          >
            {isFormOpen && (
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  role: "Select",
                }); // Reset form
              }}
              className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              New User
            </button>
          </div>
          <br />
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="px-4 py-3 bg-white rounded-lg shadow-md">
                <label className="block text-sm">
                  <span className="text-gray-700">Username</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm form-input"
                    required
                  />
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700">Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm form-input"
                    required
                  />
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700">Password</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm form-input"
                    required
                  />
                </label>
                <br />
                <label className="block text-sm">
                  <span className="text-gray-700">Role</span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm form-input"
                  >
                    <option value="Select">Select</option>
                    <option value="designer">Designer</option>
                    <option value="expert">Expert</option>
                    <option value="client">Client</option>
                  </select>
                </label>
                <br />
                <div className="flex justify-center">
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
          {!isFormOpen && (
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
          )}
        </div>
      </main>
    </div>
  );
}
