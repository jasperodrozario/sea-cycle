const express = require("express");
const cors = require("cors");
const app = express();
const { writeApi, queryApi } = require("./db"); // Importing InfluxDB write API
const { Point } = require("@influxdata/influxdb-client");
const { analyzeImageForDebris } = require("./services/aiService");
const Analysis = require("./models/Analysis");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

port = 3001;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Main welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sea-Cycle API" });
});

// POST endpoint for new user registration
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user with the hashed password
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Saving the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// POST endpoint for user signin
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Finding the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Comparing the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Creating the JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Signing the token and sending it back
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3h" }, // Token expires in 3 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
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
        .floatField("fill_level_percent", data.fill_level_percent.toFixed(2))
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
