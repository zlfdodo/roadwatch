// MapPanel.jsx
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { displayValue, getColor, getEventIcon, formatDateTime, formatReadableTime } from '../utils/helpers.js'
import * as turf from '@turf/turf'
import { filterEventsNearRouteLine } from '../utils/filterUtils';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const INITIAL_CENTER = [-123.2, 49.6]
const INITIAL_ZOOM = 7.7

function MapPanel({ stations, events, setStations, setEvents, routeLine, corridorPolygon, bboxToZoom, resetWatchOnView, mapRef }) {
  const mapContainerRef = useRef()
  const lastFetchedBBox = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      maxzoom: 14
    });

    mapRef.current = map;

    // Define custom floating legend control
    class LegendControl {
      onAdd(map) {
        this.map = map;

        this.container = document.createElement('div');
        this.container.className = 'legend-floating';

        const button = document.createElement('button');
        button.innerHTML = 'ℹ️';
        button.title = 'Show Legend';
        button.onclick = () => this.openLegendPopup();

        button.style.background = 'none';
        button.style.border = 'none';
        button.style.fontSize = '20px';
        button.style.cursor = 'pointer';
        button.style.padding = '4px';
        button.style.margin = '0';
        button.style.lineHeight = '1';

        this.container.appendChild(button);
        return this.container;
      }

      onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
      }

      openLegendPopup() {
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
        <div style="font-size: 13px; line-height: 1.5;">
          <strong>Legend</strong><br/>
          <b>Condition:</b><br/>
          <span style="display:inline-block;width:10px;height:10px;background:#2ecc71;border-radius:50%;margin-right:5px;"></span> Good<br/>
          <span style="display:inline-block;width:10px;height:10px;background:#f1c40f;border-radius:50%;margin-right:5px;"></span> Caution<br/>
          <span style="display:inline-block;width:10px;height:10px;background:#e74c3c;border-radius:50%;margin-right:5px;"></span> Dangerous<br/>
          <span style="display:inline-block;width:10px;height:10px;background:#bdc3c7;border-radius:50%;margin-right:5px;"></span> No Data<br/>
          <br/>
          <b>Events:</b><br/>
          🚧 Construction<br/>
          🎉 Event<br/>
          🚑 Incident<br/>
          🌧️ Weather<br/>
          🛣️ Road Condition<br/>
        </div>
      `;

        const buttonRect = this.container.getBoundingClientRect();
        const screenX = buttonRect.right + 10;
        const screenY = buttonRect.top + buttonRect.height / 2;

        const container = this.map.getContainer();
        const bounds = container.getBoundingClientRect();
        const point = [screenX - bounds.left, screenY - bounds.top];
        const lngLat = this.map.unproject(point);

        new mapboxgl.Popup({ closeOnClick: true, anchor: 'left' })
          .setLngLat(lngLat)
          .setDOMContent(popupContent)
          .addTo(this.map);
      }
    }

    map.on('load', () => {
      const legend = new LegendControl();
      const ctrlElement = legend.onAdd(map);
      map.getContainer().appendChild(ctrlElement);
    });

    return () => map.remove();
  }, [mapRef]);


  // Data loading
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !setStations || !setEvents || routeLine) return; // ✅ block if routeLine is active

    const loadVisibleData = () => {
      const bounds = map.getBounds();
      const bbox = [
        bounds.getSouth(),
        bounds.getNorth(),
        bounds.getWest(),
        bounds.getEast()
      ].join(',');

      if (bbox === lastFetchedBBox.current) return;
      lastFetchedBBox.current = bbox;

      fetch(`http://localhost:5000/stations?bbox=${bbox}`)
        .then(res => res.json())
        .then(data => setStations(data))
        .catch(err => console.error("Error loading stations:", err));

      fetch(`http://localhost:5000/events?bbox=${bbox}`)
        .then(res => res.json())
        .then(data => setEvents(data))
        .catch(err => console.error("Error loading events:", err));
    };

    map.on('load', loadVisibleData);
    map.on('moveend', loadVisibleData);

    return () => {
      map.off('load', loadVisibleData);
      map.off('moveend', loadVisibleData);
    };
  }, [setStations, setEvents, mapRef, routeLine]);

  // // Render DriveBC weather stations
  // useEffect(() => {
  //   const map = mapRef.current
  //   if (!map || !stations) return

  //   const markerList = stations.map(station => {
  //     const color = getColor(station.hazard)
  //     const el = document.createElement('div')
  //     el.className = 'weather-marker'
  //     el.style.backgroundColor = color
  //     el.style.cursor = 'pointer'

  //     return new mapboxgl.Marker(el)
  //       .setLngLat([station.lon, station.lat])
  //       .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
  //         <strong>${station.name}</strong><br/>
  //         Temp: ${displayValue(station.temp_air, '°C')}<br/>
  //         Precip: ${displayValue(station.precip_mm, 'mm')}<br/>
  //         Snow: ${displayValue(station.snow_depth, 'cm')}<br/>
  //         Wind: ${displayValue(station.wind_mean, 'km/h')}<br/>
  //         <i style="font-size: 12px; color: #ccc;">Updated: ${formatReadableTime(station.timestamp)}</i>
  //       `)).addTo(map)
  //   })

  //   return () => markerList.forEach(marker => marker.remove())
  // }, [stations, mapRef])

  // // Load weather network station location (GeoJSON)
  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (!map) return;

  //   const handleMapLoad = async () => {
  //     const res = await fetch('/assets/bcDataCatalog/WeatherStationNetwork_Point/weather_station_core.geojson');
  //     const data = await res.json();

  //     const bounds = map.getBounds();

  //     const visibleStations = data.features
  //       .map(f => ({
  //         id: f.properties.OBSERVATION_LOCATION_ID || f.id,
  //         name: f.properties.STATION_NAME || 'Unnamed',
  //         lat: f.geometry.coordinates[1],
  //         lon: f.geometry.coordinates[0],
  //       }))
  //       .filter(station =>
  //         station.lat >= bounds.getSouth() &&
  //         station.lat <= bounds.getNorth() &&
  //         station.lon >= bounds.getWest() &&
  //         station.lon <= bounds.getEast()
  //       );

  //     setStations(visibleStations);
  //   };

  //   map.on('load', handleMapLoad);
  //   map.on('moveend', handleMapLoad);

  //   return () => {
  //     map.off('load', handleMapLoad);
  //     map.off('moveend', handleMapLoad);
  //   };
  // }, [mapRef]);

  // // Fetch weather data in batch for all stations
  // useEffect(() => {
  //   if (!stations?.length) return;

  //   const fetchWeatherBatch = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/weather/batch", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(stations.map(({ lat, lon }) => ({ lat, lon })))
  //       });

  //       const weatherData = await res.json();

  //       // match lat/lon back to station names
  //       const enriched = stations.map(station => {
  //         const match = weatherData.find(w =>
  //           Math.abs(w.lat - station.lat) < 0.001 &&
  //           Math.abs(w.lon - station.lon) < 0.001
  //         );
  //         return { ...station, ...(match || {}) };
  //       });

  //       setStations(enriched);
  //     } catch (err) {
  //       console.error("Batch weather fetch failed", err);
  //     }
  //   };

  //   fetchWeatherBatch();

  //   const interval = setInterval(fetchWeatherBatch, 60 * 60 * 1000); // fetch every hour

  //   return () => clearInterval(interval); // cleanup

  // }, [stations]);

  // Render markers from GeoJSON-based station data
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !stations?.length) return;

    const markerList = stations.map(station => {
      const el = document.createElement('div');
      el.className = 'weather-marker';
      el.style.backgroundColor = '#2ecc71'; // green by default
      el.style.cursor = 'pointer';

      return new mapboxgl.Marker(el)
        .setLngLat([station.lon, station.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${station.name}</strong><br/>
        Temp: ${station.temperature_2m ?? '—'} °C<br/>
        Precip: ${station.precipitation ?? '—'} mm<br/>
        Rainfall: ${station.rainfall ?? '—'} mm<br/>
        Snowfall: ${station.snowfall ?? '—'} mm<br/>
        Relative Humidity @2m: ${station.relative_humidity_2m ?? '—'} %<br/>
        Wind Speed @10m: ${station.wind_speed_10m ?? '—'} km/h<br/>
        Wind Direction: ${station.wind_direction_10m ?? '—'}°<br/>
        <i style="font-size: 12px; color: #ccc;">Updated: ${formatReadableTime(station.time)}</i>
      `))
        .addTo(map);
    });

    return () => markerList.forEach(marker => marker.remove());
  }, [stations, mapRef]);


  // Render DriveBC events
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !events.length) return;

    const pointMarkers = [];
    const lineFeatures = [];

    events.forEach(event => {
      const coords = event?.geography?.coordinates;
      if (!Array.isArray(coords)) return;

      let lon = null, lat = null;

      // 1. Single-point [lon, lat] → normal marker
      if (
        coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number'
      ) {
        [lon, lat] = coords;
      }

      // 2. Multi-point [[lon, lat], ...] → line + midpoint marker
      else if (
        coords.length > 1 &&
        Array.isArray(coords[0]) &&
        typeof coords[0][0] === 'number'
      ) {
        // Add the line feature
        lineFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords
          },
          properties: {
            id: event.id,
            severity: event.severity,
            type: event.event_type,
            headline: event.headline
          }
        });

        // Get midpoint for marker
        const midIndex = Math.floor(coords.length / 2);
        [lon, lat] = coords[midIndex];
      }

      // If we have a valid point (either single or midpoint)
      if (lon !== null && lat !== null) {
        const icon = getEventIcon(event.event_type);
        const el = document.createElement('div');
        el.className = 'event-marker';
        el.textContent = icon;
        el.style.cursor = 'pointer';

        const baseIcon = getEventIcon(event.event_type);
        el.textContent = baseIcon;
        el.style.cursor = 'pointer';

        // Add severity dot class
        const severity = event.severity?.toLowerCase();
        if (severity === 'minor') el.classList.add('event-minor');
        else if (severity === 'moderate') el.classList.add('event-moderate');
        else if (severity === 'major') el.classList.add('event-major');
        else if (severity === 'unknown') el.classList.add('event-unknown');

        const road = event.roads?.[0] || {};
        let scheduleFrom = 'N/A', scheduleTo = 'N/A';

        if (event.schedule?.intervals?.length > 0) {
          const [from, to] = event.schedule.intervals[0].split('/');
          scheduleFrom = formatDateTime(from);
          scheduleTo = formatDateTime(to);
        } else if (event.schedule?.recurring_schedules?.length > 0) {
          const sched = event.schedule.recurring_schedules[0];
          scheduleFrom = formatDateTime(`${sched.start_date}T${sched.daily_start_time}`);
          scheduleTo = formatDateTime(`${sched.end_date}T${sched.daily_end_time}`);
        }

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lon, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <strong>${event.headline}</strong><br/>
          <b>Road:</b> ${road.name ?? 'Unknown'} ${road.direction ?? ''} (${road.from ?? '—'} → ${road.to ?? '—'})<br/>
          <b>Type:</b> ${event.event_type}<br/>
          <b>Subtype:</b> ${event.event_subtypes}<br/>
          <b>Schedule:</b> ${scheduleFrom} → ${scheduleTo}<br/>
          <b>Severity:</b> ${event.severity}</br>
          <i style="font-size: 12px; color: #ccc;">Updated: ${formatReadableTime(event.updated)}</i>
        `))
          .addTo(map);

        pointMarkers.push(marker);
      }
    });

    // Add GeoJSON line layer (multi-event segments)
    const sourceId = 'event-lines';

    if (lineFeatures.length) {
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData({
          type: 'FeatureCollection',
          features: lineFeatures
        });
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: lineFeatures
          }
        });

        map.addLayer({
          id: sourceId,
          type: 'line',
          source: sourceId,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': [
              'match',
              ['get', 'severity'],
              'MINOR', '#fff708',
              'MODERATE', '#e67e22',
              'MAJOR', '#ff0c08',
              'UNKNOWN', 'gray',
              '#999999'               // fallback gray
            ],
            'line-width': 4,
            'line-opacity': 1.0
          }
        });
      }
    }

    return () => {
      pointMarkers.forEach(marker => marker.remove());

      if (map.getLayer(sourceId)) {
        map.removeLayer(sourceId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [events, mapRef]);


  // Draw route
  useEffect(() => {
    const map = mapRef.current
    if (!map || !routeLine) return

    const id = 'route-line'
    if (!map.getSource(id)) {
      map.addSource(id, { type: 'geojson', data: routeLine })
      map.addLayer({
        id,
        type: 'line',
        source: id,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ff6600', 'line-width': 4, 'line-opacity': 0.9 }
      })
    } else {
      map.getSource(id).setData(routeLine)
    }

    map.fitBounds(turf.bbox(routeLine), { padding: 40 })

    return () => {
      if (map.getLayer(id)) map.removeLayer(id)
      if (map.getSource(id)) map.removeSource(id)
    }
  }, [routeLine, mapRef])

  // Filter events near route line
  useEffect(() => {
    if (!routeLine) return;

    const fetchAndFilterEvents = async () => {
      const res = await fetch("http://localhost:5000/events");
      const allEvents = await res.json();
      const filtered = filterEventsNearRouteLine(allEvents, routeLine, 1); // 1 km buffer
      setEvents(filtered);
    };

    fetchAndFilterEvents();
  }, [routeLine]);

  // Zoom to bbox
  useEffect(() => {
    const map = mapRef.current
    if (!map || !bboxToZoom) return
    map.fitBounds(bboxToZoom, { padding: 40 })
  }, [bboxToZoom, mapRef])

  const Reset = () => {
    if (resetWatchOnView) resetWatchOnView()
    mapRef.current.flyTo({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM })
  }

  return (
    <section className="map-panel">
      <button className="reset-button" onClick={Reset}>Reset</button>
      <div id="map-container" ref={mapContainerRef}></div>
    </section>
  )
}

export default MapPanel
