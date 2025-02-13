import React, { useState, useRef } from "react";
import Header from "../components/Header";
import { FaCloudUploadAlt, FaPaperPlane } from "react-icons/fa";
import { FiFilter, FiDownload } from "react-icons/fi";
import { MdSort } from "react-icons/md";

export default function Sent() {
  const [files, setFiles] = useState([
    {
      image: "https://via.placeholder.com/150",
      projectName: "Enclave IT Park",
      name: "Site plan remarks",
      submissionDate: "12-09-2024",
      sentBy: "Client A",
      priority: "High",
      type: "PDF",
      status: "Approved",
      downloadUrl: "#",
    },
    {
      image: "https://via.placeholder.com/150",
      projectName: "Enclave IT Park",
      name: "Reference plan",
      submissionDate: "10-08-2024",
      sentBy: "Client A",
      priority: "Medium",
      type: "CAD",
      status: "Pending",
      downloadUrl: "#",
    },
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    setShowUpload(!showUpload);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-gray-100 mx-8">
      <Header />
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="bg-white shadow-md p-6 rounded-lg">
              {showUpload ? (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto border border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Enclave IT Park
                  </h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                    onClick={handleClick}
                  >
                    <FaCloudUploadAlt className="text-purple-500 text-6xl animate-pulse" />
                    <p className="mt-3 text-gray-600 text-lg font-medium">
                      {selectedFile
                        ? selectedFile.name
                        : "Drag & Drop Files or Click to Upload"}
                    </p>
                  </div>
                  <div className="mt-6">
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="Write a comment..."
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transform hover:scale-105 hover:bg-gray-600 transition duration-300"
                      onClick={handleUploadClick}
                    >
                      Cancel
                    </button>
                    <button className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transform hover:scale-105 hover:bg-purple-600 transition duration-300">
                      <FaPaperPlane className="text-lg" />
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Enclave IT Park</h2>
                    <input
                      type="text"
                      placeholder="Search drawings"
                      className="border p-2 w-64 rounded"
                    />
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-2">
                      {[
                        "All",
                        "Architecture",
                        "Interior",
                        "Structural",
                        "MEP",
                        "Others",
                      ].map((category, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-lg cursor-pointer text-gray-700 font-medium transition bg-gray-200 hover:bg-gray-400"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <button className="flex items-center px-3 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300">
                        <MdSort className="mr-2" /> Sort
                      </button>
                      <button className="flex items-center px-3 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300">
                        <FiFilter className="mr-2" /> Filter
                      </button>
                      <button
                        onClick={handleUploadClick}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-purple-600 transition"
                      >
                        <FaCloudUploadAlt className="mr-2" /> Upload File
                      </button>
                    </div>
                  </div>
                  <table className="w-full whitespace-nowrap overflow-x-auto mt-6 border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                        <th className="px-4 py-3">Preview</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Sent Date</th>
                        <th className="px-4 py-3">Sent By</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                      {files.map((file, index) => (
                        <tr
                          key={index}
                          className="text-gray-700 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <img
                              className="w-12 h-12 object-cover rounded"
                              src={file.image}
                              alt={file.projectName}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">{file.name}</td>
                          <td className="px-4 py-3 text-sm">{file.type}</td>
                          <td className="px-4 py-3 text-sm">
                            {file.submissionDate}
                          </td>
                          <td className="px-4 py-3 text-sm">{file.sentBy}</td>
                          <td className="px-4 py-3 text-sm">{file.priority}</td>
                          <td className="px-4 py-3 text-xs">{file.status}</td>
                          <td className="px-4 py-3">
                            <FiDownload className="text-purple-600 cursor-pointer" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
