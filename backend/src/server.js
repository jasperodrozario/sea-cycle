const express = require("express");
const cors = require("cors");
const app = express();
const { writeApi, queryApi } = require("./db"); // Importing InfluxDB write API
const { Point } = require("@influxdata/influxdb-client");

port = 3001;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Main welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sea-Cycle API" });
});

// POST iot-data: The endpoint to receive IoT data
app.post("/api/iot-data", async (req, res) => {
  const dataArray = req.body;

  if (!Array.isArray(dataArray)) {
    return res
      .status(400)
      .json({ message: "Request body must be an array of buoy data." });
  }

  console.log(`Received a batch of ${dataArray.length} data points.`);

  // Creating a list of points to write to InfluxDB
  const points = dataArray.map((data) => {
    return new Point("buoy_data")
      .tag("buoy_id", data.buoy_id)
      .floatField("fill_level_percent", data.fill_level_percent)
      .tag("fill_status", data.fill_status)
      .floatField("latitude", data.gps.latitude)
      .floatField("longitude", data.gps.longitude)
      .timestamp(new Date());
  });
  console.log(points);
  // Writing all the points to InfluxDB at once
  writeApi.writePoints(points);
  console.log(`Wrote a batch of ${points.length} points.`);

  await writeApi.flush();
  console.log("Batch flushed to InfluxDB");

  res.status(201).json({ message: "Batch data received successfully" });
});

// GET iot-data: The endpoint to send IoT data
app.get("/api/iot-data", async (req, res) => {
  console.log("GET /api/iot-data request received");
  try {
    // A Flux query to get the single most recent data point for EACH buoy
    const fluxQuery = `
      from(bucket: "iot_data")
        |> range(start: -1h) 
        |> filter(fn: (r) => r._measurement == "buoy_data")
        |> group(columns: ["buoy_id"])
        |> last()
        |> group()
    `;

    const results = [];
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          results.push(tableMeta.toObject(row));
        },
        error(error) {
          console.error(error);
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    // Transforming the raw InfluxDB data into our desired clean format
    const buoys = {};
    results.forEach((r) => {
      if (!buoys[r.buoy_id]) {
        // FIX #2: Initialize the buoy object and grab the 'fill_status' tag immediately.
        // It's a tag, so it's available on every row for that buoy.
        buoys[r.buoy_id] = {
          buoy_id: r.buoy_id,
          fill_status: r.fill_status, // Grab the tag here
          gps: {},
        };
      }
      // This part correctly pivots the fields (like fill_level_percent, latitude, etc.)
      buoys[r.buoy_id][r._field] = r._value;
    });

    // Convert the processed object back to an array
    const finalData = Object.values(buoys).map((b) => {
      // This part will now work correctly because b.fill_status exists
      return {
        buoy_id: b.buoy_id,
        fill_level_percent: b.fill_level_percent,
        fill_status: b.fill_status,
        gps: {
          latitude: b.latitude,
          longitude: b.longitude,
        },
      };
    });

    console.log(`Sending ${finalData.length} buoy data points to frontend.`);
    res.json(finalData);
  } catch (error) {
    console.error("Error querying InfluxDB", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
