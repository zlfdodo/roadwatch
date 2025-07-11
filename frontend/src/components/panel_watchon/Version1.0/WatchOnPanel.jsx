import { useState } from 'react';
import WatchOnPredefined from './WatchOnPredefined';
import WatchOnCustom from '../WatchOnCustom';

export default function WatchOnPanel({  setRouteLine, setCorridorPolygon, setBboxToZoom, mapRef, customResetCount  }) {
  const [activeTab, setActiveTab] = useState('predefined');

  const handleCorridorReady = ({ label, routeLine, corridor, bbox }) => {
    if (routeLine) {
      setRouteLine(routeLine);        // send GeoJSON LineString to map
      setCorridorPolygon(null);  // send GeoJSON Polygon to map
      setBboxToZoom(null);           // clear previous
    }
    else if (corridor) {
      setRouteLine(null);
      setCorridorPolygon(corridor); // send GeoJSON Polygon to map
      setBboxToZoom(null);          // clear previous
    } 
    else if (bbox) {
      setRouteLine(null);
      setCorridorPolygon(null);
      setBboxToZoom(bbox);          // fallback: just zoom to rectangle
    }
  };

  return (
    <aside className="p-4 bg-white rounded-2xl shadow-md w-full">
      <h2 className="text-xl font-bold mb-4">🔭 Watch On</h2>
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-xl ${activeTab === 'predefined' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('predefined')}
        >
          Predefined Routes
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${activeTab === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('custom')}
        >
          Your Routes
        </button>
      </div>

      {activeTab === 'predefined'
        ? <WatchOnPredefined onCorridorReady={handleCorridorReady} />
        : <WatchOnCustom onCorridorReady={handleCorridorReady} mapRef={mapRef} resetSignal={customResetCount}/>}
    </aside>
  );
}
