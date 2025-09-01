const mongoose = require("mongoose");
const { InfluxDB } = require("@influxdata/influxdb-client");

// --- InfluxDB Connection ---
const influxUrl = "http://localhost:8086";
// Windows-PC influxdb api token
const influxToken =
  "P83GZ5CSAXIftDdrjpWyRyVhuPWa5kZ6InPAm4DJUva_KAnuORjjoEsWy0U5SEba62SIhCn_6nA6WMXGgRFOgA==";
// Linux-PC influxdb api token
// const influxToken = "Zu8-TkdR6zSqOJkyCFSGr4_SfCuRCakkEcMmSJhieVB9cYZey1S6qHhiXm2IbBd8VkhUxdgMA57rz3wqS8dQXw==";

const influxOrg = "SeaCycleOrg";
const influxBucket = "iot_data";
const influxDB = new InfluxDB({ url: influxUrl, token: influxToken });

const writeApi = influxDB.getWriteApi(influxOrg, influxBucket);
console.log("InfluxDB write api ready");

const queryApi = influxDB.getQueryApi(influxOrg);
console.log("InfluxDB query api ready");

// --- MongoDB Connection ---
const mongoUrl = "mongodb://localhost:27017/sea-cycle";
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = { writeApi, queryApi, connectDB };
