import { useState } from 'react';
import { getBufferedCorridor } from '../../utils/routeUtils';
import { CITY_LOCATIONS, RESORT_LOCATIONS } from './WatchRoutes';

const TABS = {
  city: CITY_LOCATIONS,
  resort: RESORT_LOCATIONS
};

export default function WatchOnPredefined({ onCorridorReady }) {
  const [originTab, setOriginTab] = useState('city');
  const [destinationTab, setDestinationTab] = useState('resort');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (origin && destination) {
      setError('');
      try {
        const { routeLine, corridor } = await getBufferedCorridor(origin.coord, destination.coord);
        onCorridorReady({ label: `${origin.label} → ${destination.label}`, routeLine, corridor });
      } catch (err) {
        console.error('Failed to fetch corridor:', err);
      }
    } else {
      setError('Please select both origin and destination.');
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-2">Select origin and destination:</p>

      <div className="mb-2">
        <label className="block font-medium">Origin</label>
        <div className="flex space-x-2 mb-1">
          <button onClick={() => setOriginTab('city')} className={`px-2 py-1 rounded ${originTab === 'city' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>City/Town</button>
          <button onClick={() => setOriginTab('resort')} className={`px-2 py-1 rounded ${originTab === 'resort' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Resort</button>
        </div>
        <select className="w-full p-2 border rounded" value={origin?.label || ''} onChange={(e) => {
          const loc = TABS[originTab].find(l => l.label === e.target.value);
          setOrigin(loc);
        }}>
          <option value="">-- Select Origin --</option>
          {TABS[originTab].map(loc => <option key={loc.label} value={loc.label}>{loc.label}</option>)}
        </select>
        {!origin && error && <p className="text-sm text-red-500 mt-1">Origin is required</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium">Destination</label>
        <div className="flex space-x-2 mb-1">
          <button onClick={() => setDestinationTab('city')} className={`px-2 py-1 rounded ${destinationTab === 'city' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>City/Town</button>
          <button onClick={() => setDestinationTab('resort')} className={`px-2 py-1 rounded ${destinationTab === 'resort' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Resort</button>
        </div>
        <select className="w-full p-2 border rounded" value={destination?.label || ''} onChange={(e) => {
          const loc = TABS[destinationTab].find(l => l.label === e.target.value);
          setDestination(loc);
        }}>
          <option value="">-- Select Destination --</option>
          {TABS[destinationTab].map(loc => <option key={loc.label} value={loc.label}>{loc.label}</option>)}
        </select>
        {!destination && error && <p className="text-sm text-red-500 mt-1">Destination is required</p>}
      </div>

      <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white rounded w-full">
        Go
      </button>
    </div>
  );
}
