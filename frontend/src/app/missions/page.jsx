"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MissionsList from "@/components/ui/MissionsList";
import CreateMissionForm from "@/components/forms/CreateMissionForm"; // Import the new form

export default function MissionsPage() {
  // We add a 'key' to the MissionsList. Changing this key will force it to re-render.
  const [missionListKey, setMissionListKey] = useState(0);

  // This function will be passed to the form. When called, it updates the key.
  const handleMissionCreated = useCallback(() => {
    setMissionListKey((prevKey) => prevKey + 1);
  }, []);

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
                <BreadcrumbPage className="text-cyan-500 hover:text-cyan-400">
                  Missions
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-gray-700 mt-4">
            Mission Control
          </h1>
          <p className="text-gray-500">
            Assign collection crews to AI-detected waste hotspots and monitor
            progress.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Create New Mission Form */}
          <div className="lg:col-span-1">
            <CreateMissionForm onMissionCreated={handleMissionCreated} />
          </div>

          {/* Column 2: Missions List */}
          <div className="lg:col-span-2">
            {/* We pass the key here. When it changes, this component will re-fetch its data. */}
            <MissionsList key={missionListKey} />
          </div>
        </div>
      </main>
    </div>
  );
}
