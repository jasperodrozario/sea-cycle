"use client";

import { useState, useEffect } from "react";
import { fetchBuoyData } from "@/services/api";

export default function HomePage() {
  const [buoyData, setBuoyData] = useState([]);
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
        {loading ? (
          <p>Loading data....</p>
        ) : (
          <ul>
            {buoyData.map((buoy) => (
              <li key={buoy.buoy_id}>
                Buoy ID: {buoy.buoy_id}: {buoy.fill_status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
