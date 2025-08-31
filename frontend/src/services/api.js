// Fetches real-time buoy data
export const fetchBuoyData = async () => {
  const url = "http://localhost:3001/api/iot-data";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch buoy data: ", error);
    return [];
  }
};

// Fetches all the available missions
export const fetchMissions = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/missions");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch missions:", error);
    return [];
  }
};

// Fetches analysis results that have not yet been assigned to a mission
export const fetchUnassignedHotspots = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/analyses/unassigned"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch hotspots:", error);
    return [];
  }
};

// Fetches all users with the 'CollectionCrew' role
export const fetchCrews = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/users/crews");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch crews:", error);
    return [];
  }
};

// Posts the data to create a new mission
export const createMission = async (missionData) => {
  try {
    const response = await fetch("http://localhost:3001/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(missionData),
    });
    if (!response.ok) throw new Error("Failed to create mission");
    return await response.json();
  } catch (error) {
    console.error("Failed to create mission:", error);
    throw error;
  }
};
