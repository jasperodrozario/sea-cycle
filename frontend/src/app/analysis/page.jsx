"use client";

import { useState } from "react";
import ImageUploader from "@/components/ui/ImageUploader";
import AnalysisVisualizer from "@/components/ui/AnalysisVisualizer";

export default function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleUploadSuccess = (data) => {
    setAnalysisResult(data);
  };

  return (
    <main className="p-8 navbar-offset">
      <h1 className="text-3xl font-bold mb-4">Debris Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Upload Image for Analysis
          </h2>
          <ImageUploader onUploadSuccess={handleUploadSuccess} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
          {analysisResult ? (
            <AnalysisVisualizer
              imageSrc={analysisResult.imageUrl}
              debrisData={analysisResult.debrisData}
            />
          ) : (
            <div className="h-full w-full border rounded-md bg-gray-50 flex items-center justify-center">
              <p>Upload an image to see the analysis.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
