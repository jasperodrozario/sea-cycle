"use client";

import { useState, useEffect } from "react";
import { fetchBuoyData } from "@/services/api";
import BuoyTable from "@/components/ui/BuoyTable";
import MaintenanceAlerts from "@/components/ui/MaintenanceAlerts";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [buoys, setBuoys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/Map"), {
        loading: () => <Skeleton className="h-full w-full" />,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchBuoyData();
        console.log("Fetched data:", data);
        setBuoys(data);
      } catch (error) {
        console.error("Failed to fetch buoy data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 navbar-offset">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Buoy Monitoring Dashboard</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1 h-[600px] w-full border rounded-lg bg-card shadow-sm">
          <Map buoys={buoys} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Detailed Buoy Status</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-full border rounded-lg bg-card shadow-sm">
                <p className="text-muted-foreground">Loading buoy data...</p>
              </div>
            ) : (
              <BuoyTable buoys={buoys} />
            )}
          </div>
          <div>
            <MaintenanceAlerts />
          </div>
        </div>
      </div>
    </main>
  );
}
