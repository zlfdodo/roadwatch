from flask import Flask, jsonify, request
from flask_cors import CORS
from fetch_data import filter_events_by_bbox, filter_weather_by_bbox
from data_cache import get_cached_stations, get_cached_events, get_cached_openmeteo_weather


app = Flask(__name__)
CORS(app)


@app.route("/stations")
def get_stations():
    bbox = request.args.get("bbox")

    all_stations = get_cached_stations()

    if bbox:
        try:
            lat_min, lat_max, lon_min, lon_max = map(float, bbox.split(","))
            all_stations = filter_weather_by_bbox(all_stations, lat_min, lat_max, lon_min, lon_max)
        except:
            return jsonify({"error": "Invalid bbox format"}), 400

    return jsonify(all_stations)

@app.route("/events")
def get_events():
    bbox = request.args.get("bbox")

    all_events = get_cached_events()

    if bbox:
        try:
            lat_min, lat_max, lon_min, lon_max = map(float, bbox.split(","))
            all_events = filter_events_by_bbox(all_events, lat_min, lat_max, lon_min, lon_max)
        except:
            return jsonify({"error": "Invalid bbox format"}), 400

    return jsonify(all_events)

@app.route("/api/weather")
def get_weather():
    try:
        lat = float(request.args.get("lat"))
        lon = float(request.args.get("lon"))
    except:
        return jsonify({"error": "Invalid lat/lon"}), 400

    data = get_cached_openmeteo_weather(lat, lon)
    return jsonify(data)

@app.route("/api/weather/batch", methods=["POST"])
def get_batch_weather():
    locations = request.get_json()
    if not isinstance(locations, list):
        return jsonify({"error": "Expected list of lat/lon objects"}), 400

    results = []
    for loc in locations:
        try:
            lat = float(loc["lat"])
            lon = float(loc["lon"])
            weather = get_cached_openmeteo_weather(lat, lon)
            results.append({
                "lat": lat,
                "lon": lon,
                **weather
            })
        except Exception as e:
            print(f"Batch weather fetch failed for {loc}: {e}")

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
