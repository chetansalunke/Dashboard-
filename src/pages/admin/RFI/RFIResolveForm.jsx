// RFIResolveForm.js - Enhanced version
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

export default function RFIResolveForm({
  rfi,
  users,
  token,
  onCancel,
  onSuccess,
}) {
  const [solutionText, setSolutionText] = useState("");
  const [solutionFiles, setSolutionFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientRemark, setClientRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const handleResolveSubmit = async () => {
    if (!solutionText.trim()) {
      setErrorMsg("Please provide a solution before resolving.");
      return;
    }

    setIsResolving(true);
    const formData = new FormData();
    formData.append("resolution_details", solutionText);
    formData.append("resolved_by", rfi.send_to);
    formData.append("status", "Resolved");

    solutionFiles.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await fetch(`${BASE_URL}/api/resolveRfi/${rfi.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to resolve RFI");
      }

      setSolutionText("");
      setSolutionFiles([]);
      setErrorMsg(null);
      setSuccessMsg("🎉 RFI resolved successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
      onSuccess();
    } catch (error) {
      console.error("Error resolving RFI:", error);
      setErrorMsg("Failed to resolve RFI. Please try again.");
    } finally {
      setIsResolving(false);
    }
  };

  const handleSendToClientClick = () => {
    setShowClientForm(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClientSubmit = async () => {
    if (!selectedClient) {
      setErrorMsg("Please select a client.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const requestBody = {
      rfiId: rfi.id,
      clientId: selectedClient.id,
      remark: clientRemark.trim() || "",
      status: "Sent to Client",
    };

    try {
      const response = await fetch(`${BASE_URL}/api/sendToClient`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = "Failed to send to client.";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setClientRemark("");
      setSelectedClient(null);
      setShowClientForm(false);
      setErrorMsg(null);
      setSuccessMsg(
        `✅ RFI successfully sent to ${selectedClient.name || "client"}!`
      );
      setTimeout(() => setSuccessMsg(null), 4000);
      onSuccess();
    } catch (error) {
      console.error("Error sending to client:", error);
      setErrorMsg(
        error.message || "Failed to send to client. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "Sent to Client":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/20 rounded-full">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">RFI Details</h1>
            <p className="text-purple-100">Request for Information</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-800 font-medium">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-800 font-medium">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(
              rfi.status || "Pending"
            )}`}
          >
            {rfi.status === "Resolved" && (
              <CheckCircle size={18} className="mr-2" />
            )}
            {rfi.status === "Sent to Client" && (
              <Send size={18} className="mr-2" />
            )}
            {(!rfi.status || rfi.status === "Pending") && (
              <Clock size={18} className="mr-2" />
            )}
            {rfi.status || "Pending"}
          </div>
        </div>

        {/* RFI Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <p className="text-gray-900 font-medium">
                {rfi.title || "No title provided"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  rfi.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : rfi.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {rfi.priority || "Not specified"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Details
              </label>
              <p className="text-gray-900">
                {rfi.details || "No details provided"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assigned To
              </label>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-purple-600" />
                <span className="text-gray-900 font-medium">
                  {users[rfi.send_to] || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Created: {new Date(rfi.created_at).toLocaleDateString("en-GB")}{" "}
                at{" "}
                {new Date(rfi.created_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            {rfi.resolved_at && (
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} className="text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  Resolved:{" "}
                  {new Date(rfi.resolved_at).toLocaleDateString("en-GB")} at{" "}
                  {new Date(rfi.resolved_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold text-purple-900 mb-4">
            Resolution Details
          </h2>

          {rfi.resolution_details || rfi.resolved_at ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-2">
                  Solution
                </label>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <p className="text-gray-900">
                    {rfi.resolution_details || "No solution provided"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-2">
                  Supporting Documents
                </label>
                {rfi.resolution_documents ? (
                  <div className="space-y-2">
                    {rfi.resolution_documents.split(",").map((doc, i) => (
                      <a
                        key={i}
                        href={`${BASE_URL}/uploads/${doc.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors"
                        download
                      >
                        <FileText size={18} className="text-purple-600" />
                        <span className="text-purple-700 font-medium">
                          {decodeURIComponent(doc.trim().split("/").pop())}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic bg-white p-4 rounded-lg border border-purple-200">
                    No supporting documents
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-2">
                  Solution *
                </label>
                <textarea
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  rows={4}
                  className="w-full p-4 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Describe the solution or resolution details..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-2">
                  Upload Supporting Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setSolutionFiles(Array.from(e.target.files))}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
                {solutionFiles.length > 0 && (
                  <div className="mt-2 text-sm text-purple-700">
                    {solutionFiles.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Client Information (if sent to client) */}
        {rfi.status === "Sent to Client" && rfi.client_remark && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Client Information
            </h3>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                Remark to Client
              </label>
              <p className="text-gray-900">{rfi.client_remark}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!rfi.resolution_details &&
          !rfi.resolved_at &&
          rfi.status !== "Sent to Client" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResolveSubmit}
                disabled={isResolving || !solutionText.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle size={20} />
                  <span>
                    {isResolving ? "Resolving..." : "Mark as Resolved"}
                  </span>
                </div>
              </button>

              <button
                onClick={handleSendToClientClick}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Send size={20} />
                  <span>Send to Client</span>
                </div>
              </button>
            </div>
          )}
      </div>

      {/* Client Modal */}
      {showClientForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Send RFI to Client</h3>
                    <p className="text-blue-100">
                      Forward this RFI for client review
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClientForm(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Select Client <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <RoleDropdown
                    users={users}
                    onSelect={(user) => setSelectedClient(user)}
                    role="client"
                    label=""
                    width="w-full"
                    value={selectedClient?.id}
                  />
                </div>
                {selectedClient && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        Selected:{" "}
                        {selectedClient.name || `Client ${selectedClient.id}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Message to Client
                </label>
                <textarea
                  rows={4}
                  value={clientRemark}
                  onChange={(e) => setClientRemark(e.target.value)}
                  placeholder="Add a message or instructions for the client (optional)"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowClientForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClientSubmit}
                  disabled={isSubmitting || !selectedClient}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send size={18} />
                      <span>Send to Client</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
