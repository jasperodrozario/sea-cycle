const mongoose = require("mongoose");
const { InfluxDB } = require("@influxdata/influxdb-client");

// --- InfluxDB Connection ---
const influxUrl = "http://localhost:8086";
const influxToken =
  "rcSIK7zi9wBiSt6KwIlbdLIS_nnGvDcNLOWWTODiDxSfXZkCg_yEE9pJy-v2L_zYiQW0pGZbg0dRLFWB2_WPHA==";
// "U7vb44R0h0Bkn5tbn6rDV8EWYnsHoW-mBN092jfx7LkDXilce1qVcC4m3iHlw_QniptbTGBQ1MZ0JrXkVY3Uvw==";
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
