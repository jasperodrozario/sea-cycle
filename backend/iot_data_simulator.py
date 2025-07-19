import requests
import json
import time
import random

API_ENDPOINT = "http://localhost:3000/api/iot-data"
BUOY_IDS = ["SC-B-001", "SC-B-002", "SC-B-003"]
base_fill_levels = {buoy: random.randint(5, 30) for buoy in BUOY_IDS}

def generate_data(buoy_id):
    # Slowly increase fill level, with some randomness
    base_fill_levels[buoy_id] += random.uniform(0.1, 0.5)
    if base_fill_levels[buoy_id] > 100:
        base_fill_levels[buoy_id] = 10 # Reset when full

    data = {
        "buoy_id": buoy_id,
        "fill_level_percent": round(base_fill_levels[buoy_id], 2),
        "gps": {
            # Coordinates around Chittagong coast
            "latitude": round(22.25 + random.uniform(-0.05, 0.05), 4),
            "longitude": round(91.78 + random.uniform(-0.05, 0.05), 4)
        }
    }
    return data

while True:
    try:
        # Pick a random buoy to send data
        buoy = random.choice(BUOY_IDS)
        payload = generate_data(buoy)
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(API_ENDPOINT, data=json.dumps(payload), headers=headers)
        
        print(f"Sending data for {buoy}: {payload}")
        print(f"Response: {response.status_code} - {response.json().get('message')}\n")
        
    except requests.exceptions.ConnectionError as e:
        print(f"Connection error: Make sure the API server is running. {e}\n")
        
    time.sleep(5) # Wait 5 seconds before sending the next data point