import { useState } from 'react';
import { CITY_LOCATIONS, RESORT_LOCATIONS, bufferToBBox } from './WatchRoutes';

export default function WatchOnFlyTo({ onCorridorReady }) {
  const [group, setGroup] = useState('city');
  const [selected, setSelected] = useState(null);

  const locations = group === 'city' ? CITY_LOCATIONS : RESORT_LOCATIONS;

  const handleFlyTo = () => {
    if (selected) {
      const bbox = bufferToBBox(selected.coord);
      onCorridorReady({ label: selected.label, bbox });
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">🗺️ Fly To</h3>
      <p className="text-gray-600 mb-2">Select a region of interest to zoom to:</p>

      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => { setGroup('city'); setSelected(null); }}
          className={`px-2 py-1 rounded ${group === 'city' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          City/Town
        </button>
        <button
          onClick={() => { setGroup('resort'); setSelected(null); }}
          className={`px-2 py-1 rounded ${group === 'resort' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Resort
        </button>
      </div>

      <select
        className="w-full p-2 border rounded"
        value={selected?.label || ''}
        onChange={(e) => {
          const loc = locations.find(l => l.label === e.target.value);
          setSelected(loc);
        }}
      >
        <option value="">-- Select {group === 'city' ? 'City/Town' : 'Resort'} --</option>
        {locations.map(loc => (
          <option key={loc.label} value={loc.label}>{loc.label}</option>
        ))}
      </select>
      <div className="flex space-x-2 mb-2">
        <button
          disabled={!selected}
          onClick={handleFlyTo}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          Fly To Selected
        </button>
      </div>
    </div>
  );
}
