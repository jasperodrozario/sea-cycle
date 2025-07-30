import requests
import json
import time
import random

API_ENDPOINT = "http://localhost:3001/api/iot-data"
BUOY_IDS = ["SC-B-001", "SC-B-002", "SC-B-003"]
BUOY_LOCATIONS = {
    "SC-B-001": {"lat": 22.25, "lon": 91.78},
    "SC-B-002": {"lat": 22.28, "lon": 91.80},
    "SC-B-003": {"lat": 22.26, "lon": 91.82}
}

DATA_GENERATION_INTERVAL = 1
DATA_SEND_INTERVAL = 5


buoy_data_list = []

for buoy_id in BUOY_IDS:
    buoy_data = {
        "buoy_id": buoy_id,
        "fill_level_percent": random.randint(0, 10),
        "fill_status": "Normal",
        "gps": {
            "latitude": BUOY_LOCATIONS[buoy_id]["lat"],
            "longitude": BUOY_LOCATIONS[buoy_id]["lon"]
        }
    }
    buoy_data_list.append(buoy_data)

def get_status(fill_level):
    if fill_level > 100:
        fill_status = "Overflowing"
    elif fill_level <= 100 and fill_level >= 80:
        fill_status = "Critical"    # Turning full status to True when fill level reaches or exceeds 100
    elif fill_level < 80 and fill_level >= 40:
        fill_status = "Elevated"
    elif fill_level < 40 and fill_level >= 0:
        fill_status = "Normal"
    else:
        fill_status = "Error"
    return fill_status

def generate_data(buoy_data_list):    
    for buoy_data in buoy_data_list:
        if buoy_data["fill_level_percent"] <= 100:
            # Slowly increasing fill level, with some randomness
            buoy_data["fill_level_percent"] += random.uniform(0.1, 0.5)
            buoy_data["fill_status"] = get_status(buoy_data["fill_level_percent"])

            # Adding drift to simulate realism of buoy location data
            base_location = BUOY_LOCATIONS[buoy_data["buoy_id"]]
            drift_lat = random.uniform(-0.0005, 0.0005)
            drift_lon = random.uniform(-0.0005, 0.0005)
            buoy_data["gps"]["latitude"] = round(base_location["lat"] + drift_lat, 4)
            buoy_data["gps"]["longitude"] = round(base_location["lon"] + drift_lon, 4)
        else:
            buoy_data["fill_level_percent"] = 0
            print("Bin emptied and waste collected.")
    return buoy_data_list

def post_batch_data(payload_list):
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(API_ENDPOINT, data=json.dumps(payload_list), headers=headers)
        print(f"--> SENT batch of {len(payload_list)} buoy data.")
        print(f"    Response: {response.status_code} - {response.json().get('message')}\n")
    except requests.exceptions.ConnectionError as e:
        print(f"Connection error: Make sure the API server is running. {e}\n")

last_send_time = 0
while True:
    payload_list = generate_data(buoy_data_list)
    current_time = time.time()
    if current_time - last_send_time > DATA_SEND_INTERVAL:
        post_batch_data(payload_list)
        last_send_time = current_time

    time.sleep(DATA_GENERATION_INTERVAL)