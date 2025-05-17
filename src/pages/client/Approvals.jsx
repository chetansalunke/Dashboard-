import React, { useState, useEffect } from "react";
import {
  Eye,
  Download,
  CheckCircle,
  X,
  AlertTriangle,
  CornerDownLeft,
  Clock,
  FileText,
  MessageSquare,
  User,
  Clipboard,
  FileCheck,
  Calendar,
  RefreshCw,
  Tag,
} from "lucide-react";

const Approvals = () => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(null);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, revision
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchDrawings();
  }, [activeTab]);

  // Fetch drawings sent to client
  const fetchDrawings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/api/projects/drawings/client`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch drawings");
      }

      const data = await response.json();
      let filteredDrawings = data.submissions || [];

      if (activeTab === "pending") {
        filteredDrawings = filteredDrawings.filter(
          (drawing) => drawing.drawing_status === "Sent to Client"
        );
      } else if (activeTab === "approved") {
        filteredDrawings = filteredDrawings.filter(
          (drawing) => drawing.drawing_status === "Approved by Client"
        );
      } else if (activeTab === "revision") {
        filteredDrawings = filteredDrawings.filter(
          (drawing) => drawing.drawing_status === "Revision Required by Client"
        );
      }

      setDrawings(filteredDrawings);
    } catch (error) {
      console.error("Error fetching client drawings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  // Handle preview and review
  const handleReview = (drawing) => {
    setSelectedDrawing(drawing);
    setShowPreview(drawing);
    setApprovalComment("");
    fetchVersionHistory(drawing.drawing_id);
  };

  // Handle download drawing
  const handleDownload = (path) => {
    window.open(`${BASE_URL}/${path}`, "_blank");
  };

  // Submit client review
  const handleSubmitReview = async (isApproved) => {
    if (!approvalComment.trim()) {
      alert("Please provide a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      const user = getCurrentUser();

      const status = isApproved
        ? "Approved by Client"
        : "Revision Required by Client";

      const payload = {
        status: status,
        client_id: user.id,
        comment: approvalComment,
      };

      const drawingId = selectedDrawing.drawing_id;
      const response = await fetch(
        `${BASE_URL}/api/projects/drawings/${drawingId}/reviewClient`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setShowPreview(null);
      setSelectedDrawing(null);
      setApprovalComment("");
      fetchDrawings(); // Refresh the drawings list
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current user from local storage
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return {};
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Sent to Client":
        return <Clock size={14} className="mr-1" />;
      case "Approved by Client":
        return <CheckCircle size={14} className="mr-1" />;
      case "Revision Required by Client":
        return <AlertTriangle size={14} className="mr-1" />;
      default:
        return <Tag size={14} className="mr-1" />;
    }
  };

  // Get current version's comment from version history
  const getCurrentVersionComment = () => {
    if (!versionHistory || versionHistory.length === 0) return null;
    const currentVersion = versionHistory.find(
      (version) => version.is_latest === 1
    );

    return currentVersion?.comments?.[1]?.comment || "";
  };

  // Get pending count
  const getPendingCount = () => {
    if (!drawings) return 0;
    return drawings.filter(
      (drawing) => drawing.drawing_status === "Sent to Client"
    ).length;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FileCheck className="mr-2 text-indigo-600" size={24} />
          Drawing Approvals
        </h1>
        <p className="text-gray-600 mt-1 ml-8">
          Review and approve drawings sent by the design team
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex flex-wrap">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md flex items-center mr-2 ${
              activeTab === "pending"
                ? "bg-indigo-100 text-indigo-800 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Clock
              size={16}
              className={`mr-1.5 ${
                activeTab === "pending" ? "text-indigo-600" : "text-gray-500"
              }`}
            />
            Pending Review
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 rounded-md flex items-center mr-2 ${
              activeTab === "approved"
                ? "bg-green-100 text-green-800 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <CheckCircle
              size={16}
              className={`mr-1.5 ${
                activeTab === "approved" ? "text-green-600" : "text-gray-500"
              }`}
            />
            Approved
          </button>
          <button
            onClick={() => setActiveTab("revision")}
            className={`px-4 py-2 rounded-md flex items-center ${
              activeTab === "revision"
                ? "bg-orange-100 text-orange-800 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <AlertTriangle
              size={16}
              className={`mr-1.5 ${
                activeTab === "revision" ? "text-orange-600" : "text-gray-500"
              }`}
            />
            Revision Required
          </button>
          <div className="ml-auto">
            <button
              onClick={fetchDrawings}
              className="px-3 py-2 rounded-md flex items-center text-gray-600 hover:bg-gray-100"
              title="Refresh drawings"
            >
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project / Drawing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drawings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Clipboard size={36} className="text-gray-400 mb-2" />
                        <p>No drawings found in this category</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Drawings that match your selected filter will appear
                          here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  drawings.map((drawing) => (
                    <tr
                      key={drawing.drawing_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {drawing.project_name || "Project"}
                        </div>
                        <div
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer mt-1"
                          onClick={() => handleReview(drawing)}
                        >
                          {drawing.drawing_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Tag size={12} className="mr-1" />
                          {drawing.discipline || "General"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 flex items-center">
                          <Calendar
                            size={14}
                            className="mr-1.5 text-gray-500"
                          />
                          {formatDate(drawing.submitted_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 flex items-center">
                          <User size={14} className="mr-1.5 text-gray-500" />
                          {drawing.expert_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReview(drawing)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                            title="View & Review Drawing"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(drawing.latest_document_path)
                            }
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                            title="Download Drawing"
                          >
                            <Download size={18} />
                          </button>
                          {activeTab === "pending" && (
                            <button
                              onClick={() => handleReview(drawing)}
                              className="px-3 py-1 inline-flex items-center text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                              <CornerDownLeft size={14} className="mr-1" />{" "}
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawing Preview and Review Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-indigo-50">
              <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
                <FileText size={20} className="mr-2 text-indigo-600" />
                {showPreview.drawing_name}
              </h3>
              <button
                onClick={() => {
                  setShowPreview(null);
                  setSelectedDrawing(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow flex overflow-hidden">
              {/* Document Preview - Larger portion */}
              <div className="w-3/4 h-full bg-gray-50 p-2">
                <iframe
                  src={`${BASE_URL}/${showPreview.latest_document_path}`}
                  className="w-full h-full rounded-lg shadow-md"
                  title={showPreview.drawing_name}
                />
              </div>

              {/* Right sidebar for comments and approval */}
              <div className="w-1/4 h-full border-l border-gray-200 p-4 flex flex-col overflow-y-auto">
                {/* Drawing Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Drawing Details
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Project:</span>{" "}
                      {showPreview.project_name || "Project"}
                    </div>
                    <div>
                      <span className="font-medium">Discipline:</span>{" "}
                      {showPreview.discipline || "General"}
                    </div>
                    <div>
                      <span className="font-medium">Version:</span> v
                      {showPreview.latest_version_number}
                    </div>
                    <div className="flex items-center">
                      <User size={10} className="mr-1" />
                      <span className="font-medium">By:</span>{" "}
                      {showPreview.expert_name}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={10} className="mr-1" />
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(showPreview.submitted_at)}
                    </div>
                  </div>
                </div>

                {/* Designer's Comment */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <MessageSquare size={14} className="mr-1 text-indigo-600" />
                    Designer's Comment
                  </h4>
                  {isLoadingHistory ? (
                    <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
                  ) : (
                    <div className="text-xs text-gray-700 bg-blue-50 p-3 rounded">
                      {getCurrentVersionComment() ||
                        "No comment provided by the designer."}
                    </div>
                  )}
                </div>

                {/* Client Review Form - Only show if status is pending */}
                {activeTab === "pending" && (
                  <div className="flex-grow flex flex-col">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <CornerDownLeft
                        size={14}
                        className="mr-1 text-indigo-600"
                      />
                      Your Review
                    </h4>
                    <textarea
                      className="flex-grow w-full border rounded p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add your detailed comments here..."
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      required
                    ></textarea>

                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleSubmitReview(false)}
                        className={`flex-1 mr-2 py-2 px-4 rounded shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center ${
                          isSubmitting || !approvalComment.trim()
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSubmitting || !approvalComment.trim()}
                      >
                        <AlertTriangle size={14} className="mr-1" /> Reject
                      </button>

                      <button
                        onClick={() => handleSubmitReview(true)}
                        className={`flex-1 py-2 px-4 rounded shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center ${
                          isSubmitting || !approvalComment.trim()
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isSubmitting || !approvalComment.trim()}
                      >
                        <CheckCircle size={14} className="mr-1" /> Approve
                      </button>
                    </div>
                  </div>
                )}

                {/* Show previous comments for approved/revision drawings */}
                {activeTab !== "pending" && (
                  <div className="flex-grow">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      {activeTab === "approved" ? (
                        <CheckCircle
                          size={14}
                          className="mr-1 text-green-600"
                        />
                      ) : (
                        <AlertTriangle
                          size={14}
                          className="mr-1 text-orange-600"
                        />
                      )}
                      Your Previous Review
                    </h4>
                    {isLoadingHistory ? (
                      <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
                    ) : versionHistory.length > 0 &&
                      versionHistory[0].comments &&
                      versionHistory[0].comments.length > 0 ? (
                      <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded">
                        <p>{versionHistory[0].comments[0].comment}</p>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                          Reviewed on{" "}
                          {formatDate(versionHistory[0].comments[0].created_at)}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        No review comments found
                      </p>
                    )}

                    <div className="mt-4">
                      <button
                        onClick={() =>
                          handleDownload(showPreview.latest_document_path)
                        }
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center text-sm"
                      >
                        <Download size={14} className="mr-1" /> Download Drawing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
