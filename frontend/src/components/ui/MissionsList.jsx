"use client";
import React, { useState, useEffect } from "react";
import { fetchMissions } from "@/services/api";

const MissionsList = () => {
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockMissions = [
    {
      _id: "65a4a5e1e6f2c7a8b9c0d1e2",
      missionName: "Pacific Gyre Cleanup",
      status: "Completed",
      assignedCrew: { name: "Crew Alpha" },
      creationDate: "2023-01-15T10:00:00Z",
    },
    {
      _id: "65a4a5e1e6f2c7a8b9c0d1e3",
      missionName: "Atlantic Coast Patrol",
      status: "In Progress",
      assignedCrew: { name: "Crew Bravo" },
      creationDate: "2023-03-20T14:30:00Z",
    },
    {
      _id: "65a4a5e1e6f2c7a8b9c0d1e4",
      missionName: "Mediterranean Survey",
      status: "Planned",
      assignedCrew: { name: "Crew Charlie" },
      creationDate: "2023-05-10T09:00:00Z",
    },
  ];

  useEffect(() => {
    const loadMissions = async () => {
      setIsLoading(true);
      // Use mock data for now, or fetch from API if needed.
      // For this request, we'll prioritize showing dummy data.
      setMissions(mockMissions);
      // const data = await fetchMissions();
      // setMissions(data);
      setIsLoading(false);
    };
    loadMissions();
  }, []);

  // A helper to format the date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <p>Loading missions...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Mission Log</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mission Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Crew
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {missions.length > 0 ? (
              missions.map((mission) => (
                <tr key={mission._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mission.missionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mission.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mission.assignedCrew?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(mission.creationDate)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No missions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MissionsList;
