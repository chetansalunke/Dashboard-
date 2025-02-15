import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

export default function Users() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Select",
    phone: "",
    profilePicture: null,
  });

  const [users, setUsers] = useState([]);

  // Load stored users when the component mounts
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleDownloadClick = (url) => {
    window.open(url, "_blank");
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Store image as a base64 string
    let imageUrl = "";
    if (formData.profilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrl = reader.result;
        saveUser(imageUrl);
      };
      reader.readAsDataURL(formData.profilePicture);
    } else {
      saveUser(imageUrl);
    }
  };

  // Save user to local storage
  const saveUser = (imageUrl) => {
    const newUser = { ...formData, profilePicture: imageUrl };
    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Clear form
    setFormData({
      fullName: "",
      email: "",
      role: "Select",
      phone: "",
      profilePicture: null,
    });
    setIsFormOpen(false);
  };

  return (
    <div className="bg-gray-100 ">
      <Header />
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="flex justify-end">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              New User
            </button>
          </div>

          <br />
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md">
                {/* Full Name */}
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Full Name
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    required
                    fdprocessedid="lalert"
                  />
                </label>
                <br />

                {/* Email Address */}
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                    required
                  />
                </label>
                <br />

                {/* Role Selection */}
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Role
                  </span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                  >
                    <option value="Select">Select</option>
                    <option value="Designer">Designer</option>
                    <option value="Expert">Expert</option>
                    <option value="Client">Client</option>
                  </select>
                </label>
                <br />

                {/* Phone Number (Optional) */}
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Mobile Number
                  </span>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                  />
                </label>
                <br />

                {/* Profile Picture Upload */}
                <label className="block text-sm">
                  <span className="text-gray-700 light:text-gray-400">
                    Profile Pic
                  </span>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
                  />
                </label>
                <br />

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <th className="px-4 py-3">Profile Picture</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Phone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {users.map((user, index) => (
                    <tr key={index} className="text-gray-700">
                      <td className="px-4 py-3 text-sm">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{user.fullName}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.role}</td>
                      <td className="px-4 py-3 text-sm">
                        {user.phone || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
