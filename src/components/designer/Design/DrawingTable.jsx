import React, { useState, useEffect } from "react";
import {
  Download,
  Eye,
  MoreHorizontal,
  Upload,
  CheckCircle,
  X,
  FileDown,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import BASE_URL from "../../../config";
import VersionHistoryModal from "./VersionHistoryModal";

const DrawingTable = ({
  drawings,
  showActionDropdown,
  setShowActionDropdown,
  dropdownRef,
  fetchDrawings,
}) => {
  const [showPreview, setShowPreview] = useState(null);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [revisionComment, setRevisionComment] = useState("");
  const [revisionFile, setRevisionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch version history
  const fetchVersionHistory = async (drawingId) => {
    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/api/projects/drawings/${drawingId}/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.versions) {
        setVersionHistory(data.versions);
      }
    } catch (error) {
      console.error("Error fetching version history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Handle open history modal
  const handleHistoryModal = (drawing) => {
    setSelectedDrawing(drawing);
    setShowHistoryModal(true);
    fetchVersionHistory(drawing.drawing_id);
    setShowActionDropdown(null);
  };

  // Handle approve drawing
  const handleApprove = async (drawingId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${BASE_URL}/api/projects/drawing/${drawingId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDrawings(); // Refresh the drawings list
      setShowActionDropdown(null);
    } catch (error) {
      console.error("Error approving drawing:", error);
    }
  };

  // Handle download drawing
  const handleDownload = (path) => {
    window.open(`${BASE_URL}/${path}`, "_blank");
  };

  // Handle view drawing preview
  const handlePreview = (drawing) => {
    setShowPreview(drawing);
  };

  // Handle revision modal
  const handleRevisionModal = (drawing) => {
    setSelectedDrawing(drawing);
    setShowRevisionModal(true);
    setRevisionComment("");
    setRevisionFile(null);
    fetchVersionHistory(drawing.drawing_id); // Get the history when opening revision modal
    setShowActionDropdown(null);
  };

  // Submit revision
  const handleSubmitRevision = async () => {
    if (!revisionFile) {
      alert("Please upload a file");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("design_documents", revisionFile);
      formData.append("comment", revisionComment);
      // localstorage return string not object
      const user = JSON.parse(localStorage.getItem("user"));
      formData.append("uploaded_by", user?.id);

      await fetch(
        `${BASE_URL}/api/projects/drawings/${selectedDrawing.drawing_id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      setShowRevisionModal(false);
      setRevisionComment("");
      setRevisionFile(null);
      fetchDrawings(); // Refresh the drawings list
    } catch (error) {
      console.error("Error submitting revision:", error);
      alert("Failed to submit revision. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Sent to Expert":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Needs Revision":
      case "Revision Required by Expert":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if a drawing needs revision
  const needsRevision = (status) => {
    return (
      status === "Revision Required by Client" ||
      status === "Revision Required by Expert"
    );
  };

  // Find current version's comment from version history
  const getCurrentVersionComment = () => {
    if (!versionHistory || versionHistory.length === 0) return null;
    const currentVersion = versionHistory.find(
      (version) => version.is_latest === 1
    );
    return currentVersion?.comment || "";
  };

  return (
    <div className="w-full overflow-hidden shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Discipline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Updated By</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {drawings.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                  No drawings found
                </td>
              </tr>
            ) : (
              drawings.map((drawing) => (
                <tr
                  key={drawing.drawing_id}
                  className="text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div>
                        <p className="font-semibold">{drawing.drawing_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {drawing.discipline}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        drawing.status
                      )}`}
                    >
                      {drawing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(drawing.last_updated)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    v{drawing.latest_version_number}
                    {drawing.previous_version_number && (
                      <span className="text-xs text-gray-500">
                        {" "}
                        (prev: v{drawing.previous_version_number})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{drawing.sent_by_name}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handlePreview(drawing)}
                      className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                      title="Preview Drawing"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                  <td className="px-4 py-3 relative">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleDownload(drawing.latest_document_path)
                        }
                        className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
                        title="Download Drawing"
                      >
                        <Download size={18} />
                      </button>

                      {needsRevision(drawing.status) && (
                        <button
                          onClick={() => handleRevisionModal(drawing)}
                          className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center"
                        >
                          <CheckCircle size={14} className="mr-1" /> Resolve
                        </button>
                      )}

                      <button
                        onClick={() => handleHistoryModal(drawing)}
                        className="p-1 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100"
                        title="View Version History"
                      >
                        <Clock size={18} />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionDropdown(
                              showActionDropdown === drawing.drawing_id
                                ? null
                                : drawing.drawing_id
                            )
                          }
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {showActionDropdown === drawing.drawing_id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                          >
                            <button
                              onClick={() => handlePreview(drawing)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Eye size={16} className="mr-2" /> View Drawing
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(drawing.latest_document_path)
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Download size={16} className="mr-2" /> Download
                              Drawing
                            </button>
                            <button
                              onClick={() => handleHistoryModal(drawing)}
                              className="block w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-gray-100 flex items-center"
                            >
                              <Clock size={16} className="mr-2" /> View History
                            </button>
                            {drawing.status === "Sent to Expert" && (
                              <button
                                onClick={() =>
                                  handleApprove(drawing.drawing_id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100 flex items-center"
                              >
                                <CheckCircle size={16} className="mr-2" />{" "}
                                Approve Drawing
                              </button>
                            )}
                            {needsRevision(drawing.status) && (
                              <button
                                onClick={() => handleRevisionModal(drawing)}
                                className="block w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-gray-100 flex items-center"
                              >
                                <Upload size={16} className="mr-2" /> Submit
                                Revision
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Drawing Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {showPreview.drawing_name}
              </h3>
              <button
                onClick={() => setShowPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              <iframe
                src={`${BASE_URL}/${showPreview.latest_document_path}`}
                className="w-full h-full"
                title={showPreview.drawing_name}
              />
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(showPreview.latest_document_path)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Download size={16} className="mr-2" /> Download
              </button>
              <button
                onClick={() => setShowPreview(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Version History Modal */}
      <VersionHistoryModal
        showHistoryModal={showHistoryModal}
        setShowHistoryModal={setShowHistoryModal}
        selectedDrawing={selectedDrawing}
        isLoadingHistory={false}
        handlePreview={handlePreview}
        handleDownload={handleDownload}
      />
      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-2/3 flex flex-col max-h-screen">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Submit Revision for {selectedDrawing.drawing_name}
              </h3>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Drawing Name:
                  </label>
                  <p className="text-gray-600">
                    {selectedDrawing.drawing_name}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Discipline:
                  </label>
                  <p className="text-gray-600">{selectedDrawing.discipline}</p>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Current Version:
                  </label>
                  <p className="text-gray-600">
                    v{selectedDrawing.latest_version_number} -{" "}
                    {selectedDrawing.latest_document_path.split("/").pop()}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Status:
                  </label>
                  <p className="text-orange-600 font-semibold">
                    {selectedDrawing.status}
                  </p>
                </div>
              </div>

              {/* Current Version Feedback */}
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-10 mb-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="mb-4 bg-orange-50 p-4 rounded-md border border-orange-200">
                  <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                    <MessageSquare size={16} className="mr-2" /> Feedback from
                    Expert
                  </h4>
                  {versionHistory.length > 0 ? (
                    <p className="text-orange-700 text-sm">
                      {getCurrentVersionComment() ||
                        "No specific feedback provided."}
                    </p>
                  ) : (
                    <p className="text-orange-700 text-sm italic">
                      Loading feedback...
                    </p>
                  )}
                </div>
              )}

              {/* Version History Summary */}
              {versionHistory.length > 0 && !isLoadingHistory && (
                <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Previous Versions
                    </h4>
                    <button
                      onClick={() => handleHistoryModal(selectedDrawing)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Clock size={14} className="mr-1" /> View Full History
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {versionHistory.map((version, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm p-2 hover:bg-gray-100 rounded"
                      >
                        <div className="flex-1">
                          <span
                            className={`${
                              version.is_latest
                                ? "font-semibold"
                                : "font-normal"
                            }`}
                          >
                            Version {version.version_number}{" "}
                            {version.is_latest ? "(Current)" : ""}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {formatDate(version.uploaded_at)}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() =>
                              handleDownload(version.document_path)
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="Download Version"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Revision Comment: <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  placeholder="Enter your comments about this revision"
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Revised Drawing:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf,.dwg,.dxf"
                          className="sr-only"
                          onChange={(e) => setRevisionFile(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DWG, DXF up to 50MB
                    </p>
                  </div>
                </div>
                {revisionFile && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <CheckCircle size={16} className="mr-1" />
                    Selected file: {revisionFile.name}
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRevision}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center`}
                disabled={
                  isSubmitting || !revisionFile || !revisionComment.trim()
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" /> Submit Revision
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingTable;
