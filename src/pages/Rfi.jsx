import React, { useState } from "react";
import Header from "../components/Header";
import { FiFilter } from "react-icons/fi";
import { MdSort } from "react-icons/md";

export default function Rfi() {
  const [selectedTab, setSelectedTab] = useState("Pending"); // Default to Pending tab

  const [data, setData] = useState([
    {
      raisedOnDate: "21-02-2023",
      projectName: "Enclave IT Park",
      detail: "Door Design",
      status: "Pending",
      priority: "Low",
      actionRequired: "Review Completed",
      pendingFrom: "19 Days",
    },
    {
      raisedOnDate: "25-06-2023",
      projectName: "The Enclave",
      detail: "Building Blueprint",
      status: "Resolved",
      priority: "High",
      actionRequired: "Approval Needed",
      pendingFrom: "10 Days",
    },
    {
      raisedOnDate: "30-07-2023",
      projectName: "Enclave Residences Q1",
      detail: "Interior Design",
      status: "Pending",
      priority: "Medium",
      actionRequired: "Rework Required",
      pendingFrom: "18 Days",
    },
    {
      raisedOnDate: "10-08-2023",
      projectName: "Enclave Residences Q2",
      detail: "Exterior Design",
      status: "Resolved",
      priority: "Low",
      actionRequired: "Review Completed",
      pendingFrom: "11 Days",
    },
  ]);

  // Function to filter data based on selected tab
  const filteredData = data.filter((item) => item.status === selectedTab);

  const handleResolveClick = (item) => {
    if (item.status === "Pending") {
      // Change status to Resolved and move it to the Resolved tab
      setData((prevData) =>
        prevData.map((d) =>
          d.projectName === item.projectName ? { ...d, status: "Resolved" } : d
        )
      );
      setSelectedTab("Pending"); // Keep the Pending tab active
    }
  };

  return (
    <div className="bg-gray-100 mx-8">
      {/* <Header /> */}
      <main className="h-full overflow-y-auto">
        <div className="container px-6 my-6 grid">
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <h2 className="px-4 py-2 text-blue-700 font-bold transition">
                    RFI
                  </h2>
                  {["Pending", "Resolved"].map((tab) => (
                    <span
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition ${
                        selectedTab === tab
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {tab}
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

              <div className="overflow-hidden rounded-lg shadow bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold text-gray-600 uppercase bg-gray-100 border-b">
                      <th className="px-4 py-3">Raised on Date</th>
                      <th className="px-4 py-3">Project name</th>
                      <th className="px-4 py-3">Detail</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Pending From</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {filteredData.map((item) => (
                      <tr
                        key={item.projectName}
                        className="text-gray-700 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{item.raisedOnDate}</td>
                        <td className="px-4 py-3">{item.projectName}</td>
                        <td className="px-4 py-3">{item.detail}</td>
                        <td className="px-4 py-3">{item.priority}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded-full ${
                              item.status === "Resolved"
                                ? "text-green-700 bg-green-100"
                                : "text-orange-700 bg-orange-100"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleResolveClick(item)}
                            className={`text-sm font-medium rounded-md px-5 py-1.5 ${
                              item.status === "Resolved"
                                ? "text-green-900 bg-green-100 border border-green-300 hover:bg-green-200"
                                : "text-gray-900 bg-orange-100 border border-orange-300 hover:bg-orange-200"
                            }`}
                          >
                            {item.status === "Resolved" ? "View" : "Resolve"}
                          </button>
                        </td>
                        <td className="px-4 py-3">{item.pendingFrom}</td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-4 text-gray-500"
                        >
                          No {selectedTab} RFIs available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
