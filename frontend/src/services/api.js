export const fetchBuoyData = async () => {
  url = "http://localhost:3001/api/iot-data";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch buoy data: ", error);
    return [];
  }
};
