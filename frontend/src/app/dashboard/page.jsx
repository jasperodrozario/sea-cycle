"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { fetchBuoyData } from "@/services/api";
import ImageUploader from "@/components/ui/ImageUploader";
import AnalysisVisualizer from "@/components/ui/AnalysisVisualizer";

export default function DashboardPage() {
  const [buoys, setBuoys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect will fetch the data every 5 seconds, as before
  useEffect(() => {
    const getData = async () => {
      const data = await fetchBuoyData();
      console.log("Fetched data:", data);
      setBuoys(data);
      setIsLoading(false);
    };
    getData();
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically import the Map component and disable Server-Side Rendering (SSR) for it
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/Map"), {
        loading: () => <p>A map is loading...</p>, // Display a loading message
        ssr: false,
      }),
    []
  );

  return (
    <main className="p-8 navbar-offset">
      <h1 className="text-3xl font-bold mb-4">Sea-Cycle Dashboard</h1>

      {/* We make the container for the map have a fixed height */}
      <div className="h-[600px] w-full border rounded-md bg-gray-50">
        {isLoading ? <p>Loading map and data...</p> : <Map buoys={buoys} />}
      </div>
      <ImageUploader />
    </main>
  );
}
