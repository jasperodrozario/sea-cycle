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
    <div className="p-8 bg-white rounded-lg shadow-lg text-gray-800 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Analyze Drone Image
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Latitude
          </label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g., 22.12"
            required
            className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Longitude
          </label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g., 91.85"
            required
            className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Upload Image
          </label>
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 inline-block transition-colors w-full text-center"
          >
            Select Drone Image...
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/jpeg, image/png"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          {file && (
            <span className="mt-2 text-sm text-gray-500 block text-center">
              {file.name}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isUploading ? "Analyzing..." : "Analyze Image"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

      {uploadedImageUrl && (
        <p className="text-green-500 mt-4 text-center">
          Successfully uploaded image!
        </p>
      )}

      {analysisResult && (
        <div className="mt-4">
          <p className="text-green-500 text-center">Analysis Complete</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
