import * as turf from "@turf/turf";
import fs from "fs";

// Load the full station GeoJSON (adjust path as needed)
const fullGeoJSON = JSON.parse(
    fs.readFileSync("../../public/assets/bcDataCatalog/WeatherStationNetwork_Point/TAWP_WEATHER_FROST_STN_POINT.geojson", "utf8")
);

// Keep only 1 station per 20 km radius
const thresholdKm = 20;
const kept = [];

fullGeoJSON.features.forEach(candidate => {
    const candidatePt = turf.point(candidate.geometry.coordinates);

    const isTooClose = kept.some(existing => {
        const existingPt = turf.point(existing.geometry.coordinates);
        const dist = turf.distance(candidatePt, existingPt); // in km
        return dist < thresholdKm;
    });

    if (!isTooClose) kept.push(candidate);
});

const reducedGeoJSON = {
    type: "FeatureCollection",
    features: kept
};

fs.writeFileSync(
    "../../public/assets/bcDataCatalog/WeatherStationNetwork_Point/weather_station_core.geojson",
    JSON.stringify(reducedGeoJSON, null, 2)
);

console.log(`Filtered ${fullGeoJSON.features.length} → ${kept.length} stations`);
