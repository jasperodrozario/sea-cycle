"use client";
import React, { useState, useEffect } from "react";

const StatsSection = () => {
  const [wasteCollected, setWasteCollected] = useState(12345);

  // This useEffect creates a simple animation to simulate a live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCollected((prev) => prev + Math.floor(Math.random() * 5));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="stats" className="bg-gray-950 py-24 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Real-Time Impact</h2>
        <p className="text-lg text-gray-400 mb-8">
          Total Marine Waste Collected and Processed
        </p>
        <div className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {wasteCollected.toLocaleString()} kg
        </div>
        <p className="mt-4 text-cyan-400 font-semibold tracking-wider">
          VERIFIED ON BLOCKCHAIN
        </p>
      </div>
    </section>
  );
};

export default StatsSection;
