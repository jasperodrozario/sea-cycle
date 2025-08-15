"use client";
import React, { useState } from "react";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const CLOUDINARY_CLOUD_NAME = "dpmcp02nj";
  const CLOUDINARY_UPLOAD_PRESET = "ml_default";

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    if (!file) {
      setError("Please select an image file first.");
      return;
    }

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
        { method: "POST", body: formData }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        throw new Error("Image URL not returned from Cloudinary.");
      }
      setUploadedImageUrl(imageUrl);
      console.log("Uploaded to Cloudinary:", imageUrl);

      const payload = {
        imageUrl: imageUrl,
        gps: { latitude: latitude, longitude: longitude },
      };

      // SEND PAYLOAD TO BACKEND FOR ANALYSIS
      const analysisResponse = await fetch(
        "http://localhost:3001/api/analyze-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Latitude
          </label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="22.12"
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Longitude
          </label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="91.85"
            required
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Upload Image
          </label>

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md inline-block transition-colors"
          >
            Select Drone Image...
          </label>

          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only" // This Tailwind class visually hides the element
            accept="image/jpeg, image/png"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          {file && <span className="ml-4 text-gray-400">{file.name}</span>}
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isUploading ? "Analyzing..." : "Analyze Image"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      {uploadedImageUrl && (
        <p className="text-green-400 mt-4">Successfully uploaded image!</p>
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
