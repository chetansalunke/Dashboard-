import React from "react";
import UploadDrawingForm from "../../components/designer/UploadDrawingForm";
import BASE_URL from "../../config";
export default function UploadDrawingPage() {
  const selectedProject = JSON.parse(
    localStorage.getItem("selectedProject") || "{}"
  );

  const handleUploadSubmit = async (payload) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${BASE_URL}/api/projects/drawings/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed to upload drawing.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-gray-600 uppercase">
        Upload Drawing
      </h1>
      <UploadDrawingForm
        selectedProject={selectedProject}
        onSubmit={handleUploadSubmit}
        onClose={() => window.history.back()}
      />
    </div>
  );
}
