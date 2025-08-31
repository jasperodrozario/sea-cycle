"use client";
import { useState, useEffect } from "react";
import AnalysisVisualizer from "@/components/ui/AnalysisVisualizer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalysisHistoryPage() {
  const [allAnalyses, setAllAnalyses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [analysesForLocation, setAnalysesForLocation] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  const DEBRIS_COLORS = {
    Plastic: "rgba(255, 99, 132, 0.6)",
    Wood: "rgba(139, 69, 19, 0.6)",
    Metal: "rgba(87, 87, 87, 0.6)",
    Glass: "rgba(0, 255, 255, 0.6)",
    Textiles: "rgba(255, 206, 86, 0.6)",
    Styrofoam: "rgba(255, 94, 0, 0.6)",
    "Fishing Gear": "rgba(75, 192, 192, 0.6)",
    Organic: "rgba(75, 192, 75, 0.6)",
    Other: "rgba(153, 102, 255, 0.6)",
    Patch: "rgba(0, 0, 0, 1)",
  };

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/analyses");
        const data = await res.json();
        setAllAnalyses(data);

        const uniqueLocations = [
          ...new Set(
            data.map(
              (a) => `${a.imageLocation.latitude},${a.imageLocation.longitude}`
            )
          ),
        ];
        setLocations(uniqueLocations);
        const maxCount = data.reduce((max, analysis) => {
          const localMax = analysis.debrisCount;
          return Math.max(max, localMax);
        }, 0);

        setChartOptions({
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: maxCount > 0 ? maxCount + 2 : 10,
            },
          },
          plugins: {
            legend: { display: false },
          },
        });
      } catch (error) {
        console.error("Failed to fetch analyses:", error);
      }
    };
    fetchAnalyses();
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    const [latitude, longitude] = location.split(",").map(parseFloat);
    const filteredAnalyses = allAnalyses.filter(
      (a) =>
        a.imageLocation.latitude === latitude &&
        a.imageLocation.longitude === longitude
    );
    setAnalysesForLocation(filteredAnalyses);

    if (filteredAnalyses.length === 1) {
      handleAnalysisSelection(filteredAnalyses[0]._id);
    } else {
      setSelectedAnalysis(null);
      setChartData({ labels: [], datasets: [] });
    }
  };

  const handleAnalysisSelection = (analysisId) => {
    const analysis = allAnalyses.find((a) => a._id === analysisId);
    setSelectedAnalysis(analysis);

    if (analysis) {
      const debrisCounts = analysis.debrisData.reduce((acc, item) => {
        acc[item.item] = (acc[item.item] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(debrisCounts);
      const data = Object.values(debrisCounts);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Debris Count",
            data: data,
            backgroundColor: labels.map(
              (label) => DEBRIS_COLORS[label] || DEBRIS_COLORS["Other"]
            ),
          },
        ],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#ebf8fe] navbar-offset py-10">
      <main className="container-main">
        <header className="mb-10 mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-cyan-400">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/analysis"
                  className="hover:text-cyan-400"
                >
                  Analysis
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-cyan-500 hover:text-cyan-400">
                  History
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-extrabold text-cyan-600 mt-4">
            Analysis History
          </h1>
          <p className="text-lg text-gray-600">
            Review past debris analysis results.
          </p>
        </header>

        <div className="flex gap-4 mb-8">
          <Select onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[280px] border-cyan-500 text-gray-700">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc, index) => (
                <SelectItem key={index} value={loc}>
                  {`Lat: ${loc.split(",")[0]}, Lon: ${loc.split(",")[1]}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {analysesForLocation.length > 1 && (
            <Select
              onValueChange={handleAnalysisSelection}
              value={selectedAnalysis ? selectedAnalysis._id : ""}
            >
              <SelectTrigger className="w-[280px] border-cyan-500 text-gray-700">
                <SelectValue placeholder="Select an analysis time" />
              </SelectTrigger>
              <SelectContent>
                {analysesForLocation.map((a) => (
                  <SelectItem
                    key={a._id}
                    value={a._id}
                    className={"text-gray-700"}
                  >
                    {new Date(a.analysisDate).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Analysis Details
            </h2>
            {selectedAnalysis ? (
              <div className="space-y-2 text-gray-500">
                <p>
                  <span className="font-semibold">Overall Assessment:</span>{" "}
                  {selectedAnalysis.overallAssessment}
                </p>
                <p>
                  <span className="font-semibold">Total Debris Count:</span>{" "}
                  {selectedAnalysis.debrisCount}
                </p>

                {selectedAnalysis.imageUrl && (
                  <div className="mt-4">
                    <AnalysisVisualizer
                      imageSrc={selectedAnalysis.imageUrl}
                      debrisData={selectedAnalysis.debrisData}
                      imageLocation={selectedAnalysis.imageLocation}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select a location to view analysis details.</p>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg  text-gray-700">
            <h2 className="text-xl font-bold mb-4">Debris Breakdown</h2>
            <div className="h-96 flex items-center justify-center">
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
