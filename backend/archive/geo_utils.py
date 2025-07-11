from math import radians, cos, sin, sqrt, atan2

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))

def assign_stations_to_segments(stations, segments):
    grouped = {seg['name']: [] for seg in segments}
    for station in stations:
        min_dist = float("inf")
        closest_seg = None
        for seg in segments:
            dist = haversine(station['lat'], station['lon'], seg['lat'], seg['lon'])
            if dist < min_dist:
                min_dist = dist
                closest_seg = seg['name']
        grouped[closest_seg].append(station)
    return grouped
