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
app.post("/api/iot-data", async (req, res) => {
  const dataArray = req.body;

  if (!Array.isArray(dataArray)) {
    return res
      .status(400)
      .json({ message: "Request body must be an array of buoy data." });
  }

  console.log(`Received a batch of ${dataArray.length} data points.`);

  // Creating a list of points to write to InfluxDB
  const points = dataArray.map((data) =>
    new Point("waste_level")
      .tag("buoy_id", data.buoy_id)
      .floatField("fill_level_percent", data.fill_level_percent)
      .floatField("latitude", data.gps.latitude)
      .floatField("longitude", data.gps.longitude)
      .timestamp(new Date())
  );

  // Writing all the points to InfluxDB at once
  writeApi.writePoints(points);
  console.log(`Wrote a batch of ${points.length} points.`);

  await writeApi.flush();
  console.log("Batch flushed to InfluxDB");

  res.status(201).json({ message: "Batch data received successfully" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
