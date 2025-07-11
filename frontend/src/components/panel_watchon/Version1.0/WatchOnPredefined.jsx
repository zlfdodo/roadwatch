import { useState } from 'react';
import { WATCH_ROUTES } from '../WatchRoutes';
import { getBufferedCorridor } from '../../../utils/routeUtils';

export default function WatchOnPredefined({ onCorridorReady }) {
  const [selectedLabel, setSelectedLabel] = useState('');

  const handleApply = async () => {
    const selected = WATCH_ROUTES.find(r => r.label === selectedLabel);
    if (!selected) return;

    if (selected.type === 'route') {
      try {
        const { routeLine, corridor } = await getBufferedCorridor(selected.from, selected.to);
        onCorridorReady({ label: selected.label, routeLine, corridor });
      } catch (err) {
        console.error('Failed to fetch corridor:', err);
      }
    } else if (selected.type === 'buffer') {
      onCorridorReady({ label: selected.label, bbox: selected.bbox });
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-2">Select from preset routes or watch zones.</p>
      <div className="flex space-x-2">
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">-- Select --</option>
          {WATCH_ROUTES.map(route => (
            <option key={route.label} value={route.label}>
              {route.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go
        </button>
      </div>
    </div>
  );
}
