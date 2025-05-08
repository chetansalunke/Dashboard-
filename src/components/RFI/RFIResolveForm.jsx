import React, { useState } from "react";
import BASE_URL from "../../config";

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

  const handleResolveSubmit = async () => {
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

      // Reset form
      setSolutionText("");
      setSolutionFiles([]);
      setErrorMsg(null);
      onSuccess();
    } catch (error) {
      console.error("Error resolving RFI:", error);
      setErrorMsg("Something went wrong while resolving the RFI.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <div className="text-right hover:cursor-pointer" onClick={onCancel}>
        <span className="inline-block bg-gray-300 rounded px-2 py-1 text-sm text-gray-600">
          X
        </span>
      </div>

      {/* Title Section */}
      <div
        className={`p-1 shadow-sm rounded ${
          rfi.resolution_details || rfi.resolved_at
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      >
        <h1 className="text-xl font-semibold tracking-wide text-black">RFI</h1>
      </div>

      {/* Details Grid */}
      <div className="w-full p-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Title</span>
          <input
            type="text"
            value={rfi.title || "NA"}
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-700 focus:shadow-outline-gray form-input"
            readOnly
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Details</span>
          <input
            type="text"
            value={rfi.details || "NA"}
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-700 focus:shadow-outline-gray form-input"
            readOnly
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Priority</span>
          <input
            type="text"
            value={rfi.priority || "NA"}
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-700 focus:shadow-outline-gray form-input"
            readOnly
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 text-sm font-semibold">Sent To</span>
          <input
            type="text"
            value={users[rfi.send_to] ?? "NA"}
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-700 focus:shadow-outline-gray form-input"
            readOnly
          />
        </label>
      </div>

      {/* Sent Info */}
      <div className="text-right mt-2 mb-5">
        <span className="inline-block bg-gray-200 rounded px-2 py-1 text-sm text-gray-600">
          Sent on {new Date(rfi.created_at).toLocaleDateString("en-GB")} at{" "}
          {new Date(rfi.created_at).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>

      {/* Resolution Section */}
      <div
        className={`p-1 shadow-sm rounded ${
          rfi.resolution_details || rfi.resolved_at
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      >
        <h1 className="text-xl font-semibold tracking-wide text-black">
          Pending/Resolved
        </h1>
      </div>

      {/* Solution Box */}
      <div className="space-y-2">
        <label className="text-gray-700 text-sm font-semibold">Solution</label>

        {rfi.resolution_details || rfi.resolved_at ? (
          <>
            <textarea
              value={rfi.resolution_details || ""}
              className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-700 focus:shadow-outline-gray form-input"
              rows={3}
              readOnly
              placeholder="No resolution provided"
            />

            <label className="text-gray-700 text-sm font-semibold mt-2">
              Documents
            </label>
            {rfi.resolution_documents ? (
              <ul className="list-disc ml-5">
                {rfi.resolution_documents.split(",").map((doc, index) => (
                  <li key={index}>
                    <a
                      href={`${BASE_URL}/uploads/${doc.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline hover:text-blue-800"
                      download
                    >
                      {decodeURIComponent(doc.trim().split("/").pop())}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No file</p>
            )}
          </>
        ) : (
          <>
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              className="block w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
              rows={3}
              placeholder="Enter solution..."
            />

            <label className="text-gray-700 text-sm font-semibold">
              Upload Documents
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setSolutionFiles(Array.from(e.target.files))}
              className="lock w-full mt-1 text-sm light:border-gray-600 light:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple light:text-gray-300 light:focus:shadow-outline-gray form-input"
            />
          </>
        )}
      </div>

      {/* Resolved Date */}
      {rfi.resolved_at && (
        <div className="text-right mt-2 mb-5">
          <span className="inline-block bg-gray-200 rounded px-2 py-1 text-sm text-gray-600">
            Resolved on {new Date(rfi.resolved_at).toLocaleDateString("en-GB")}{" "}
            at{" "}
            {new Date(rfi.resolved_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      )}

      {/* Submit Button */}
      {!rfi.resolution_details && !rfi.resolved_at && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleResolveSubmit}
            className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Submit Solution
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="text-red-600 text-sm font-semibold text-right">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
