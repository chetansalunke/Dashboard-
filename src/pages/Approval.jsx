import React, { useState } from "react";
import Header from "../components/Header";

export default function Approval() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      projectName: "Enclave IT Park",
      documentName: "Door Design",
      submissionDate: "21-02-2023",
      sentBy: "Siddharth Nahta",
      priority: "Low",
      status: "Approved",
      documentUrl: "https://example.com/door-design.pdf",
      pendingForm: "19 Days",
      image:
        "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=500",
    },
    {
      id: 2,
      projectName: "The Enclave",
      documentName: "Building Blueprint",
      submissionDate: "25-06-2023",
      sentBy: "John Doe",
      priority: "High",
      status: "Pending",
      documentUrl: "https://example.com/building-blueprint.pdf",
      pendingForm: "10 Days",
      image:
        "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=500",
    },
  ]);

  const statusStyles = {
    Approved: "text-green-700 bg-green-100",
    Pending: "text-orange-700 bg-orange-100",
    Denied: "text-red-700 bg-red-100",
  };

  const handleDownloadButtonClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedDocument) return;

    const updatedDocuments = documents.map((doc) =>
      doc.id === selectedDocument.id ? { ...doc, status: newStatus } : doc
    );

    setDocuments(updatedDocuments);
    setSelectedDocument({ ...selectedDocument, status: newStatus });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Header /> */}
      <main className="p-6">
        <div className="container mx-auto">
          {!selectedDocument ? (
            <div className="overflow-hidden rounded-lg shadow bg-white">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-semibold text-gray-600 uppercase bg-gray-100 border-b">
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Document Name</th>
                    <th className="px-4 py-3">Submission Date</th>
                    <th className="px-4 py-3">Sent by</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Pending Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="text-gray-700 hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={doc.image}
                          alt=""
                        />
                        <p className="font-medium">{doc.projectName}</p>
                      </td>
                      <td className="px-4 py-3">{doc.documentName}</td>
                      <td className="px-4 py-3">{doc.submissionDate}</td>
                      <td className="px-4 py-3">{doc.sentBy}</td>
                      <td className="px-4 py-3">{doc.priority}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-sm font-semibold rounded-full ${
                            statusStyles[doc.status]
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDownloadButtonClick(doc)}
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-4 py-3">{doc.pendingForm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex gap-6 bg-gray-50 p-6 shadow-md rounded-md h-screen">
              <div className="w-2/3 flex flex-col">
                <img
                  src={selectedDocument.image}
                  alt="Document Preview"
                  className="w-full h-full object-cover rounded-md shadow"
                />
                <input
                  type="text"
                  className="mt-4 p-3 border rounded-md"
                  placeholder="Request to Approve..."
                />
              </div>

              <div className="w-1/3 flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Document Details</h3>
                <p>
                  <strong>Project Name:</strong> {selectedDocument.projectName}
                </p>
                <p className="mt-2">
                  <strong>Document Name:</strong>{" "}
                  {selectedDocument.documentName}
                </p>

                <p className="mt-4">
                  <strong>Note:</strong>
                </p>
                <textarea
                  className="w-full flex-1 p-3 border rounded-md"
                  placeholder="Enter a note..."
                />

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleStatusChange("Approved")}
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange("Denied")}
                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>

                <p className="mt-6">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 font-semibold rounded-full ${
                      statusStyles[selectedDocument.status]
                    }`}
                  >
                    {selectedDocument.status}
                  </span>
                </p>

                <button
                  onClick={() => setSelectedDocument(null)}
                  className="mt-6 px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
                >
                  Back to Documents
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
