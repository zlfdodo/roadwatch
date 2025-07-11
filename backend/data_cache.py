from datetime import datetime, timedelta, timezone
from fetch_data import fetch_all_drivebc_weather, fetch_all_drivebc_events
from hazard import classify_hazard
import requests
import json
from pathlib import Path

CACHE_TTL = timedelta(minutes=5)

# Stations cache
_cached_stations = None
_cache_time_stations = None

# def get_cached_stations_drivebc():
#     global _cached_stations, _cache_time_stations
#     now = datetime.now(timezone.utc)

#     if (_cached_stations is None or _cache_time_stations is None or
#         now - _cache_time_stations > CACHE_TTL):
        
#         _cached_stations = fetch_all_drivebc_weather()
#         for s in _cached_stations:
#             s["hazard"] = classify_hazard(s)

#         _cache_time_stations = now

#     return _cached_stations

def get_cached_stations():
    global _cached_stations, _cache_time_stations
    now = datetime.now(timezone.utc)

    if (_cached_stations is None or _cache_time_stations is None or
        now - _cache_time_stations > timedelta(hours=1)):

        raw = load_static_station_locations()
        enriched = []

        for s in raw:
            weather = get_cached_openmeteo_weather(s["lat"], s["lon"])
            enriched.append({ **s, **weather })

        _cached_stations = enriched
        for s in _cached_stations:
            s["hazard"] = classify_hazard(s)
        _cache_time_stations = now

    return _cached_stations

# Events cache
_cached_events = None
_cache_time_events = None

def get_cached_events():
    global _cached_events, _cache_time_events
    now = datetime.now(timezone.utc)

    if (_cached_events is None or _cache_time_events is None or
        now - _cache_time_events > CACHE_TTL):

        _cached_events = fetch_all_drivebc_events()
        _cache_time_events = now

    return _cached_events

# Open-Meteo cache
_openmeteo_cache = {}
_cache_time_openmeteo = {}

def load_static_station_locations():
    path = Path("../frontend/public/assets/bcDataCatalog/WeatherStationNetwork_Point/weather_station_core.geojson")
    with open(path, "r") as f:
        geojson = json.load(f)

    return [
        {
            "id": f["properties"].get("OBSERVATION_LOCATION_ID") or f["id"],
            "name": f["properties"].get("STATION_NAME", "Unnamed"),
            "lat": f["geometry"]["coordinates"][1],
            "lon": f["geometry"]["coordinates"][0],
        }
        for f in geojson["features"]
    ]

def get_cached_openmeteo_weather(lat, lon):
    key = f"{lat:.4f},{lon:.4f}"
    now = datetime.now(timezone.utc)

    if key in _openmeteo_cache and (now - _cache_time_openmeteo[key]) < timedelta(hours=1):
        return _openmeteo_cache[key]

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ",".join([
            "temperature_2m", "precipitation", "rain", "showers", "snowfall",
            "relative_humidity_2m", "wind_speed_10m", "wind_direction_10m"
        ]),
        "timezone": "America/Los_Angeles"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json().get("current", {})
    except Exception as e:
        print(f"[Open-Meteo] Error: {e}")
        data = {}

    _openmeteo_cache[key] = data
    _cache_time_openmeteo[key] = now

    return data