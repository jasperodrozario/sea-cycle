"use client";
import React, { useState, useEffect } from "react";

const RecycleStats = () => {
  const [wasteCollected, setWasteCollected] = useState(12345);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCollected((prev) => prev + Math.floor(Math.random() * 5));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-cyan-100 p-8 md:p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 text-6xl">🌊</div>
          <div className="absolute bottom-4 left-4 text-6xl">♻️</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-30">🌍</div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-600">
              🌊 Real-Time Ocean Impact
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Total Marine Waste Collected and Recycled by Our Global Network
            </p>
          </div>
          
          <div className="bg-cyan-50 rounded-xl p-8 mb-6">
            <div className="text-7xl md:text-8xl font-extrabold text-cyan-600 mb-4">
              {wasteCollected.toLocaleString()}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              kilograms
            </div>
            <div className="flex items-center justify-center gap-2 text-cyan-600 font-semibold tracking-wider">
              <span className="text-lg">⛓️</span>
              <span>VERIFIED ON BLOCKCHAIN</span>
              <span className="text-lg">✅</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Monitoring Active</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-600 mb-1">AI-Powered</div>
              <div className="text-sm text-gray-600">Detection System</div>
            </div>
            <div className="bg-teal-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-teal-600 mb-1">Global</div>
              <div className="text-sm text-gray-600">Network Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecycleStats;
