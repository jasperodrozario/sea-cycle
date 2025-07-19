const express = require("express");
const app = express();
const { writeApi } = require("./db"); // Importing InfluxDB write API
const { Point } = require("@influxdata/influxdb-client");

port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Main welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sea-Cycle API" });
});

// The endpoint to receive IoT data
app.post("/api/iot-data", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);

  // Creating a new data point for InfluxDB
  const point = new Point("waste_level")
    .tag("buoy_id", data.buoy_id)
    .floatField("fill_level_percent", data.fill_level_percent)
    .floatField("latitude", data.gps.latitude)
    .floatField("longitude", data.gps.longitude)
    .timestamp(new Date());

  // Writing the point to InfluxDB
  writeApi.writePoint(point);
  console.log(`Wrote point for ${data.buoy_id}`);

  res.status(201).json({ message: "Data received successfully" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
