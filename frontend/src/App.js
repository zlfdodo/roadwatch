import { useState, useRef } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'

import MapPanel from './components/MapPanel'
import WeatherPanel from './components/panel_weather/WeatherPanel'
import WatchOnPanel from './components/panel_watchon/WatchOnPanel'
import EventPanel from './components/panel_events/EventPanel'
import Header from './components/Header'
import Footer from './components/Footer'


function App() {
  const [stations, setStations] = useState([])  
  const [events, setEvents] = useState([]);

  const [routeLine, setRouteLine] = useState(null);
  const [corridorPolygon, setCorridorPolygon] = useState(null);
  const [bboxToZoom, setBboxToZoom] = useState(null);

  const mapRef = useRef();

  const [customResetCount, setCustomResetCount] = useState(0);

  const resetWatchOnView = () => {
    setRouteLine(null);
    setCorridorPolygon(null);
    setBboxToZoom(null);
    setCustomResetCount(c => c + 1);
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="main-grid">
        <aside className="weather-panel">
          <WeatherPanel 
            stations={stations}
          />
        </aside>
        <MapPanel
          stations={stations}
          events={events}
          setStations={setStations}
          setEvents={setEvents}
          routeLine={routeLine}
          corridorPolygon={corridorPolygon}
          bboxToZoom={bboxToZoom}
          resetWatchOnView={resetWatchOnView}
          mapRef={mapRef}
        />
        <aside className="chart-panel">
          <WatchOnPanel 
            setRouteLine={setRouteLine}
            setCorridorPolygon={setCorridorPolygon}
            setBboxToZoom={setBboxToZoom}
            mapRef={mapRef}
            customResetCount={customResetCount}
          />
        </aside>
      </div>

      
      <section className="event-panel">
        <EventPanel 
          events={events}
        />
      </section>

      <footer className="footer">
        <Footer />
      </footer>
    </div>
  )
}

export default App
