import requests
import html

# Util: Haversine not needed since we're using bounding boxes now
def parse_float(value):
    try:
        return float(value.split()[0])
    except:
        return None

def is_within_bounds(lat, lon, lat_min, lat_max, lon_min, lon_max):
    return lat_min <= lat <= lat_max and lon_min <= lon <= lon_max


# 1. FETCH AND RETURN ALL EVENTS (without pre-filtering)
def fetch_all_drivebc_events():
    url = "https://api.open511.gov.bc.ca/events?format=json&jurisdiction=drivebc.ca"
    response = requests.get(url)
    data = response.json()
    return data.get('events', [])


# 2. FILTER EVENTS BY BBOX
def filter_events_by_bbox(events, lat_min, lat_max, lon_min, lon_max):
    def event_in_bounds(event):
        try:
            for lon, lat in event.get("geography", {}).get("coordinates", []):
                if is_within_bounds(lat, lon, lat_min, lat_max, lon_min, lon_max):
                    return True
        except:
            return False
    return [e for e in events if event_in_bounds(e)]


# 3. FETCH ALL WEATHER
def fetch_all_drivebc_weather():
    url = f"https://drivebc.ca/api/weather/observations?format=json"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # will raise for 404/500 errors

        try:
            weather = response.json()
        except ValueError:
            print("Failed to parse JSON from DriveBC. Response content:")
            print(response.text)
            return []

    except requests.exceptions.RequestException as e:
        print(f"Error fetching DriveBC weather: {e}")
        return []

    weather_data = []
    for entry in weather:
        s = entry.get("station", {})
        lat = parse_float(s.get("lat"))
        lon = parse_float(s.get("lon"))
        skipped = 0
        if lat is None or lon is None:
            skipped += 1
            print(f"Warning: Skipped stations with invalid lat/lon: {skipped}:{s.get('name')}")
            continue
        parsed = {
            "name": s.get("name"),
            "lat": lat,
            "lon": lon,
            "temp_air": parse_float(html.unescape(s.get("airTemp", ""))),
            "temp_road": parse_float(html.unescape(s.get("roadTemp", ""))),
            "snow_depth": parse_float(html.unescape(s.get("snowDepth", ""))),
            "precip_mm": parse_float(html.unescape(s.get("precip", ""))),
            "wind_mean": parse_float(html.unescape(s.get("windMean", ""))),
            "description": s.get("description"),
            "timestamp": s.get("date")
        }
        weather_data.append(parsed)

    return weather_data


# 4. FILTER WEATHER BY BBOX
def filter_weather_by_bbox(weather_data, lat_min, lat_max, lon_min, lon_max):
    return [
        s for s in weather_data
        if is_within_bounds(s["lat"], s["lon"], lat_min, lat_max, lon_min, lon_max)
    ]
