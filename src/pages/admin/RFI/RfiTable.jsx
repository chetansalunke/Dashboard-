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
  Upload,
  CheckSquare,
} from "lucide-react";

export default function RfiTable({ rfis, users, userID, onResolve }) {
  const calculateDaysPending = (createdAt, sentToClientAt = null, status) => {
    let startDate;

    // If sent to client, calculate from sent date, otherwise from created date
    if (status === "Sent to Client" && sentToClientAt) {
      startDate = new Date(sentToClientAt);
    } else {
      startDate = new Date(createdAt);
    }

    const now = new Date();
    const diffTime = Math.abs(now - startDate);
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
      case "Client Resolved":
        return `${baseClasses} bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300`;
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
    } else if (rfi.status === "Resolved" || rfi.status === "Client Resolved") {
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
          <div className="text-xs text-blue-600 text-center font-medium">
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

  const getPendingMessage = (rfi) => {
    const daysPending = calculateDaysPending(
      rfi.created_at,
      rfi.sent_to_client_at,
      rfi.status
    );
    const isOverdue = daysPending > 7;

    if (rfi.status === "Sent to Client") {
      return {
        message: rfi.sent_to_client_at
          ? `${daysPending} days with client`
          : `${daysPending} days pending`,
        isOverdue: isOverdue,
        daysPending: daysPending,
      };
    } else if (rfi.status === "Pending") {
      return {
        message: `${daysPending} days pending`,
        isOverdue: isOverdue,
        daysPending: daysPending,
      };
    }

    return { message: null, isOverdue: false, daysPending: 0 };
  };

  // Enhanced function to render all document types
  const renderDocuments = (rfi) => {
    const documentSections = [];

    // Initial Documents (document_upload)
    if (rfi.document_upload) {
      const docs = rfi.document_upload.split(",").filter((doc) => doc.trim());
      if (docs.length > 0) {
        documentSections.push({
          title: "Initial Documents",
          documents: docs,
          icon: Upload,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        });
      }
    }

    // Regular Documents (documents)
    if (rfi.documents) {
      const docs = rfi.documents.split(",").filter((doc) => doc.trim());
      if (docs.length > 0) {
        documentSections.push({
          title: "Attachments",
          documents: docs,
          icon: FileText,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        });
      }
    }

    // Resolution Documents (resolution_documents)
    if (rfi.resolution_documents) {
      const docs = rfi.resolution_documents
        .split(",")
        .filter((doc) => doc.trim());
      if (docs.length > 0) {
        documentSections.push({
          title: "Resolution Documents",
          documents: docs,
          icon: CheckSquare,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        });
      }
    }

    if (documentSections.length === 0) {
      return <span className="text-xs text-gray-400 italic">No documents</span>;
    }

    return (
      <div className="space-y-3 max-w-xs">
        {documentSections.map((section, sectionIndex) => {
          const IconComponent = section.icon;
          return (
            <div
              key={sectionIndex}
              className={`p-2 rounded-lg ${section.bgColor} border ${section.borderColor}`}
            >
              <div className="flex items-center mb-1">
                <IconComponent size={12} className={`mr-1 ${section.color}`} />
                <span className={`text-xs font-medium ${section.color}`}>
                  {section.title}
                </span>
                <span className="ml-1 text-xs text-gray-500">
                  ({section.documents.length})
                </span>
              </div>
              <div className="space-y-1">
                {section.documents.slice(0, 2).map((doc, docIndex) => (
                  <a
                    key={docIndex}
                    href={
                      doc.includes("rfi/")
                        ? `${BASE_URL}/rfi/${doc.split("rfi/")[1]}`
                        : `${BASE_URL}/uploads/${doc.trim()}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center text-xs hover:underline transition-colors truncate ${section.color} hover:opacity-80`}
                    download
                    title={decodeURIComponent(doc.trim().split("/").pop())}
                  >
                    <FileText size={10} className="mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {decodeURIComponent(doc.trim().split("/").pop())}
                    </span>
                  </a>
                ))}
                {section.documents.length > 2 && (
                  <div className={`text-xs ${section.color} font-medium`}>
                    +{section.documents.length - 2} more files
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-64">
                <div className="flex items-center">
                  <FileText size={16} className="mr-2 text-purple-600" />
                  All Documents
                </div>
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
                const pendingInfo = getPendingMessage(rfi);
                const isOverdue = pendingInfo.isOverdue;

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
                          {(rfi.status === "Resolved" ||
                            rfi.status === "Client Resolved") && (
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

                        {/* Show overdue warning */}
                        {isOverdue && (
                          <div className="flex items-center mt-1">
                            <AlertTriangle
                              size={12}
                              className="text-red-500 mr-1"
                            />
                            <span className="text-xs text-red-600 font-medium">
                              Overdue ({pendingInfo.daysPending} days)
                            </span>
                          </div>
                        )}

                        {/* Show pending message */}
                        {pendingInfo.message && !isOverdue && (
                          <div
                            className={`text-xs mt-1 ${
                              rfi.status === "Sent to Client"
                                ? "text-blue-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {pendingInfo.message}
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
                          {/* <div className="text-xs text-gray-500">
                            User ID: {rfi.send_to}
                          </div> */}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">{renderDocuments(rfi)}</td>

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
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                <span className="text-gray-700">
                  Client Resolved:{" "}
                  {
                    rfis.filter((rfi) => rfi.status === "Client Resolved")
                      .length
                  }
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
