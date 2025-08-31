"use client";
import React, { useState, useCallback } from "react";
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
    <div className="p-8 bg-gray-100 min-h-screen navbar-offset">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-700">Mission Control</h1>
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
    </div>
  );
}
