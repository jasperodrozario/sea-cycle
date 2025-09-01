"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchBuoyData } from "@/services/api";
import BuoyTable from "@/components/ui/BuoyTable";
import MaintenanceAlerts from "@/components/ui/MaintenanceAlerts";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BuoyHistoryChart from "@/components/ui/BuoyHistoryChart";

export default function DashboardPage() {
  const [buoys, setBuoys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in"); // Redirect to login if no token is found
    } else {
      setIsAuthenticated(true); // If a token exists, allow the page to render
    }
  }, [router]);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/ui/Map"), {
        loading: () => <Skeleton className="h-full w-full" />,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    // Only start fetching data if the user is authenticated
    if (!isAuthenticated) return;

    const getData = async () => {
      try {
        const data = await fetchBuoyData();
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
  }, [isAuthenticated]); // This effect depends on the authentication status

  // This prevents the dashboard from flashing before the redirect happens
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verifying authentication...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#e8f8fa] py-10 navbar-offset">
      <div className="container-main">
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
                <BreadcrumbPage className="text-cyan-500 hover:text-cyan-400">
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-extrabold text-cyan-600 mt-4">
            Buoy Monitoring Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            View and monitor real-time buoy data with automatically generated
            statistical data
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-1 h-[600px] w-full border rounded-lg bg-card shadow-sm relative">
            <Map buoys={buoys} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center h-full border rounded-lg bg-card shadow-sm">
                  <p className="text-muted-foreground">Loading buoy data...</p>
                </div>
              ) : (
                <BuoyTable buoys={buoys} />
              )}
            </div>
            <div className="h-[290px]">
              <MaintenanceAlerts className="h-full" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-1 mt-6">
          <div className="lg:col-span-1 h-[500px] w-full">
            <BuoyHistoryChart />
          </div>
        </div>
      </div>
    </main>
  );
}
