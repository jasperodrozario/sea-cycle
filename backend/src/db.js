const mongoose = require("mongoose");
const { InfluxDB } = require("@influxdata/influxdb-client");

// --- InfluxDB Connection ---
const influxUrl = "http://localhost:8086";
const influxToken =
  "P83GZ5CSAXIftDdrjpWyRyVhuPWa5kZ6InPAm4DJUva_KAnuORjjoEsWy0U5SEba62SIhCn_6nA6WMXGgRFOgA==";
const influxOrg = "SeaCycleOrg";
const influxBucket = "iot_data";

const influxDB = new InfluxDB({ url: influxUrl, token: influxToken });

const writeApi = influxDB.getWriteApi(influxOrg, influxBucket);
console.log("InfluxDB write api ready");

const queryApi = influxDB.getQueryApi(influxOrg);
console.log("InfluxDB query api ready");

// --- MongoDB Connection ---
const mongoUrl = "mongodb://localhost:27017/sea-cycle";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

module.exports = { writeApi, queryApi }; // We only need to export the writeApi for now
