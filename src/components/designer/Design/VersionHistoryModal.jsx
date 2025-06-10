import axios from "axios";
import { useEffect, useState } from "react";
import { X, FileText, Download, Eye, MessageSquare, User } from "lucide-react";
import BASE_URL from "../../../config";
export default function VersionHistoryModal({
  showHistoryModal,
  setShowHistoryModal,
  selectedDrawing,
  isLoadingHistory = false,
  handlePreview,
  handleDownload,
}) {
  const [versionHistory, setVersionHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showHistoryModal && selectedDrawing?.drawing_id) {
      fetchVersionHistory();
    }
  }, [showHistoryModal, selectedDrawing]);

  const fetchVersionHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${BASE_URL}/api/projects/drawings/${selectedDrawing.drawing_id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVersionHistory(response.data.versions || []);
    } catch (error) {
      console.error("Error fetching version history:", error);
      setVersionHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Function to get role background color
  const getRoleColor = (role) => {
    switch (role) {
      case "Designer":
        return "bg-purple-100 text-purple-800";
      case "Expert":
        return "bg-blue-100 text-blue-800";
      case "Client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!showHistoryModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-4xl flex flex-col max-h-screen">
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
            <div className="space-y-8">
              {versionHistory.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No version history available
                </p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

                  {versionHistory.map((version, index) => (
                    <div key={index} className="relative pl-10 pb-8">
                      <div
                        className={`absolute left-2 -ml-px h-4 w-4 rounded-full ${
                          version.is_latest ? "bg-blue-500" : "bg-gray-400"
                        } border-4 border-white`}
                      ></div>
                      <div
                        className={`bg-white p-4 rounded-lg border ${
                          version.is_latest
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs font-bold rounded-full ${
                                  version.is_latest
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                Version {version.version_number}{" "}
                                {version.is_latest ? "(Current)" : ""}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(version.uploaded_at)}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center">
                              <User size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">
                                Uploaded by:{" "}
                                <span className="font-medium">
                                  {version.uploaded_by_name}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handlePreview &&
                                handlePreview({
                                  ...selectedDrawing,
                                  latest_document_path: version.document_path,
                                })
                              }
                              className="px-3 py-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 flex items-center text-sm"
                              title="Preview Version"
                            >
                              <Eye size={16} className="mr-1" /> View
                            </button>
                            <button
                              onClick={() =>
                                handleDownload &&
                                handleDownload(version.document_path)
                              }
                              className="px-3 py-1 text-green-600 hover:text-green-800 rounded hover:bg-green-50 flex items-center text-sm"
                              title="Download Version"
                            >
                              <Download size={16} className="mr-1" /> Download
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start mb-4">
                          <FileText
                            size={18}
                            className="text-gray-400 mt-1 mr-2 flex-shrink-0"
                          />
                          <div>
                            <span className="text-sm font-medium block mb-1">
                              Document:
                            </span>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                              {version.document_path.split("/").pop()}
                            </code>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {/* <div className="mt-4 border-t pt-3">
                          <div className="flex items-center mb-3">
                            <MessageSquare
                              size={18}
                              className="text-gray-400 mr-2"
                            />
                            <span className="text-sm font-medium">
                              Comments ({version.comments.length})
                            </span>
                          </div>

                          <div className="space-y-3 pl-2">
                            {version.comments.map((comment, commentIndex) => (
                              <div
                                key={commentIndex}
                                className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(
                                        comment.commenter_role
                                      )}`}
                                    >
                                      {comment.commenter_role}
                                    </span>
                                    <span className="text-sm font-medium">
                                      {comment.commenter_name}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(comment.created_at)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">
                                  {comment.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={() => setShowHistoryModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
