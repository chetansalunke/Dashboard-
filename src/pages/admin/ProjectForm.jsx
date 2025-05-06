import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import RoleDropdown from "./RoleDropdown";
import {
  FiPaperclip,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiClock,
  FiFlag,
  FiHash,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

export default function ProjectForm({ setIsFormOpen, selectedProject, users }) {
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    projectName: "",
    siteaddress: "",
    description: "",
    projectsize: "",
    timeline: "",
    startdate: "",
    completiondate: "",
    projectid: "",
    documents: [],
    userId: "",
    clientId: null,
    consultantId: null,
  });

  const [clientInfo, setClientInfo] = useState({
    email: "",
    phone_number: "",
    username: "",
  });
  const [consultantInfo, setConsultantInfo] = useState({
    email: "",
    phone_number: "",
    username: "",
  });

  useEffect(() => {
    if (selectedProject) {
      const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "";

      setFormData((prev) => ({
        ...prev,
        projectName: selectedProject.projectName || "",
        siteaddress: selectedProject.site_address || "",
        description: selectedProject.description || "",
        projectsize: selectedProject.projectSize || "",
        timeline: selectedProject.duration || "",
        startdate: formatDate(selectedProject.project_start_date),
        completiondate: formatDate(selectedProject.project_completion_date),
        projectid: selectedProject.project_id || "",
        clientId: selectedProject.client_id || null,
        consultantId: selectedProject.consultant_id || null,
        documents: [],
      }));

      if (users && users.length > 0) {
        const client = users.find((u) => u.id === selectedProject.client_id);
        const consultant = users.find(
          (u) => u.id === selectedProject.consultant_id
        );

        if (client) {
          setClientInfo({
            email: client.email,
            phone_number: client.phone_number,
            username: client.username,
          });
        }
        if (consultant) {
          setConsultantInfo({
            email: consultant.email,
            phone_number: consultant.phone_number,
            username: consultant.username,
          });
        }
      }
    }
  }, [selectedProject, users]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      setFormData((prev) => ({ ...prev, userId: user.id }));
    }
  }, []);

  const handleClientSelect = (user) => {
    if (user) {
      setClientInfo({
        email: user.email,
        phone_number: user.phone_number,
        username: user.username,
      });
      setFormData((prev) => ({ ...prev, clientId: user.id }));
    } else {
      setClientInfo({ email: "", phone_number: "", username: "" });
      setFormData((prev) => ({ ...prev, clientId: null }));
    }
  };

  const handleConsultantSelect = (user) => {
    if (user) {
      setConsultantInfo({
        email: user.email,
        phone_number: user.phone_number,
        username: user.username,
      });
      setFormData((prev) => ({ ...prev, consultantId: user.id }));
    } else {
      setConsultantInfo({ email: "", phone_number: "", username: "" });
      setFormData((prev) => ({ ...prev, consultantId: null }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const fileList = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileList],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("projectName", formData.projectName);
    form.append("site_address", formData.siteaddress);
    form.append("description", formData.description);
    form.append("duration", formData.timeline);
    form.append("startDate", formData.startdate);
    form.append("completionDate", formData.completiondate);
    form.append("projectSize", formData.projectsize);
    form.append("userId", formData.userId);
    form.append("projectId", formData.projectid);
    form.append("clientId", formData.clientId);
    form.append("consultantId", formData.consultantId);

    formData.documents.forEach((file) => {
      form.append("documents", file);
    });

    try {
      const res = await axios.post(`${BASE_URL}/api/projects/add`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Project uploaded successfully!");
      console.log(" Project uploaded:", res.data);

      setFormData({
        projectName: "",
        siteaddress: "",
        description: "",
        projectsize: "",
        timeline: "",
        startdate: "",
        completiondate: "",
        projectid: "",
        documents: [],
        userId: formData.userId,
        clientId: null,
        consultantId: null,
      });

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error uploading project:", error);
      alert("Failed to upload project. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          Project Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiFlag className="mr-2 text-purple-600" /> Project Name
              </span>
              <input
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                placeholder="Enter Project Name"
                required
              />
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiMapPin className="mr-2 text-purple-600" /> Site Address
              </span>
              <textarea
                name="siteaddress"
                value={formData.siteaddress}
                onChange={handleInputChange}
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                rows="3"
                placeholder="Enter address"
                required
              ></textarea>
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiFileText className="mr-2 text-purple-600" /> Project
                Description
              </span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                rows="6"
                placeholder="Enter project details"
                required
              ></textarea>
            </label>
          </div>

          <div>
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiHash className="mr-2 text-purple-600" /> Project ID
              </span>
              <input
                name="projectid"
                value={formData.projectid}
                onChange={handleInputChange}
                type="text"
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiClock className="mr-2 text-purple-600" /> Project Size
              </span>
              <input
                name="projectsize"
                value={formData.projectsize}
                onChange={handleInputChange}
                type="text"
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiClock className="mr-2 text-purple-600" /> Project Timeline
              </span>
              <input
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                type="text"
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiCalendar className="mr-2 text-purple-600" /> Start Date
              </span>
              <input
                name="startdate"
                value={formData.startdate}
                onChange={handleInputChange}
                type="date"
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                <FiCalendar className="mr-2 text-purple-600" /> Completion Date
              </span>
              <input
                name="completiondate"
                value={formData.completiondate}
                onChange={handleInputChange}
                type="date"
                className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-transparent focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 px-3 py-2 shadow-sm"
                required
              />
            </label>
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-sm">
            <span className="text-gray-700 font-semibold flex items-center">
              <FiPaperclip className="mr-2 text-purple-600" /> Add Attachments
            </span>
            <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-400 transition-colors">
              <input
                name="documents"
                type="file"
                multiple
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <FiPaperclip className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to add files
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  or drag and drop
                </span>
              </label>
            </div>
          </label>
        </div>

        {formData.documents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Attached Files
            </h3>
            <ul className="space-y-2">
              {formData.documents.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center">
                    <FiFileText className="text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
            <FiUser className="mr-2" /> Client Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <RoleDropdown
                role="client"
                label="Client"
                width="w-full"
                onSelect={handleClientSelect}
                value={formData.clientId}
                className="shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 font-semibold flex items-center">
                  <FiMail className="mr-2 text-purple-600" /> Email
                </span>
                <input
                  name="email"
                  type="text"
                  value={clientInfo.email}
                  readOnly
                  className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none px-3 py-2"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 font-semibold flex items-center">
                  <FiPhone className="mr-2 text-purple-600" /> Phone Number
                </span>
                <input
                  name="phone_number"
                  type="text"
                  value={clientInfo.phone_number}
                  readOnly
                  className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none px-3 py-2"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
            <FiUser className="mr-2" /> Consultant Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <RoleDropdown
                role="consultant"
                label="Consultant"
                width="w-full"
                onSelect={handleConsultantSelect}
                value={formData.consultantId}
                className="shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 font-semibold flex items-center">
                  <FiMail className="mr-2 text-purple-600" /> Email
                </span>
                <input
                  name="email"
                  type="text"
                  value={consultantInfo.email}
                  readOnly
                  className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none px-3 py-2"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 font-semibold flex items-center">
                  <FiPhone className="mr-2 text-purple-600" /> Phone Number
                </span>
                <input
                  name="phone_number"
                  type="text"
                  value={consultantInfo.phone_number}
                  readOnly
                  className="block w-full mt-1 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none px-3 py-2"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          {selectedProject && (
            <button
              type="button"
              onClick={() => {}}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              Edit
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
