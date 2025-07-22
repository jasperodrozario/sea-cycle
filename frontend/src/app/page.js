"use client";

import { useState, useEffect } from "react";
import { fetchBuoyData } from "@/services/api";

export default function HomePage() {
  cosnt[(buoyData, setBuoyData)] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBuoyData = async () => {
      setLoading(true);
      const data = await fetchBuoyData();
      console.log(`Fetched data: ${data}`);
      setBuoyData(data);
      setLoading(false);
    };

    getBuoyData();

    const interval = setInterval(() => {
      getBuoyData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Sea-Cycle Dashboard</h1>

      <div className="p-4 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold">Live Buoy Data</h2>
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <ul>
            {buoys.map((buoy) => (
              <li key={buoy.buoy_id}>
                Buoy ID: {buoy.buoy_id} - Status: {buoy.fill_status} (
                {buoy.fill_level_percent}%)
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
