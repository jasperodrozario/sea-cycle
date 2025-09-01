const express = require("express");
const cors = require("cors");
const app = express();
const { writeApi, queryApi, connectDB } = require("./db"); // Importing InfluxDB write API
const { Point } = require("@influxdata/influxdb-client");
const { analyzeImageForDebris } = require("./services/aiService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { categorizeDebris } = require("./utils/debrisUtils");

// Model Imports
const Analysis = require("./models/Analysis");
const User = require("./models/User");
const Mission = require("./models/Mission");

// Middleware
const { auth, admin } = require("./middleware/authMiddleware");

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

// POST endpoint for an Admin to create any type of user
app.post("/api/users/create-by-admin", [auth, admin], async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Role Validation
    if (!["Authority", "CollectionCrew", "Citizen"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role,
    });

    await user.save();
    res.status(201).json({
      message: `User '${name}' created successfully with role '${role}'.`,
    });
  } catch (error) {
    console.error("Admin User Creation Error:", error);
    res.status(500).json({ message: "Server error during user creation." });
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

// GET: Endpoint to fetch historical IoT data for a specific buoy over a time range
app.get("/api/iot-data/history", async (req, res) => {
  console.log("GET /api/iot-data/history request received");
  const { buoyId, timeRange } = req.query;

  if (!buoyId || !timeRange) {
    return res
      .status(400)
      .json({ message: "Buoy ID and time range are required." });
  }

  let range;
  switch (timeRange) {
    case "1h":
      range = "-1h";
      break;
    case "6h":
      range = "-6h";
      break;
    case "24h":
      range = "-24h";
      break;
    case "7d":
      range = "-7d";
      break;
    case "30d":
      range = "-30d";
      break;
    default:
      range = "-24h"; // Default to 24 hours if invalid range
  }

  try {
    const fluxQuery = `
      from(bucket: "iot_data")
        |> range(start: ${range})
        |> filter(fn: (r) => r["_measurement"] == "buoy" and r["buoy_id"] == "${buoyId}" and r["_field"] == "fill_level_percent")
        |> aggregateWindow(every: 30m, fn: mean, createEmpty: false)
        |> keep(columns: ["_time", "_value", "buoy_id"])
        |> rename(columns: {_value: "fill_level_percent"})
        |> sort(columns: ["_time"])
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

    const buoy_history_data = results.map((result) => ({
      buoy_id: result.buoy_id,
      fill_level_percent: result.fill_level_percent,
      timestamp: result._time, // Include timestamp for historical data
    }));

    res.status(200).json(buoy_history_data);
  } catch (error) {
    console.error("Error fetching historical buoy data:", error);
    res.status(500).json({ message: "Failed to fetch historical data." });
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
      overallAssessment: analysisResult.overall_assessment,
      debrisData: analysisResult.debris,
      debrisCount: analysisResult.debris_count,
    });

    // Add timeout handling for the save operation
    const savePromise = newAnalysis.save();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Database save operation timed out")),
        15000
      )
    );

    await Promise.race([savePromise, timeoutPromise]);
    console.log("Analysis result successfully saved to MongoDB");
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Error during image analysis or save:", error);
    if (error.message.includes("buffering timed out")) {
      res.status(500).json({
        message:
          "Database connection issue. Please ensure MongoDB is running and accessible.",
      });
    } else {
      res.status(500).json({ message: error.message });
    }
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

// GET endpoint to fetch a categorized summary of all analyses
// app.get("/api/analyses/summary", async (req, res) => {
//   try {
//     // 1. Fetching all documents from the database
//     const allAnalyses = await Analysis.find({})
//       .select("analysisDate imageUrl imageLocation debrisData") // Selecting required fields
//       .sort({ analysisDate: -1 }); // Sorting by newest first

//     // 2. Processing the raw data into the desired summary format
//     const summarizedData = allAnalyses.map((analysis) => {
//       const summary = {}; // Category count object

//       // Looping through each piece of debris in the analysis
//       analysis.debrisData.forEach((debrisItem) => {
//         const category = categorizeDebris(debrisItem.item);
//         // If the category already exists in the summary, increment its count. Otherwise, set it to 1.
//         summary[category] = (summary[category] || 0) + 1;
//       });

//       // 3. Returning a clean object with just the data we need for the chart
//       return {
//         _id: analysis._id,
//         analysisDate: analysis.analysisDate,
//         imageUrl: analysis.imageUrl,
//         imageLocation: analysis.imageLocation,
//         summary: summary, // The final categorized counts
//       };
//     });

//     res.json(summarizedData);
//   } catch (error) {
//     console.error("Error fetching analysis summary:", error);
//     res.status(500).json({ message: "Failed to fetch analysis summary." });
//   }
// });

// GET endpoint to fetch all missions
app.get("/api/missions", async (req, res) => {
  try {
    // Populate 'assignedCrew' to get the crew member's name instead of just their ID
    const missions = await Mission.find()
      .populate("assignedCrew", "name")
      .sort({ creationDate: -1 });
    res.json(missions);
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ message: "Failed to fetch missions" });
  }
});

// POST endpoint to create a new mission
app.post("/api/missions", async (req, res) => {
  const { assignedCrew, analysisHotspots, notes } = req.body;

  try {
    const newMission = new Mission({
      assignedCrew,
      analysisHotspots,
      notes,
      status: "Dispatched",
    });
    await newMission.save();

    if (analysisHotspots && analysisHotspots.length > 0) {
      await Analysis.updateMany(
        { _id: { $in: analysisHotspots } }, // Find all documents whose ID is in our list
        { $set: { acknowledged: true } } // Set their 'acknowledged' field to true
      );
      console.log(`Acknowledged ${analysisHotspots.length} hotspots.`);
    }
    // -------------------------------------------------

    res.status(201).json(newMission);
  } catch (error) {
    console.error("Error creating mission:", error);
    res.status(500).json({ message: "Failed to create mission" });
  }
});

// GET endpoint to fetch unassigned analysis hotspots
app.get("/api/analyses/unassigned", async (req, res) => {
  try {
    // Find analyses that have not been acknowledged yet
    const hotspots = await Analysis.find({ acknowledged: false });
    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotspots" });
  }
});

// GET endpoint to fetch all users with the 'CollectionCrew' role
app.get("/api/users/crews", async (req, res) => {
  try {
    const crews = await User.find({ role: "CollectionCrew" }).select("name");
    res.json(crews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch crews" });
  }
});

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
