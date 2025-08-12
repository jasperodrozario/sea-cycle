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
    <div className="container bg-white mx-auto px-4 text-center w-200 border rounded-xl">
      <h2 className="text-4xl font-bold mb-4">Real-Time Impact</h2>
      <p className="text-lg text-gray-400 mb-8">
        Total Marine Waste Collected and Recycled
      </p>
      <div className="text-6xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {wasteCollected.toLocaleString()} kg
      </div>
      <p className="mt-4 text-cyan-400 font-semibold tracking-wider">
        VERIFIED ON BLOCKCHAIN
      </p>
    </div>
  );
};

export default RecycleStats;
