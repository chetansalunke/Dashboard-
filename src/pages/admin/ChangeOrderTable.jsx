import React, { useState } from "react";
import { FileText, Calendar, User, CheckCircle } from "lucide-react";

const changeOrders = [
  {
    id: 1,
    title: "Interior Layout Revision",
    description: "Changed the design of the interior layout.",
    dateRequested: "2024-03-10",
    dateApproved: "2024-03-15",
    component: "Interior",
    createdBy: "Architect A",
    assignedTo: "Engineer X",
    communication: "Email",
    fullDescription: "Interior layout revised to improve space utilization.",
    details:
      "The revised layout enhances natural lighting and creates better movement paths within the structure. This change was made after structural review.",
  },
  {
    id: 2,
    title: "Electrical Configuration Update",
    description: "Modified electrical system configuration.",
    dateRequested: "2024-04-01",
    dateApproved: "2024-04-05",
    component: "Electrical",
    createdBy: "Engineer B",
    assignedTo: "Contractor Y",
    communication: "Phone",
    fullDescription: "Update to electrical layout to meet safety codes.",
    details:
      "Electrical routing was modified to comply with updated code requirements. Circuit load balancing was improved.",
  },
  {
    id: 3,
    title: "HVAC Upgrade",
    description: "Upgraded HVAC system for better efficiency.",
    dateRequested: "2024-04-12",
    dateApproved: "2024-04-18",
    component: "HVAC",
    createdBy: "Consultant C",
    assignedTo: "Technician Z",
    communication: "Email",
    fullDescription: "HVAC system updated to energy-efficient model.",
    details:
      "The upgrade includes high-efficiency units and duct rerouting for better airflow. Structural changes required rerouting near beams.",
  },
    {
    id: 4,
    title: "APP Upgrade",
    description: "Upgraded HVAC system for better efficiency.",
    dateRequested: "2024-10-12",
    dateApproved: "2024-04-18",
    component: "HVAC",
    createdBy: "Consultant C",
    assignedTo: "Technician Z",
    communication: "Email",
    fullDescription: "HVAC system updated to energy-efficient model.",
    details:
      "The upgrade includes high-efficiency units and duct rerouting for better airflow. Structural changes required rerouting near beams.",
  },
];

export default function ChangeOrderTable({ rfis, users, onOpen, sortOption }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpen = (order) => setSelectedOrder(order);
  const handleBack = () => setSelectedOrder(null);

  let sortedChangeOrders = [...changeOrders];
  if (sortOption === "a-z") {
    sortedChangeOrders.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "date") {
    sortedChangeOrders.sort(
      (a, b) => new Date(b.dateRequested) - new Date(a.dateRequested)
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
      {!selectedOrder ? (
        <>
          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-purple-600" />
                      Change Details
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-purple-600" />
                      Requested
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-purple-600" />
                      Approved
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {sortedChangeOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {order.title}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs">
                          {order.description}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.dateRequested}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <CheckCircle
                          size={14}
                          className="text-green-500 mr-1"
                        />
                        {order.dateApproved}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-1 rounded-full">
                        {order.component}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          handleOpen(order);
                          onOpen(rfis);
                        }}
                        className="bg-purple-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <div>Total Change Orders: {changeOrders.length}</div>
              <div className="text-right">Last Updated: June 2025</div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-10 ">
          <h6 className="text-4xl font-bold text-indigo-800 mb-8 flex items-center gap-2">
            <FileText className="text-indigo-600" size={28} /> Change Order #
            {selectedOrder.id}
          </h6>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 text-sm">
            <div>
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Change Title
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedOrder.title}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Component
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedOrder.component}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Date Requested
              </div>
              <div>{selectedOrder.dateRequested}</div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Date Approved
              </div>
              <div>{selectedOrder.dateApproved}</div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Communication
              </div>
              <div>{selectedOrder.communication}</div>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Created By
              </div>
              <div>{selectedOrder.createdBy}</div>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Description of Change
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800">
                {selectedOrder.fullDescription}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs uppercase font-bold text-gray-500 mb-1">
                Details of Change
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800">
                {selectedOrder.details}
              </div>
            </div>
          </div>

          {/* Upload File */}
          <div className="mt-10">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Supporting File
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:border-0 file:rounded-md file:bg-indigo-100 file:text-indigo-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={() => {
                handleBack(); // This resets selectedOrder
                onOpen(null); // This tells parent to show dropdown + controls again
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              ← Back to All Orders
            </button>

            <div className="space-x-3">
              <button className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2 rounded-lg font-semibold">
                Reject
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold">
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
