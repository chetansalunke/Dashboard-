import React, { useState } from "react";
import BASE_URL from "../../../config";
import RoleDropdown from "../../designer/RFI/DesignerRoleDropdown";
import { X } from "lucide-react";

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
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientRemark, setClientRemark] = useState("");

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

      setSolutionText("");
      setSolutionFiles([]);
      setErrorMsg(null);
      onSuccess();
    } catch (error) {
      console.error("Error resolving RFI:", error);
      setErrorMsg("Something went wrong while resolving the RFI.");
    }
  };

  const handleSendToClientClick = () => {
    setShowClientForm(true);
  };

  const handleClientSubmit = async () => {
    if (!selectedClient || !clientRemark.trim()) {
      setErrorMsg("Please select a client and enter a remark.");
      return;
    }

    const body = {
      rfi_id: rfi.id,
      client_id: selectedClient.id,
      client_remark: clientRemark,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/sendToClient`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to send to client.");
      }

      setClientRemark("");
      setSelectedClient(null);
      setShowClientForm(false);
      setErrorMsg(null);
      onSuccess();
    } catch (error) {
      console.error("Error sending to client:", error);
      setErrorMsg("Something went wrong while sending to the client.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 relative">
      <div className="text-right hover:cursor-pointer" onClick={onCancel}>
        <span className="inline-block bg-gray-300 rounded px-2 py-1 text-sm text-gray-600">
          X
        </span>
      </div>

      {/* RFI Info */}
      <div
        className={`p-1 shadow-sm rounded ${
          rfi.resolution_details || rfi.resolved_at
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      >
        <h1 className="text-xl font-semibold tracking-wide text-black">RFI</h1>
      </div>

      <div className="w-full p-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block text-sm">
          <span className="text-gray-700 font-semibold">Title</span>
          <input
            type="text"
            value={rfi.title || "NA"}
            readOnly
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 form-input"
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 font-semibold">Details</span>
          <input
            type="text"
            value={rfi.details || "NA"}
            readOnly
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 form-input"
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 font-semibold">Priority</span>
          <input
            type="text"
            value={rfi.priority || "NA"}
            readOnly
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 form-input"
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 font-semibold">Sent To</span>
          <input
            type="text"
            value={users[rfi.send_to] ?? "NA"}
            readOnly
            className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 form-input"
          />
        </label>
      </div>

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

      {/* Solution Section */}
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

      <div className="space-y-2">
        <label className="text-gray-700 text-sm font-semibold">Solution</label>

        {rfi.resolution_details || rfi.resolved_at ? (
          <>
            <textarea
              value={rfi.resolution_details || ""}
              readOnly
              rows={3}
              className="block w-full mt-1 text-sm border-gray-300 bg-gray-100 form-input"
            />
            <label className="text-gray-700 text-sm font-semibold mt-2">
              Documents
            </label>
            {rfi.resolution_documents ? (
              <ul className="list-disc ml-5">
                {rfi.resolution_documents.split(",").map((doc, i) => (
                  <li key={i}>
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
              rows={3}
              className="block w-full mt-1 text-sm border-gray-300 form-input"
              placeholder="Enter solution..."
            />

            <label className="text-gray-700 text-sm font-semibold">
              Upload Documents
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setSolutionFiles(Array.from(e.target.files))}
              className="block w-full mt-1 text-sm border-gray-300 form-input"
            />
          </>
        )}
      </div>

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

      {/* Client Forward Modal */}
      {showClientForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowClientForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b bg-purple-50">
              <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                Sent RFI to Client
              </h3>
              <button
                onClick={() => setShowClientForm(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                // aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Client: <span className="text-red-500">*</span>
                </label>
                <RoleDropdown
                  users={users}
                  onSelect={(user) => setSelectedClient(user)}
                  role="client"
                  label=""
                  width="w-full"
                  value={selectedClient?.id}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Remark for Client:
                </label>
                <textarea
                  rows={3}
                  value={clientRemark}
                  onChange={(e) => setClientRemark(e.target.value)}
                  placeholder="Add a Remark for the client (optional)"
                  className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowClientForm(false)}
                  className="py-2 px-4 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClientSubmit}
                  className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        {!rfi.resolution_details && !rfi.resolved_at && (
          <>
            <button
              onClick={handleResolveSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Resolve
            </button>

            {/* <button
              onClick={handleSendToClientClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Send to Client
            </button> */}
          </>
        )}

        {/* {errorMsg && (
          <p className="text-red-600 mt-2 text-sm font-semibold">{errorMsg}</p>
        )} */}
      </div>
    </div>
  );
}
