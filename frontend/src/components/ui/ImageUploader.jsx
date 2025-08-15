"use client";

import React, { useState } from "react";

const ImageUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const CLOUDINARY_CLOUD_NAME = "dpmcp02nj";
  const CLOUDINARY_UPLOAD_PRESET = "ml_default";

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    setAnalysisResult(null);
    setUploadedImageUrl("");

    // UPLOAD TO CLOUDINARY
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        throw new Error("Image URL not returned from Cloudinary.");
      }
      setUploadedImageUrl(imageUrl);
      console.log("Uploaded to Cloudinary:", imageUrl);

      // SEND THE NEW URL TO BACKEND FOR ANALYSIS
      const analysisResponse = await fetch(
        "http://localhost:3001/api/analyze-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: imageUrl }),
        }
      );

      const analysisData = await analysisResponse.json();
      if (!analysisResponse.ok) {
        throw new Error(analysisData.message || "Analysis failed.");
      }

      console.log("Analysis Result:", analysisData);
      setAnalysisResult(analysisData);
    } catch (err) {
      console.error("Process failed:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Analyze Drone Image</h2>
      <p className="mb-4">
        Select an image from your computer to upload and analyze.
      </p>

      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
        disabled={isUploading}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
      />

      {isUploading && <p>Uploading and analyzing, please wait...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {uploadedImageUrl && (
        <p className="text-green-400">Successfully uploaded image!</p>
      )}

      {analysisResult && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Analysis Complete</h3>
          <p>Found {analysisResult.debris.length} items.</p>
          <pre className="bg-gray-900 p-2 rounded-md mt-2 text-sm">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
