import React from "react";

const UserForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="px-4 py-3 bg-white rounded-lg shadow-md">
        {/* Username */}
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Username</span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </label>
        <br />

        {/* Email */}
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Email</span>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </label>
        <br />

        {/* Password */}
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </label>
        <br />

        {/* Phone Number */}
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Phone Number</span>
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </label>
        <br />

        {/* Role */}
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Role</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          >
            <option value="Select">Select</option>
            <option value="designer">Designer</option>
            <option value="expert">Expert</option>
            <option value="client">Client</option>
          </select>
        </label>
        <br />

        {/* Status */}
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          >
            <option value="internal_stakeholder">Internal Stakeholder</option>
            <option value="external_stakeholder">External Stakeholder</option>
          </select>
        </label>
        <br />

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
