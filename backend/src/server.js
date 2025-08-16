const express = require("express");
const cors = require("cors");
const app = express();
const { writeApi, queryApi } = require("./db"); // Importing InfluxDB write API
const { Point } = require("@influxdata/influxdb-client");
const { analyzeImageForDebris } = require("./services/aiService");
const Analysis = require("./models/Analysis");

port = 3001;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Main welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sea-Cycle API" });
});

// POST: The endpoint to receive IoT data
app.post("/api/iot-data", async (req, res) => {
  const dataArray = req.body;

  if (!Array.isArray(dataArray)) {
    return res
      .status(400)
      .json({ message: "Request body must be an array of buoy data." });
  }

  console.log(`Received a batch of ${dataArray.length} data points.`);

  // Creating a list of points to write to InfluxDB

  try {
    const points = dataArray.map((data) => {
      return new Point("buoy")
        .tag("buoy_id", data.buoy_id)
        .tag("fill_status", data.fill_status)
        .floatField("fill_level_percent", data.fill_level_percent)
        .floatField("latitude", data.gps.latitude)
        .floatField("longitude", data.gps.longitude)
        .timestamp(new Date());
    });

    writeApi.writePoints(points);
    await writeApi.flush();
    console.log("Batch flushed to InfluxDB");
    res.status(201).json({ message: "Batch data received successfully" });
  } catch (error) {
    console.error("Error writing to InfluxDB:", error);
    res.status(500).json({ message: "Failed to write to database." });
  }
});

// GET: The endpoint to send IoT data
app.get("/api/iot-data", async (req, res) => {
  console.log("GET /api/iot-data request received");
  try {
    // A Flux query to get the single most recent data point for EACH buoy
    const fluxQuery = `
      from(bucket: "iot_data")
        |> range(start: -1d)
        |> filter(fn: (r) => r["_measurement"] == "buoy")
        |> group(columns: ["buoy_id", "_field"])
        |> last()
        |> group()
        |> pivot(
            rowKey:["_time", "buoy_id", "fill_status"], 
            columnKey: ["_field"], 
            valueColumn: "_value"
        )
        |> keep(columns: ["buoy_id", "fill_status", "fill_level_percent", "latitude", "longitude", "_time"])
    `;

    const results = [];
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          results.push(tableMeta.toObject(row));
        },
        error(error) {
          console.error("Query Error:", error);
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    // console.log("Query successful. Results:", results);

    //Convert query data to suitable buoy data
    buoy_data = [];
    results.map((result) => {
      const buoy = {
        buoy_id: result.buoy_id,
        fill_level_percent: result.fill_level_percent,
        fill_status: result.fill_status,
        gps: { latitude: result.latitude, longitude: result.longitude },
      };
      buoy_data.push(buoy);
    });

    // ADDED: Send the results back as a JSON response
    res.status(200).json(buoy_data);
  } catch (error) {
    // This will now catch errors from the promise rejection
    console.error("Error processing request:", error);
    if (!res.headersSent) {
      // Prevent sending multiple responses
      res.status(500).json({ message: "Failed to fetch data" });
    }
  }
});

// POST: endpoint for AI image analysis
app.post("/api/analyze-image", async (req, res) => {
  const { imageUrl, gps } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "imageUrl is required." });
  }

  console.log(`Received image for analysis: ${imageUrl}`);

  try {
    const analysisResult = await analyzeImageForDebris(imageUrl);
    const newAnalysis = new Analysis({
      imageUrl: imageUrl,
      imageLocation: {
        latitude: parseFloat(gps.latitude),
        longitude: parseFloat(gps.longitude),
      },
      debrisData: analysisResult.debris,
    });
    await newAnalysis.save();
    console.log("Analysis result successfully saved to MongoDB");
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Error during image analysis or save:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET endpoint to fetch all saved analyses
app.get("/api/analyses", async (req, res) => {
  try {
    // Find all documents in the 'analyses' collection and sort by newest first
    const allAnalyses = await Analysis.find().sort({ analysisDate: -1 });
    res.json(allAnalyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ message: "Failed to fetch analyses." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
