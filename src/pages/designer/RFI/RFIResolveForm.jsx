import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  X,
  Upload,
  User,
  Calendar,
  Send,
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

  const handleResolveSubmit = async () => {
    // Simulate API call
    console.log("Resolving RFI with:", { solutionText, solutionFiles });
    setSuccessMsg("🎉 RFI resolved successfully!");
    setTimeout(() => setSuccessMsg(null), 4000);
    onSuccess();
  };

  const isResolved = rfi.resolution_details || rfi.resolved_at;

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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 text-white relative ${
            isResolved
              ? "bg-gradient-to-r from-green-600 to-green-800"
              : "bg-gradient-to-r from-purple-600 to-purple-800"
          }`}
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {isResolved ? "Resolved RFI" : "Resolve RFI"}
              </h1>
              <p
                className={`${
                  isResolved ? "text-green-100" : "text-purple-100"
                }`}
              >
                Request for Information
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
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
                {isResolved ? "Resolved" : rfi.status || "Pending"}
              </div>
            </div>

            {/* RFI Information Grid */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                RFI Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <p className="text-gray-900 font-medium">
                      {rfi.title || "No title provided"}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
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
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Details
                    </label>
                    <p className="text-gray-900">
                      {rfi.details || "No details provided"}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
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
            </div>

            {/* Date Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">
                    Created:{" "}
                    {new Date(rfi.created_at).toLocaleDateString("en-GB")} at{" "}
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

            {/* Resolution Section */}
            <div
              className={`rounded-xl p-6 mb-8 ${
                isResolved
                  ? "bg-gradient-to-br from-green-50 to-emerald-50"
                  : "bg-gradient-to-br from-purple-50 to-indigo-50"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  isResolved ? "text-green-900" : "text-purple-900"
                }`}
              >
                {isResolved ? "Resolution Details" : "Provide Resolution"}
              </h2>

              {isResolved ? (
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isResolved ? "text-green-800" : "text-purple-800"
                      }`}
                    >
                      Solution
                    </label>
                    <div
                      className={`bg-white p-4 rounded-lg border ${
                        isResolved ? "border-green-200" : "border-purple-200"
                      }`}
                    >
                      <p className="text-gray-900">
                        {rfi.resolution_details ||
                          "No resolution details provided"}
                      </p>
                    </div>
                  </div>

                  {rfi.resolution_documents && (
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          isResolved ? "text-green-800" : "text-purple-800"
                        }`}
                      >
                        Supporting Documents
                      </label>
                      <div className="space-y-2">
                        {rfi.resolution_documents.split(",").map((doc, i) => (
                          <a
                            key={i}
                            href="#"
                            className={`flex items-center space-x-2 p-3 bg-white rounded-lg border hover:border-opacity-60 transition-colors ${
                              isResolved
                                ? "border-green-200 hover:border-green-400"
                                : "border-purple-200 hover:border-purple-400"
                            }`}
                          >
                            <FileText
                              size={18}
                              className={
                                isResolved
                                  ? "text-green-600"
                                  : "text-purple-600"
                              }
                            />
                            <span
                              className={`font-medium ${
                                isResolved
                                  ? "text-green-700"
                                  : "text-purple-700"
                              }`}
                            >
                              {decodeURIComponent(doc.trim().split("/").pop())}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-right">
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-green-500 to-green-600">
                      <CheckCircle size={18} className="mr-2" />
                      Resolved on{" "}
                      {new Date(rfi.resolved_at).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Solution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      rows={4}
                      className="w-full p-4 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Describe the solution or response..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Upload Supporting Documents
                    </label>
                    <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors duration-200 bg-white">
                      <Upload className="mx-auto h-8 w-8 text-purple-400 mb-3" />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer">
                          Click to upload
                        </span>{" "}
                        supporting documents
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={(e) =>
                          setSolutionFiles(Array.from(e.target.files))
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {solutionFiles.length > 0 && (
                      <div className="mt-2 text-sm text-purple-700 font-medium">
                        {solutionFiles.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              {!isResolved && (
                <button
                  onClick={handleResolveSubmit}
                  disabled={!solutionText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <CheckCircle size={18} />
                  <span>Resolve RFI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
