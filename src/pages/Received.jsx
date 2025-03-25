import React, { useState } from "react";
import Header from "../components/Header";
import { FiFilter } from "react-icons/fi";
import { MdSort } from "react-icons/md";

export default function Received() {
  const [files, setFiles] = useState([
    {
      image: "https://via.placeholder.com/150",
      name: "Proposed site plan",
      version: "R2",
      discipline: "Architectural",
      updated: "29-05-2024",
      status: "Approved",
      sentBy: "Siddharth Nahta",
      previousVersions: "R1, R0",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Ground floor plan",
      version: "R1",
      discipline: "Architectural",
      updated: "30-06-2024",
      status: "Approved",
      sentBy: "Siddharth Nahta",
      previousVersions: "R0",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "First floor plan",
      version: "R1",
      discipline: "Architectural",
      updated: "15-06-2024",
      status: "On Hold",
      sentBy: "Siddharth Nahta",
      previousVersions: "R0",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Typical floor plan",
      version: "R1",
      discipline: "Architectural",
      updated: "15-06-2024",
      status: "Approved",
      sentBy: "Siddharth Nahta",
      previousVersions: "R0",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Terrace plan",
      version: "R0",
      discipline: "Architectural",
      updated: "05-07-2024",
      status: "Under Review",
      sentBy: "Siddharth Nahta",
      previousVersions: "",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Roof Plan",
      version: "R1",
      discipline: "Architectural",
      updated: "10-07-2024",
      status: "Approved",
      sentBy: "John Doe",
      previousVersions: "R0",
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Basement Plan",
      version: "R2",
      discipline: "Structural",
      updated: "12-07-2024",
      status: "Pending",
      sentBy: "Jane Smith",
      previousVersions: "R1, R0",
    },
  ]);

  return (
    <div className="bg-gray-100 mx-8">
      {/* <Header /> */}
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="bg-white shadow-md p-6 rounded-lg">
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
                </div>
              </div>
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b light:border-gray-700 bg-gray-50 light:text-gray-400 light:bg-gray-800">
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Submission Date</th>
                    <th className="px-4 py-3">Sent by</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Document</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {files.map((file, index) => (
                    <tr
                      key={index}
                      className="text-gray-700 light:text-gray-400"
                    >
                      <td className="px-4 py-3 flex-1 w-32">
                        <div className="flex items-center text-sm">
                          <img
                            className="object-cover w-8 h-8 mr-3 rounded-full"
                            src={file.image}
                            alt="Project"
                            loading="lazy"
                          />
                          <p className="font-semibold">{file.projectName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{file.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {file.submissionDate}
                      </td>
                      <td className="px-4 py-3 text-sm">{file.sentBy}</td>
                      <td className="px-4 py-3 text-sm">{file.priority}</td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                            file.status === "Approved"
                              ? "text-green-700 bg-green-100"
                              : "text-orange-700 bg-orange-100"
                          }`}
                        >
                          {file.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDownloadClick(file.downloadUrl)}
                          className="px-3 py-1 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                        >
                          Download
                        </button>
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


