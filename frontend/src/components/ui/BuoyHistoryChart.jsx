"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchBuoyHistoryData, fetchBuoyData } from "@/services/api"; // Assuming fetchBuoyData can give us all buoy IDs
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuoyHistoryChart() {
  const [buoyId, setBuoyId] = useState("");
  const [timeRange, setTimeRange] = useState("24h");
  const [historyData, setHistoryData] = useState([]);
  const [availableBuoyIds, setAvailableBuoyIds] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    const getBuoyIds = async () => {
      try {
        const data = await fetchBuoyData();
        const ids = [...new Set(data.map((buoy) => buoy.buoy_id))];
        setAvailableBuoyIds(ids);
        if (ids.length > 0 && !buoyId) {
          setBuoyId(ids[0]); // Set the first buoy as default
        }
      } catch (error) {
        console.error("Failed to fetch buoy IDs:", error);
      }
    };
    // Fetch buoy IDs only once on component mount
    getBuoyIds();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (buoyId) {
      const getHistory = async () => {
        setIsChartLoading(true);
        try {
          const data = await fetchBuoyHistoryData(buoyId, timeRange);
          // Format data for Recharts (parse timestamp and fill_level_percent)
          const formattedData = data.map((d) => ({
            ...d,
            timestamp: new Date(d.timestamp).toLocaleString(), // Format for display
            fill_level_percent: parseFloat(d.fill_level_percent),
          }));
          setHistoryData(formattedData);
        } catch (error) {
          console.error("Failed to fetch buoy history data:", error);
        } finally {
          setIsChartLoading(false);
        }
      };
      getHistory();
      const interval = setInterval(getHistory, 300000); // Refresh every 5 minutes (300000 ms)
      return () => clearInterval(interval);
    }
  }, [buoyId, timeRange]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className={"text-xl font-extrabold mb-4"}>
          Buoy Fill Level History
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            Buoy ID
            <Select onValueChange={setBuoyId} value={buoyId}>
              <SelectTrigger id="buoy-select" className="w-full">
                <SelectValue placeholder="Select a buoy" />
              </SelectTrigger>
              <SelectContent>
                {availableBuoyIds.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            Time Range
            <Select onValueChange={setTimeRange} value={timeRange}>
              <SelectTrigger id="time-range-select" className="w-full">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1 Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isChartLoading ? (
          <div className="flex items-center justify-center h-[80%] text-muted-foreground">
            Loading historical data...
          </div>
        ) : historyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <LineChart
              data={historyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis
                domain={[0, 110]} // Set static max to 110
                label={{
                  value: "Fill Level %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="fill_level_percent"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[80%] text-muted-foreground">
            No data available for the selected buoy and time range.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
