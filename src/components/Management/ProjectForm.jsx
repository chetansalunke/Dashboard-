import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import RoleDropdown from "./RoleDropdown";

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
      console.log("✅ Project uploaded:", res.data);

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
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="px-4 py-3 mt-8 bg-white rounded-lg shadow-md">
        <label className="block text-sm">
          <span className="text-gray-700 font-semibold">Project Name:</span>
          <input
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            className="block w-1/2 mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            placeholder="Enter Project Name"
            required
          />
        </label>

        <label className="block mt-4 text-sm">
          <span className="text-gray-700 font-semibold">Site Address:</span>
          <textarea
            name="siteaddress"
            value={formData.siteaddress}
            onChange={handleInputChange}
            className="block w-1/2 mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            rows="3"
            placeholder="Enter address."
            required
          ></textarea>
        </label>

        <label className="block mt-4 text-sm">
          <span className="text-gray-700 font-semibold">
            Project Description:
          </span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            rows="6"
            placeholder="Enter project details."
            required
          ></textarea>
        </label>

        <label className="block w-1/6 mt-4 text-sm">
          <span className="text-gray-700 font-semibold">Project Size:</span>
          <input
            name="projectsize"
            value={formData.projectsize}
            onChange={handleInputChange}
            type="text"
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <label className="block w-1/6 mt-4 text-sm">
          <span className="text-gray-700 font-semibold">Project Timeline:</span>
          <input
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            type="text"
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <label className="block w-1/6 mt-4 text-sm">
          <span className="text-gray-700 font-semibold">
            Project Start Date:
          </span>
          <input
            name="startdate"
            value={formData.startdate}
            onChange={handleInputChange}
            type="date"
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <label className="block w-1/6 mt-4 text-sm">
          <span className="text-gray-700 font-semibold">
            Project Completion Date:
          </span>
          <input
            name="completiondate"
            value={formData.completiondate}
            onChange={handleInputChange}
            type="date"
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <label className="block w-1/6 mt-4 text-sm">
          <span className="text-gray-700 font-semibold">Project ID</span>
          <input
            name="projectid"
            value={formData.projectid}
            onChange={handleInputChange}
            type="text"
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            required
          />
        </label>

        <label className="block mt-4 text-sm">
          <span className="text-gray-700 font-semibold">Add Attachments</span>
          <input
            name="documents"
            type="file"
            multiple
            onChange={handleInputChange}
            className="block w-full mt-1 text-sm"
          />
        </label>

        {formData.documents.length > 0 && (
          <ul className="mt-3 space-y-1">
            {formData.documents.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2 bg-gray-200 rounded-md"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(i)}
                  className="text-red-500 text-xs font-bold"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        <h1 className="mt-10 text-xl font-semibold tracking-wide text-gray-500 uppercase">
          Client
        </h1>
        <hr className="mt-2 mb-4 border-gray-400" />

        <div className="flex gap-4 justify-between">
          <RoleDropdown
            role="client"
            label="Client"
            width="w-1/3"
            onSelect={handleClientSelect}
            value={formData.clientId}
          />
          <div className="w-1/4 ">
            <span className="text-gray-700 font-semibold">Email</span>
            <input
              name="email"
              type="text"
              value={clientInfo.email}
              readOnly
              className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            />
          </div>
        </div>
        <div className="w-1/4 mt-4">
          <span className="text-gray-700 font-semibold">Phone Number</span>
          <input
            name="phone_number"
            type="text"
            value={clientInfo.phone_number}
            readOnly
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </div>

        <h1 className="mt-10 text-xl font-semibold tracking-wide text-gray-500 uppercase">
          Consultant
        </h1>
        <hr className="mt-2 mb-4 border-gray-400" />

        <div className="flex gap-4 justify-between">
          <RoleDropdown
            role="consultant"
            label="Consultant"
            width="w-1/3"
            onSelect={handleConsultantSelect}
            value={formData.consultantId}
          />
          <div className="w-1/4 ">
            <span className="text-gray-700 font-semibold">Email</span>
            <input
              name="email"
              type="text"
              value={consultantInfo.email}
              readOnly
              className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            />
          </div>
        </div>
        <div className="w-1/4 mt-4">
          <span className="text-gray-700 font-semibold">Phone Number</span>
          <input
            name="phone_number"
            type="text"
            value={consultantInfo.phone_number}
            readOnly
            className="block w-full mt-1 text-sm rounded-lg border border-gray-400 bg-transparent focus:border-purple-600 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          {selectedProject && (
            <button
              onClick={() => {}}
              className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg border border-transparent hover:border-black transition"
            >
              Edit
            </button>
          )}
          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
