import React, { useState } from "react";
import { FileText, Upload, X, AlertCircle, Send, Star } from "lucide-react";

// Mock AdminRoleDropdown component for demonstration
const AdminRoleDropdown = ({ role, label, value, onSelect, width }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mockUsers = [
    { id: 1, name: "John Smith", email: "john@company.com" },
    { id: 2, name: "Sarah Johnson", email: "sarah@company.com" },
    { id: 3, name: "Mike Davis", email: "mike@company.com" },
  ];

  return (
    <div className={`relative ${width}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200"
        >
          <span className="block truncate text-gray-700">
            {value
              ? mockUsers.find((u) => u.id === value)?.name
              : "Select recipient..."}
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  onSelect(user);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-indigo-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CreateRFIForm({
  formData = {
    title: "",
    details: "",
    send_to: "",
    priority: "",
    documents: [],
  },
  setFormData = () => {},
  users = [],
  userID = 1,
  selectedProjectId = 1,
  onClose = () => {},
  onSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  },
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files);
    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setFormData((prev) => ({
      ...prev,
      documents: newFiles,
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    const iconClass = "w-4 h-4";
    switch (priority) {
      case "High":
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case "Medium":
        return <Star className={`${iconClass} text-yellow-500`} />;
      case "Low":
        return <Star className={`${iconClass} text-green-500`} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New RFI
                </h1>
                <p className="text-sm text-gray-500">Request for Information</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-lg border-x border-b border-gray-200">
          <div className="px-8 py-8 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  RFI Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title for your RFI..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Priority Level *
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${getPriorityColor(
                      formData.priority
                    )}`}
                    required
                  >
                    <option value="">Select priority level...</option>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                    {getPriorityIcon(formData.priority)}
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Detailed Description *
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Provide detailed information about what you're requesting..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 resize-vertical"
                required
              />
            </div>

            {/* Recipient */}
            <AdminRoleDropdown
              role={["client"]}
              label="Send To *"
              value={formData.send_to}
              onSelect={(selectedUser) =>
                setFormData((prev) => ({
                  ...prev,
                  send_to: selectedUser?.id || "",
                }))
              }
              width="w-full"
            />

            {/* File Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Attachments
              </label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Support for multiple file types (PDF, DOC, IMG, etc.)
                </p>
                <input
                  type="file"
                  name="documents"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Attached Files:
                  </p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hidden Fields */}
            <input type="hidden" name="status" value="Pending" />
            <input type="hidden" name="created_by" value={userID} />
            <input type="hidden" name="project_id" value={selectedProjectId} />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => onSubmit(e)}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit RFI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
