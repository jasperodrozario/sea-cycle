"use client";
import React, { useState, useEffect } from "react";
import {
  fetchUnassignedHotspots,
  fetchCrews,
  createMission,
} from "@/services/api";

const CreateMissionForm = ({ onMissionCreated }) => {
  const [hotspots, setHotspots] = useState([]);
  const [crews, setCrews] = useState([]);
  const [selectedHotspots, setSelectedHotspots] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch initial data for the form
  useEffect(() => {
    const loadFormData = async () => {
      const hotspotsData = await fetchUnassignedHotspots();
      const crewsData = await fetchCrews();
      setHotspots(hotspotsData);
      setCrews(crewsData);
    };
    loadFormData();
  }, []);

  const handleHotspotChange = (hotspotId) => {
    setSelectedHotspots((prev) =>
      prev.includes(hotspotId)
        ? prev.filter((id) => id !== hotspotId)
        : [...prev, hotspotId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedHotspots.length === 0 || !selectedCrew) {
      setError("Please select at least one hotspot and one crew member.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    const missionData = {
      analysisHotspots: selectedHotspots,
      assignedCrew: selectedCrew,
      notes: notes,
    };

    try {
      await createMission(missionData);
      alert("Mission created successfully!");
      // Reset form
      setSelectedHotspots([]);
      setSelectedCrew("");
      setNotes("");
      onMissionCreated(); // Tell the parent page to refresh its mission list
    } catch (err) {
      setError("Failed to create mission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Plan New Mission
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Hotspots Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unassigned Hotspots
          </label>
          <div className="max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
            {hotspots.length > 0 ? (
              hotspots.map((hotspot) => (
                <div key={hotspot._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={hotspot._id}
                    checked={selectedHotspots.includes(hotspot._id)}
                    onChange={() => handleHotspotChange(hotspot._id)}
                    className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label
                    htmlFor={hotspot._id}
                    className="ml-2 text-sm text-gray-600"
                  >
                    {new Date(hotspot.analysisDate).toLocaleDateString()} -{" "}
                    {hotspot.debrisData.length} items
                  </label>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">
                No new hotspots to assign.
              </p>
            )}
          </div>
        </div>

        {/* Crew Selection */}
        <div className="mb-4">
          <label
            htmlFor="crew-select"
            className="block text-sm font-medium text-gray-700"
          >
            Assign to Crew
          </label>
          <select
            id="crew-select"
            value={selectedCrew}
            onChange={(e) => setSelectedCrew(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
          >
            <option value="">Select a crew...</option>
            {crews.map((crew) => (
              <option key={crew._id} value={crew._id}>
                {crew.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
            placeholder="Add any special instructions for the crew..."
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "Dispatching..." : "Dispatch Mission"}
        </button>
      </form>
    </div>
  );
};

export default CreateMissionForm;
