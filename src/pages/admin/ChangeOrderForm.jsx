import React, { useState } from "react";

export default function ChangeOrderForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateRequested: "",
    dateApproved: "",
    component: "",
    createdBy: "",
    assignedTo: "",
    communication: "",
    fullDescription: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-2xl rounded-3xl p-10 w-full mx-auto border border-gray-200 transition-all duration-300"
    >
      <h2 className="text-2xl font-extrabold text-purple-700 mb-6 tracking-wide text-center">
        ✨ Create Change Order
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "title", label: "Title" },
          { name: "description", label: "Short Description" },
          { name: "dateRequested", label: "Date Requested", type: "date" },
          { name: "dateApproved", label: "Date Approved", type: "date" },
          { name: "component", label: "Component" },
          { name: "createdBy", label: "Created By" },
          { name: "assignedTo", label: "Assigned To" },
          { name: "communication", label: "Communication Method" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name} className="relative">
            <label className="absolute left-3 -top-2.5 bg-white text-xs font-medium px-1 text-purple-600">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="mt-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-2 text-sm shadow-sm placeholder-gray-400 transition-all"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-purple-600 mb-1">
          Full Description
        </label>
        <textarea
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          rows={3}
          required
          className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-2 text-sm shadow-sm transition-all"
          placeholder="Describe in detail..."
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-purple-600 mb-1">
          Details
        </label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows={4}
          required
          className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-2 text-sm shadow-sm transition-all"
          placeholder="Add more technical or specific details..."
        />
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-xl text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition-all duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
