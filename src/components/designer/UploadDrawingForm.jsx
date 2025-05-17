import React, { useState, useMemo, useEffect } from "react";
import { Upload, Check, FileImage, Loader2, X } from "lucide-react";
import RoleDropdown from "../../../src/pages/admin/RoleDropdown";

// UI Components
const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    {children}
  </div>
);

const FormGroup = ({ children }) => <div className="mb-4">{children}</div>;

const FormLabel = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const FormInput = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border ${
      error ? "border-red-300" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
  />
);

const FormSelect = ({ error, children, ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2 border ${
      error ? "border-red-300" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white`}
  >
    {children}
  </select>
);

const FormTextarea = ({ error, ...props }) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 border ${
      error ? "border-red-300" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
  />
);

const ErrorMessage = ({ children }) => (
  <p className="mt-1 text-sm text-red-600">{children}</p>
);

export default function UploadDrawingForm({
  selectedProject,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: "",
    discipline: "",
    remark: "",
    sent_by: "",
    sent_to: "",
  });

  const roles = useMemo(() => ["expert", "admin"], []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleUserSelect = (user) => {
    console.log(user);
    setSelectedUser(user);
    setFormData((prev) => ({ ...prev, sent_to: user || "" }));

    if (errors.sent_to) {
      setErrors((prev) => ({ ...prev, sent_to: null }));
    }
  };

  const disciplines = [
    "Architecture",
    "Structural",
    "Mechanical",
    "Electrical",
    "Plumbing",
    "Civil",
    "Other",
  ];

  useEffect(() => {
    // Get logged in user info from localStorage
    try {
      const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
      if (userInfo && userInfo.id) {
        setFormData((prev) => ({ ...prev, sent_by: userInfo.id }));
      }
    } catch (error) {
      console.error("Error retrieving user info:", error);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Drawing name is required";
    if (!formData.discipline) newErrors.discipline = "Discipline is required";
    if (!formData.sent_by) newErrors.sent_by = "Sender information is required";
    if (!formData.sent_to) newErrors.sent_to = "Recipient is required";
    if (!selectedFile) newErrors.file = "Please select a drawing file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (errors.file) {
        setErrors({ ...errors, file: null });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      if (errors.file) {
        setErrors({ ...errors, file: null });
      }
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    try {
      // Create FormData to send including file
      const payload = new FormData();
      payload.append("project_id", selectedProject.id);
      payload.append("name", formData.name);
      payload.append("discipline", formData.discipline);
      payload.append("remark", formData.remark);
      payload.append("sent_by", formData.sent_by);
      payload.append("sent_to", formData.sent_to?.id || formData.sent_to);

      payload.append("design_documents", selectedFile);

      // ✅ Print FormData contents to console
      console.log("Uploading the following FormData:");
      for (const [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }

      // Send the FormData to your API via onSubmit
      await onSubmit(payload); // Assuming onSubmit handles FormData correctly

      clearInterval(progressInterval);
      setUploadProgress(100);
      setShowSuccess(true);

      // Reset form
      setTimeout(() => {
        setFormData({
          name: "",
          discipline: "",
          remark: "",
          sent_by: formData.sent_by,
          sent_to: "",
        });
        setSelectedFile(null);
        setShowSuccess(false);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      clearInterval(progressInterval);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecipientChange = (value) => {
    setFormData({ ...formData, sent_to: value });
    if (errors.sent_to) {
      setErrors({ ...errors, sent_to: null });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Progress indicator */}
          {isSubmitting && (
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium text-blue-700">
                  Uploading drawing...
                </span>
                <span className="text-blue-700">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start mb-4">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Drawing uploaded successfully!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Your drawing has been uploaded and shared with the selected
                  recipient.
                </p>
              </div>
            </div>
          )}

          {/* Main form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drawing Name */}
            <FormGroup>
              <FormLabel htmlFor="name" required>
                Drawing Name
              </FormLabel>
              <div className="relative">
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter drawing name"
                  error={errors.name}
                  disabled={isSubmitting} 
                />
                {formData.name && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Check size={18} className="text-green-500" />
                  </span>
                )}
              </div>
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            {/* Discipline */}
            <FormGroup>
              <FormLabel htmlFor="discipline" required>
                Discipline
              </FormLabel>
              <div className="relative">
                <FormSelect
                  id="discipline"
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  error={errors.discipline}
                  disabled={isSubmitting}
                >
                  <option value="">Select discipline</option>
                  {disciplines.map((discipline) => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </FormSelect>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.discipline && (
                <ErrorMessage>{errors.discipline}</ErrorMessage>
              )}
            </FormGroup>
          </div>

          {/* Remark */}
          <FormGroup>
            <FormLabel htmlFor="remark">Remarks</FormLabel>
            <FormTextarea
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="4"
              placeholder="Add any relevant notes or comments about this drawing"
              disabled={isSubmitting}
            />
          </FormGroup>

          {/* Drawing File Upload */}
          <div
            className={`border-2 border-dashed ${
              errors.file ? "border-red-300" : "border-gray-300"
            } rounded-lg p-6 text-center ${selectedFile ? "bg-blue-50" : ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="flex flex-col items-center">
                <FileImage size={40} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop drawing files here, or
                </p>
                <label className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
                    disabled={isSubmitting}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Supported formats: PDF, DWG, DXF, JPG, PNG (Max 20MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <FileImage size={24} className="text-blue-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800 truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFileRemove}
                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                  disabled={isSubmitting}
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            )}
            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sent To */}
            <FormGroup>
              <FormLabel htmlFor="sent_to" required>
                Send To
              </FormLabel>
              <RoleDropdown
                role={roles}
                label=""
                width="w-1/3"
                onSelect={handleUserSelect}
                value={selectedUser?.id}
              />
              {errors.sent_to && <ErrorMessage>{errors.sent_to}</ErrorMessage>}
            </FormGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload Drawing
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
