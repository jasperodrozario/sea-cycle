import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Fetches real-time buoy data
export const fetchBuoyData = async () => {
  const response = await api.get("/api/iot-data");
  return response.data;
};

export const fetchBuoyHistoryData = async (buoyId, timeRange) => {
  const response = await api.get(
    `/api/iot-data/history?buoyId=${buoyId}&timeRange=${timeRange}`
  );
  return response.data;
};

// Fetches all the available missions
export const fetchMissions = async () => {
  try {
    const response = await api.get("/api/missions");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch missions:", error);
    return [];
  }
};

// Fetches analysis results that have not yet been assigned to a mission
export const fetchUnassignedHotspots = async () => {
  try {
    const response = await api.get("/api/analyses/unassigned");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch hotspots:", error);
    return [];
  }
};

// Fetches all users with the 'CollectionCrew' role
export const fetchCrews = async () => {
  try {
    const response = await api.get("/api/users/crews");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch crews:", error);
    return [];
  }
};

// Posts the data to create a new mission
export const createMission = async (missionData) => {
  try {
    const response = await api.post("/api/missions", missionData);
    return response.data;
  } catch (error) {
    console.error("Failed to create mission:", error);
    throw error;
  }
};
