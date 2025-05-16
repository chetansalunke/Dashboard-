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
  ThumbsUp,
  AlertTriangle,
  User,
} from "lucide-react";
import BASE_URL from "../../../config";
import VersionHistoryModal from "./VersionHistoryModal";

const DrawingTable = ({
  users,
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
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientComment, setClientComment] = useState("");
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Determine user role on component mount
    const user = getCurrentUser();
    setUserRole(user?.role || "");
  }, []);

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
      const res = await fetch(`${BASE_URL}/api/auth/all`);
      const data = await res.json();

      // Filter only users with role "client"
      const clientUsers = data.users?.filter((u) => u.role === "client") || [];

      setClientUsers(clientUsers); // correctly set filtered list
      console.log(clientUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
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

  // Check if user is admin or expert
  const isAdminOrExpert = () => {
    const role = userRole.toLowerCase();
    return role === "admin" || role === "expert";
  };

  // Find current version's comment from version history
  const getCurrentVersionComment = () => {
    if (!versionHistory || versionHistory.length === 0) return null;
    console.log("Get Current version Ffrom '");
    console.log(versionHistory);
    const currentVersion = versionHistory.find(
      (version) => version.is_latest === 1
    );
    console.log("comment");
    console.log(currentVersion?.comments?.[0]?.comment);
    return currentVersion?.comments?.[0]?.comment || selectedDrawing.remark;
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

                      {/* Show review button for admin/expert when drawing is 'Sent to Expert' */}
                      {isAdminOrExpert() &&
                        drawing.status === "Sent to Expert" && (
                          <button
                            onClick={() => handleExpertReviewModal(drawing)}
                            className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center shadow-sm transition-colors"
                          >
                            <ExternalLink size={14} className="mr-1" /> Review
                          </button>
                        )}

                      {/* Show 'Send to Client' button for admin/expert when drawing is 'Approved by Expert' */}
                      {isAdminOrExpert() &&
                        drawing.status === "Approved by Expert" && (
                          <button
                            onClick={() => handleClientSubmitModal(drawing)}
                            className="px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center shadow-sm transition-colors"
                          >
                            <Send size={14} className="mr-1" /> Send to Client
                          </button>
                        )}

                      {needsRevision(drawing.status) && !isAdminOrExpert() && (
                        <button
                          onClick={() => handleRevisionModal(drawing)}
                          className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center shadow-sm transition-colors"
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
                            {isAdminOrExpert() &&
                              drawing.status === "Sent to Expert" && (
                                <button
                                  onClick={() =>
                                    handleExpertReviewModal(drawing)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-100 flex items-center"
                                >
                                  <ExternalLink size={16} className="mr-2" />{" "}
                                  Review Drawing
                                </button>
                              )}
                            {isAdminOrExpert() &&
                              drawing.status === "Approved by Expert" && (
                                <button
                                  onClick={() =>
                                    handleClientSubmitModal(drawing)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-gray-100 flex items-center"
                                >
                                  <Send size={16} className="mr-2" /> Submit to
                                  Client
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                {showPreview.drawing_name}
              </h3>
              <button
                onClick={() => setShowPreview(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto bg-gray-100">
              <iframe
                src={`${BASE_URL}/${showPreview.latest_document_path}`}
                className="w-full h-full rounded shadow-lg"
                title={showPreview.drawing_name}
              />
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(showPreview.latest_document_path)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center shadow-sm transition-colors"
              >
                <Download size={16} className="mr-2" /> Download
              </button>
              <button
                onClick={() => setShowPreview(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expert Review Modal */}
      {showExpertReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-4/5 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b bg-indigo-50">
              <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
                <ExternalLink size={20} className="mr-2 text-indigo-600" />
                Expert Review: {selectedDrawing.drawing_name}
              </h3>
              <button
                onClick={() => setShowExpertReviewModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-full flex flex-col">
                <div className="bg-indigo-50 p-5 rounded-lg mb-5 shadow-sm">
                  <h4 className="font-medium text-indigo-900 mb-3 flex items-center text-lg">
                    <FileText size={18} className="mr-2 text-indigo-600" />
                    Drawing Information
                  </h4>
                  <div className="space-y-3 bg-white p-4 rounded-md shadow-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Name:
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-800">
                          {selectedDrawing.drawing_name}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Remark:
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-800">
                          {selectedDrawing.remark}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Discipline:
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-800">
                          {selectedDrawing.discipline}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Version:
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-800">
                          v{selectedDrawing.latest_version_number}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Submitted By:
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <User size={14} className="text-gray-500 mr-1" />
                          <span className="text-sm font-medium text-gray-800">
                            {selectedDrawing.sent_by_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-gray-600">
                          Last Updated:
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <Clock size={14} className="text-gray-500 mr-1" />
                          <span className="text-sm font-medium text-gray-800">
                            {formatDate(selectedDrawing.last_updated)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Designer's Comment */}
                <div className="bg-blue-50 p-5 rounded-lg mb-5 shadow-sm">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <MessageSquare size={18} className="mr-2 text-blue-600" />
                    Designer's Latest Comment
                  </h4>
                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center h-24 bg-white rounded-md">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-gray-700 whitespace-pre-line">
                        {getCurrentVersionComment() ||
                          "No comment provided by the designer."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expert Review Form */}
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <ExternalLink size={18} className="mr-2 text-indigo-600" />
                    Your Expert Review
                  </h4>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Review Comment: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      rows="4"
                      placeholder="Add your detailed review comments here..."
                      value={expertComment}
                      onChange={(e) => setExpertComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-between space-x-3">
                    <button
                      onClick={() => handleSubmitExpertReview(false)}
                      className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors ${
                        isSubmitting || !expertComment.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isSubmitting || !expertComment.trim()}
                    >
                      <span className="flex items-center">
                        <AlertTriangle size={16} className="mr-2" /> Request
                        Revision
                      </span>
                    </button>

                    <button
                      onClick={() => handleSubmitExpertReview(true)}
                      className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors ${
                        isSubmitting || !expertComment.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={isSubmitting || !expertComment.trim()}
                    >
                      <span className="flex items-center">
                        <ThumbsUp size={16} className="mr-2" /> Approve Drawing
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawing Preview Panel */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm h-full flex flex-col">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Eye size={18} className="mr-2 text-gray-600" />
                  Drawing Preview
                </h4>
                <div className="flex-grow bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                  <iframe
                    src={`${BASE_URL}/${selectedDrawing.latest_document_path}`}
                    className="w-full h-full"
                    title={selectedDrawing.drawing_name}
                  />
                </div>
                <div className="mt-3">
                  <button
                    onClick={() =>
                      handleDownload(selectedDrawing.latest_document_path)
                    }
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm text-sm transition-colors"
                  >
                    <Download size={14} className="mr-1.5" /> Download Drawing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Submit Modal */}
      {showClientSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <div className="flex justify-between items-center p-4 border-b bg-purple-50">
              <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                <Send size={20} className="mr-2 text-purple-600" />
                Submit Drawing to Client
              </h3>
              <button
                onClick={() => setShowClientSubmitModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Client: <span className="text-red-500">*</span>
                </label>
                {isLoadingClients ? (
                  <div className="flex justify-center items-center h-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <select
                    className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                  >
                    <option value="">Select a client...</option>
                    {clientUsers.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.username}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Message to Client:
                </label>
                <textarea
                  className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  rows="3"
                  placeholder="Add a message for the client (optional)"
                  value={clientComment}
                  onChange={(e) => setClientComment(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClientSubmitModal(false)}
                  className="py-2 px-4 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitToClient}
                  className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center ${
                    isSubmitting || !selectedClient
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isSubmitting || !selectedClient}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send size={16} className="mr-2" /> Submit to Client
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <div className="p-6">
              {/* Show current feedback that requires revision */}
              <div className="mb-5 bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  Revision Request
                </h4>
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-16">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-md border border-orange-200">
                    <p className="text-gray-700 text-sm whitespace-pre-line">
                      {versionHistory.length > 0
                        ? versionHistory[0].feedback ||
                          "No specific feedback provided."
                        : "No feedback details available."}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Revised Drawing:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileDown
                      size={30}
                      className={`mx-auto ${
                        revisionFile ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>
                          {revisionFile
                            ? revisionFile.name
                            : "Click to upload file"}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) =>
                            setRevisionFile(e.target.files[0] || null)
                          }
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DWG, or DXF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Revision Comment:
                </label>
                <textarea
                  className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  rows="3"
                  placeholder="Describe the changes made in this revision..."
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="py-2 px-4 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
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
    </div>
  );
};

export default DrawingTable;
