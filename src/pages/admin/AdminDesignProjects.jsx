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
  Send,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import BASE_URL from "../../config";

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
  const [showExpertReviewModal, setShowExpertReviewModal] = useState(false);
  const [showClientSubmitModal, setShowClientSubmitModal] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [revisionComment, setRevisionComment] = useState("");
  const [expertComment, setExpertComment] = useState("");
  const [revisionFile, setRevisionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [clientUsers, setClientUsers] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [clientComment, setClientComment] = useState("");
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Current user from local storage
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return {};
    }
  };

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

  // Fetch client users
  const fetchClientUsers = async () => {
    try {
      setIsLoadingClients(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/users/clients`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.clients) {
        setClientUsers(data.clients);
      }
    } catch (error) {
      console.error("Error fetching client users:", error);
    } finally {
      setIsLoadingClients(false);
    }
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

  // Handle expert review modal
  const handleExpertReviewModal = (drawing) => {
    setSelectedDrawing(drawing);
    setShowExpertReviewModal(true);
    setExpertComment("");
    fetchVersionHistory(drawing.drawing_id); // Get the history when opening review modal
    setShowActionDropdown(null);
  };

  // Handle client submission modal
  const handleClientSubmitModal = (drawing) => {
    setSelectedDrawing(drawing);
    setShowClientSubmitModal(true);
    setSelectedClient("");
    setClientComment("");
    fetchClientUsers(); // Fetch available client users
    setShowActionDropdown(null);
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

  // Submit expert review
  const handleSubmitExpertReview = async (isApproved) => {
    if (!expertComment.trim()) {
      alert("Please provide a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      const user = getCurrentUser();

      const status = isApproved
        ? "Approved by Expert"
        : "Revision Required by Expert";

      const payload = {
        status: status,
        comment: expertComment,
        reviewer_id: user.id,
      };

      await fetch(
        `${BASE_URL}/api/projects/drawings/${selectedDrawing.drawing_id}/reviewExpert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      setShowExpertReviewModal(false);
      setExpertComment("");
      fetchDrawings(); // Refresh the drawings list

      // If approved, show client submit modal
      if (isApproved) {
        handleClientSubmitModal(selectedDrawing);
      }
    } catch (error) {
      console.error("Error submitting expert review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit to client
  const handleSubmitToClient = async () => {
    if (!selectedClient) {
      alert("Please select a client");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      const user = getCurrentUser();

      const payload = {
        submitted_by: user.id,
        submitted_to: parseInt(selectedClient),
        comment: clientComment || "Submitting approved drawing",
      };

      await fetch(
        `${BASE_URL}/api/projects/drawings/${selectedDrawing.drawing_id}/submitClient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      setShowClientSubmitModal(false);
      setSelectedClient("");
      setClientComment("");
      fetchDrawings(); // Refresh the drawings list
    } catch (error) {
      console.error("Error submitting to client:", error);
      alert("Failed to submit to client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      const user = getCurrentUser();
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
      case "Approved by Expert":
        return "bg-green-100 text-green-800";
      case "Needs Revision":
      case "Revision Required by Expert":
        return "bg-orange-100 text-orange-800";
      case "Sent to Client":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if a drawing needs revision
  const needsRevision = (status) => {
    return (
      status === "Needs Revision" || status === "Revision Required by Expert"
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

                      {drawing.status === "Sent to Expert" && (
                        <button
                          onClick={() => handleExpertReviewModal(drawing)}
                          className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center"
                        >
                          <ExternalLink size={14} className="mr-1" /> Review
                        </button>
                      )}

                      {drawing.status === "Approved by Expert" && (
                        <button
                          onClick={() => handleClientSubmitModal(drawing)}
                          className="px-2 py-1 text-xs font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 flex items-center"
                        >
                          <Send size={14} className="mr-1" /> Send to Client
                        </button>
                      )}

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
                                onClick={() => handleExpertReviewModal(drawing)}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-100 flex items-center"
                              >
                                <ExternalLink size={16} className="mr-2" />{" "}
                                Review Drawing
                              </button>
                            )}
                            {drawing.status === "Approved by Expert" && (
                              <button
                                onClick={() => handleClientSubmitModal(drawing)}
                                className="block w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-gray-100 flex items-center"
                              >
                                <Send size={16} className="mr-2" /> Submit to
                                Client
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

      {/* Expert Review Modal */}
      {showExpertReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-2/3 flex flex-col max-h-screen">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Review Drawing - {selectedDrawing.drawing_name}
              </h3>
              <button
                onClick={() => setShowExpertReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-full flex flex-col">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Drawing Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-semibold">Name:</span>
                      <span className="text-sm ml-2">
                        {selectedDrawing.drawing_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold">Discipline:</span>
                      <span className="text-sm ml-2">
                        {selectedDrawing.discipline}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold">Version:</span>
                      <span className="text-sm ml-2">
                        v{selectedDrawing.latest_version_number}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold">
                        Submitted By:
                      </span>
                      <span className="text-sm ml-2">
                        {selectedDrawing.sent_by_name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Designer's Comment */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4 flex-grow">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Designer's Latest Comment
                  </h4>
                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center h-16">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="text-gray-700">
                        {getCurrentVersionComment() ||
                          "No comment provided by the designer."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expert Review Form */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Expert Review
                  </h4>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Review Comment: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="4"
                      placeholder="Add your review comments here..."
                      value={expertComment}
                      onChange={(e) => setExpertComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-between space-x-3">
                    <button
                      onClick={() => handleSubmitExpertReview(false)}
                      className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 ${
                        isSubmitting || !expertComment.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isSubmitting || !expertComment.trim()}
                    >
                      <span className="flex items-center">
                        <X size={16} className="mr-2" /> Request Revision
                      </span>
                    </button>

                    <button
                      onClick={() => handleSubmitExpertReview(true)}
                      className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 ${
                        isSubmitting || !expertComment.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isSubmitting || !expertComment.trim()}
                    >
                      <span className="flex items-center">
                        <CheckCircle size={16} className="mr-2" /> Approve
                        Drawing
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawing Preview Panel */}
              <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col">
                <h4 className="font-medium text-gray-800 mb-3">
                  Drawing Preview
                </h4>
                <div className="flex-grow bg-white border border-gray-200 rounded">
                  <iframe
                    src={`${BASE_URL}/${selectedDrawing.latest_document_path}`}
                    className="w-full h-full"
                    title={selectedDrawing.drawing_name}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      handleDownload(selectedDrawing.latest_document_path)
                    }
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Download size={14} className="mr-1" /> Download Drawing
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowExpertReviewModal(false)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit to Client Modal */}
      {showClientSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-2/3 max-w-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Submit to Client - {selectedDrawing.drawing_name}
              </h3>
              <button
                onClick={() => setShowClientSubmitModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">
                    Drawing Approved
                  </h4>
                </div>
                <p className="mt-2 text-green-700 text-sm">
                  This drawing has been approved and is ready to be sent to a
                  client.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Client: <span className="text-red-500">*</span>
                </label>
                {isLoadingClients ? (
                  <div className="flex items-center space-x-2 h-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-gray-500">Loading clients...</span>
                  </div>
                ) : (
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                  >
                    <option value="">-- Select a client --</option>
                    {clientUsers.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Additional Comments:
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  placeholder="Add any additional comments for the client..."
                  value={clientComment}
                  onChange={(e) => setClientComment(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">
                  Drawing Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-semibold">Name:</span>
                    <span className="text-sm ml-2">
                      {selectedDrawing.drawing_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Discipline:</span>
                    <span className="text-sm ml-2">
                      {selectedDrawing.discipline}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Version:</span>
                    <span className="text-sm ml-2">
                      v{selectedDrawing.latest_version_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">
                      Expert Approval:
                    </span>
                    <span className="text-sm ml-2">
                      <CheckCircle
                        size={16}
                        className="inline text-green-600 mr-1"
                      />{" "}
                      Approved
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() =>
                      handleDownload(selectedDrawing.latest_document_path)
                    }
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Download size={14} className="mr-1" /> Preview Drawing
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right rounded-b-lg border-t">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClientSubmitModal(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitToClient}
                  className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 ${
                    isSubmitting || !selectedClient
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isSubmitting || !selectedClient}
                >
                  <span className="flex items-center">
                    <UserCheck size={16} className="mr-2" /> Submit to Client
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-2/3 max-w-3xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Submit Revision - {selectedDrawing.drawing_name}
              </h3>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100">
                <div className="flex items-center">
                  <FileText size={20} className="text-orange-600 mr-2" />
                  <h4 className="font-medium text-orange-800">
                    Revision Required
                  </h4>
                </div>
                <p className="mt-2 text-orange-700 text-sm">
                  This drawing needs revision before it can be approved. Please
                  upload a new version.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Revised Drawing:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.dwg,.dxf,.dwf"
                          onChange={(e) => setRevisionFile(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DWG, DXF, DWF up to 10MB
                    </p>
                  </div>
                </div>
                {revisionFile && (
                  <div className="mt-2 flex items-center bg-blue-50 p-2 rounded">
                    <FileDown size={16} className="text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      {revisionFile.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Revision Comments: <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  placeholder="Explain what changes you made in this revision..."
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Previous Feedback Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">
                  Previous Feedback
                </h4>
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-16">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versionHistory
                      .filter(
                        (version) =>
                          version.feedback && version.feedback.length > 0
                      )
                      .slice(0, 2)
                      .map((version, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border border-gray-200"
                        >
                          <div className="flex items-start">
                            <MessageSquare
                              size={16}
                              className="text-blue-600 mr-2 mt-1"
                            />
                            <div>
                              <p className="text-gray-700">
                                {version.feedback}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                From: {version.reviewer_name || "System"} -
                                {formatDate(version.updated_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {!versionHistory.some(
                      (v) => v.feedback && v.feedback.length > 0
                    ) && (
                      <p className="text-gray-500 text-sm">
                        No previous feedback available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right rounded-b-lg border-t">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRevision}
                  className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
                    isSubmitting || !revisionFile || !revisionComment.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    isSubmitting || !revisionFile || !revisionComment.trim()
                  }
                >
                  <span className="flex items-center">
                    <Upload size={16} className="mr-2" /> Submit Revision
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-4xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Version History - {selectedDrawing.drawing_name}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {versionHistory.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No version history available.
                    </p>
                  ) : (
                    versionHistory.map((version, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg overflow-hidden ${
                          version.is_latest === 1
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                          <div className="flex items-center">
                            {version.is_latest === 1 && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                                Current Version
                              </span>
                            )}
                            <h4 className="font-medium">
                              Version {version.version_number}
                            </h4>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(version.created_at)}
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              Details
                            </h5>
                            <div className="space-y-3">
                              {version.comment && (
                                <div>
                                  <span className="text-sm font-semibold">
                                    Comments:
                                  </span>
                                  <p className="text-gray-700 text-sm mt-1">
                                    {version.comment}
                                  </p>
                                </div>
                              )}
                              {version.feedback && (
                                <div>
                                  <span className="text-sm font-semibold">
                                    Feedback:
                                  </span>
                                  <p className="text-gray-700 text-sm mt-1 bg-yellow-50 p-2 rounded">
                                    {version.feedback}
                                  </p>
                                </div>
                              )}
                              <div>
                                <span className="text-sm font-semibold">
                                  Uploaded By:
                                </span>
                                <span className="text-sm ml-2">
                                  {version.uploaded_by_name || "Unknown"}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-semibold">
                                  Status:
                                </span>
                                <span className="text-sm ml-2">
                                  {version.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              Actions
                            </h5>
                            <div className="space-y-2">
                              <button
                                onClick={() =>
                                  handleDownload(version.document_path)
                                }
                                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center justify-center"
                              >
                                <Download size={16} className="mr-2" /> Download
                              </button>
                              <button
                                onClick={() => {
                                  setShowPreview({
                                    drawing_name: `${selectedDrawing.drawing_name} (v${version.version_number})`,
                                    latest_document_path: version.document_path,
                                  });
                                  setShowHistoryModal(false);
                                }}
                                className="w-full px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex items-center justify-center"
                              >
                                <Eye size={16} className="mr-2" /> Preview
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right rounded-b-lg border-t">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingTable;
