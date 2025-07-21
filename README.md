# 🌊 Sea-Cycle

### AI-Powered Sea Waste Management with IoT, GIS & Blockchain

**Sea-Cycle** is an innovative prototype for a sustainable sea waste management system. It leverages a modern technology stack to transform the manual, reactive process of waste collection into a proactive, data-driven, and transparent lifecycle. From AI-powered drone detection to a blockchain-verified recycling process, Sea-Cycle aims to create a true circular economy for marine debris.

---

## 🛰️ Key Features

- **AI-Powered Debris Detection:** Uses the Gemini Vision API to analyze drone imagery and automatically detect, classify, and geolocate patches of marine waste.
- **Real-Time IoT Monitoring:** A simulated network of smart buoys provides 24/7 monitoring of waste accumulation in strategic "hotspot" locations.
- **GIS Dashboard & Route Optimization:** An interactive map dashboard (built with Next.js and Leaflet) visualizes all system data and calculates the most efficient collection routes for marine vessels.
- **Blockchain-Verified Chain of Custody:** Uses Hyperledger Fabric to create an immutable, auditable trail for collected waste, from collection to its final "Proof of Recycling" by certified partners.
- **Citizen Engagement:** A mobile app (prototype) allows citizens to report waste and participate in a token-based recycling rewards program.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js, React, Tailwind CSS, Leaflet.js
- **Backend:** Node.js, Express.js
- **Databases:** InfluxDB (for Time-Series IoT Data), MongoDB (for Application Data)
- **AI:** Google Gemini API
- **Blockchain:** Hyperledger Fabric
- **DevOps & Environment:** Docker & Docker Compose

---

## 🚀 Getting Started

Follow these instructions to get a local copy of Sea-Cycle up and running for development and testing.

### Prerequisites

You must have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Python](https://www.python.org/) (v3.8 or later)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd sea-cycle
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    cd ..
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```
4.  **Install Simulator Dependencies:**
    ```bash
    pip install requests
    ```

---

## ▶️ Running the Application

To run the full Sea-Cycle system, you will need to start its four main components in separate terminals from the root `sea-cycle` directory.

1.  **Start the Databases:**
    Make sure Docker Desktop is running. Then, start the MongoDB and InfluxDB containers.

    ```bash
    docker-compose up -d
    ```

2.  **Start the Backend API:**
    (In a new terminal)

    ```bash
    cd backend
    npm run devStart
    ```

    _Your API will be running at `http://localhost:3001`._

3.  **Start the Frontend Dashboard:**
    (In a new terminal)

    ```bash
    cd frontend
    npm run dev
    ```

    _Your dashboard will be running at `http://localhost:3000`._

4.  **Start the IoT Simulator:**
    (In a new terminal)
    ```bash
    python simulator.py
    ```
    _The simulator will now start sending data to your backend API._

### Accessing the Services

- **Sea-Cycle Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Sea-Cycle API:** [http://localhost:3001](http://localhost:3001)
- **InfluxDB UI:** [http://localhost:8086](http://localhost:8086)
- **MongoDB (via Compass):** `mongodb://localhost:27017`

---

## 📂 Project Structure

This project is a monorepo containing the frontend, backend, and supporting scripts.

    /sea-cycle/
    ├── backend/                  # Express.js API
    │   ├── src/
    │   │   ├── db.js
    │   │   └── server.js
    │   └── package.json
    ├── frontend/                 # Next.js Web Dashboard
    │   ├── public/
    │   ├── src/
    │   ├── package.json
    ├── data/                     # Docker volumes (ignored by Git)
    │   ├── influxdb/
    │   └── mongo/
    ├── .gitignore                # Root Git ignore file
    ├── docker-compose.yml        # Docker configuration for databases
    ├── iot_data_simulator.py     # Python script to simulate IoT data
    └── README.md                 # This file

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
