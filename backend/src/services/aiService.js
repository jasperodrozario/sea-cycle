require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Initialize the Google AI client with the API key from .env file
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing or invalid GEMINI_API_KEY in .env file. Please add your key to backend/.env."
  );
}
const genAI = new GoogleGenerativeAI(apiKey);

// Helper function to fetch an image and convert it to the format Gemini needs
async function urlToGoogleGenerativeAIPart(url, mimeType) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return {
    inlineData: {
      data: Buffer.from(response.data).toString("base64"),
      mimeType,
    },
  };
}

async function analyzeImageForDebris(imageUrl) {
  try {
    // We use the gemini-pro-vision model for image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert in environmental science. Analyze this aerial image of a sea coastline. 
      Identify and list any man-made waste or debris you see. 
      For each item, provide its object name (e.g., 'plastic bottle', 'tire', 'fishing net') and its approximate location as a bounding box [x_min, y_min, x_max, y_max] from 0 to 1.
      Your entire response must be in a structured JSON format, like this: {"debris": [{"item": "plastic bottle", "box": [0.1, 0.2, 0.3, 0.4]}]}. 
      If no debris is found, return an empty debris list.
    `;

    const imagePart = await urlToGoogleGenerativeAIPart(imageUrl, "image/jpeg");

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to make sure it's valid JSON
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image.");
  }
}

module.exports = { analyzeImageForDebris };
