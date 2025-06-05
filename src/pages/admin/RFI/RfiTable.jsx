import { Eye } from "lucide-react"; // RfiTable.js - Enhanced version
import React, { useState } from "react";
import BASE_URL from "../../../config";
import RoleDropdown from "../../admin/RoleDropdown";
import {
  X,
  CheckCircle,
  Send,
  FileText,
  User,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function RfiTable({ rfis, users, userID, onResolve }) {
  const calculateDaysPending = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "Resolved":
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300`;
      case "Sent to Client":
        return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300`;
      case "Pending":
      default:
        return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    switch (priority?.toLowerCase()) {
      case "high":
        return `${baseClasses} bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300`;
      case "medium":
        return `${baseClasses} bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300`;
      case "low":
        return `${baseClasses} bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300`;
      default:
        return `${baseClasses} bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300`;
    }
  };

  const getActionButton = (rfi) => {
    if (rfi.status === "Pending" && rfi.send_to === userID) {
      return (
        <button
          onClick={() => onResolve(rfi)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <CheckCircle size={16} className="mr-2" />
          Resolve
        </button>
      );
    } else if (rfi.status === "Resolved") {
      return (
        <button
          onClick={() => onResolve(rfi)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Eye size={16} className="mr-2" />
          View Details
        </button>
      );
    } else if (rfi.status === "Sent to Client") {
      return (
        <div className="space-y-2">
          <button
            onClick={() => onResolve(rfi)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Eye size={16} className="mr-2" />
            View Details
          </button>
          <div className="text-xs text-gray-500 text-center">
            Awaiting client response
          </div>
        </div>
      );
    } else {
      return (
        <span className="text-sm text-gray-400 italic">
          No action available
        </span>
      );
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FileText size={16} className="mr-2 text-purple-600" />
                  RFI Details
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-purple-600" />
                  Date Created
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-purple-600" />
                  Assigned To
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          {rfis.length > 0 ? (
            <tbody className="bg-white divide-y divide-gray-200">
              {rfis.map((rfi, index) => {
                const daysPending = calculateDaysPending(rfi.created_at);
                const isOverdue = daysPending > 7 && rfi.status === "Pending";

                return (
                  <tr
                    key={rfi.id}
                    className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 ${
                      isOverdue
                        ? "bg-gradient-to-r from-red-50 to-pink-50"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-25"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {rfi.title || "No Title"}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs mb-2">
                          {rfi.details || "No details provided"}
                        </div>
                        {rfi.priority && (
                          <div>
                            <span className={getPriorityBadge(rfi.priority)}>
                              {rfi.priority}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={getStatusBadge(rfi.status)}>
                          {rfi.status === "Resolved" && (
                            <CheckCircle size={14} className="mr-1" />
                          )}

                          {rfi.status === "Sent to Client" && (
                            <Send size={14} className="mr-1" />
                          )}
                          {(!rfi.status || rfi.status === "Pending") && (
                            <Clock size={14} className="mr-1" />
                          )}
                          {rfi.status || "Pending"}
                        </span>
                        {isOverdue && (
                          <div className="flex items-center mt-1">
                            <AlertTriangle
                              size={12}
                              className="text-red-500 mr-1"
                            />
                            <span className="text-xs text-red-600 font-medium">
                              Overdue ({daysPending} days)
                            </span>
                          </div>
                        )}
                        {rfi.status === "Pending" && !isOverdue && (
                          <div className="text-xs text-gray-500 mt-1">
                            {daysPending} days pending
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(rfi.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(rfi.created_at).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <User size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {users[rfi.send_to] || "Unassigned"}
                          </div>
                          <div className="text-xs text-gray-500">
                            User ID: {rfi.send_to}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {rfi.documents ? (
                        <div className="space-y-1">
                          {rfi.documents
                            .split(",")
                            .slice(0, 2)
                            .map((doc, i) => (
                              <a
                                key={i}
                                href={`${BASE_URL}/uploads/${doc.trim()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors truncate max-w-32"
                                download
                              >
                                <FileText
                                  size={12}
                                  className="mr-1 flex-shrink-0"
                                />
                                {decodeURIComponent(
                                  doc.trim().split("/").pop()
                                )}
                              </a>
                            ))}
                          {rfi.documents.split(",").length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{rfi.documents.split(",").length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No documents
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                          <User size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {users[rfi.created_by] || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">Creator</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">{getActionButton(rfi)}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FileText size={48} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No RFIs Found
                      </h3>
                      <p className="text-gray-500">
                        There are currently no Request for Information items to
                        display.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Summary Footer */}
      {rfis.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-gray-700">
                  Pending:{" "}
                  {
                    rfis.filter(
                      (rfi) => !rfi.status || rfi.status === "Pending"
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-700">
                  Resolved:{" "}
                  {rfis.filter((rfi) => rfi.status === "Resolved").length}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-gray-700">
                  Sent to Client:{" "}
                  {rfis.filter((rfi) => rfi.status === "Sent to Client").length}
                </span>
              </div>
            </div>
            <div className="text-gray-600">Total RFIs: {rfis.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
