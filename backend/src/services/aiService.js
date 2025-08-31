require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing or invalid GEMINI_API_KEY in .env file. Please add/update api key to backend/.env."
  );
}
const genAI = new GoogleGenerativeAI(apiKey);

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      You are an expert marine debris detection system. Your task is to analyze this aerial image of sea region.
      Your response MUST be a valid JSON object. Do not include any text before or after the JSON.
      The JSON object must have three keys:
      1. "overall_assessment": A brief, one-sentence summary describing the overall scene, specifically mentioning if there are large heaps or dense patches of waste.
      2. "debris": An array of objects for each distinct man-made recyclable waste item found.
      3. "debris_count": An integer representing the total number of distinct items found.

      Each object in the "debris" array must have two keys:
      1. "item": A string representing the general category of the object. You MUST choose from one of the following categories: 'Plastic', 'Wood', 'Metal', 'Glass', 'Textiles', 'Styrofoam', 'Fishing Gear', 'Organic', 'Other'.
      2. "box": An array of four numbers representing the tightest possible bounding box [x_min, y_min, x_max, y_max] from 0 to 1.

      Example of a valid response for an image with a large pile of trash:

      {
        "overall_assessment": "The image shows a large, dense heap of mixed plastic and organic waste covering the central part of the beach.",
        "debris": [
          {"item": "Plastic", "box": [0.15, 0.25, 0.20, 0.35]},
          {"item": "Wood", "box": [0.50, 0.60, 0.85, 0.90]}
        ],
        "debris_count": 2
      }

      If no debris is found, return a null assessment, a count of 0, and an empty debris list:

      {
        "overall_assessment": null,
        "debris": [],
        "debris_count": 0
      }

      If there is a patch of uncountable Recycled Waste, return "overall_assessment" of the heap of waste, return only "Patch" as the "item" and "box" of "debris" and a count of 1. For example:
      
      {
        "overall_assessment": "The image shows a large, dense heap of mixed plastic and organic waste covering the central part of the beach.",
        "debris": [
          {"item": "Patch", "box": [0.15, 0.25, 0.20, 0.35]}
        ],
        "debris_count": 1
      }
    `;

    const imagePart = await urlToGoogleGenerativeAIPart(imageUrl, "image/webp");

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
