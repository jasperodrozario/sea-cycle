"use client";

import { useState } from "react";
import ImageUploader from "@/components/ui/ImageUploader";
import AnalysisVisualizer from "@/components/ui/AnalysisVisualizer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLocation, setImageLocation] = useState("");

  // handler function for ImageUploader component
  const handleUploadSuccess = (data) => {
    setImageUrl(data.imageUrl);
    setImageLocation(data.gps);
    setAnalysisResult(data.analysisData);
  };

  return (
    <div className="min-h-screen bg-[#ebf8fe] navbar-offset py-10">
      <main className="container-main">
        <header className="mb-10 mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-cyan-400">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-cyan-500 hover:text-cyan-400"
                >
                  Analysis
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-extrabold text-cyan-600 mt-4">
            Debris Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Upload a drone image to analyze marine debris and view the results.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                Analysis Results
              </h2>
              {analysisResult ? (
                <AnalysisVisualizer
                  imageSrc={imageUrl}
                  debrisData={analysisResult.debris}
                  imageLocation={imageLocation}
                />
              ) : (
                <div className="h-96 w-full border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center p-4">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="text-gray-500 font-medium">
                    Your analysis results will appear here.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Please upload an image to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
