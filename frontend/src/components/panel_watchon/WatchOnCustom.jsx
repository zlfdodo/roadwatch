import { useEffect, useState } from 'react';
import { getBufferedCorridor } from '../../utils/routeUtils';

export default function WatchOnCustom({ onCorridorReady, mapRef, resetSignal }) {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [clickMessage, setClickMessage] = useState('Click to select a start point');

  // Reset on external trigger
  useEffect(() => {
    setStartPoint(null);
    setEndPoint(null);
    setClickMessage('Click to select a start point');
  }, [resetSignal]);

  useEffect(() => {
    const map = mapRef?.current;
    if (!map || typeof map.on !== 'function') {
      console.warn('Map not ready');
      return;
    }

    const handleClick = (e) => {
      const { lng, lat } = e.lngLat;
      console.log('Map clicked:', lng, lat);

      if (!startPoint) {
        setStartPoint([lng, lat]);
        setClickMessage('Now click to select an end point');
      } else if (!endPoint) {
        setEndPoint([lng, lat]);
        setClickMessage('Generating route...');
      }
    };

    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [mapRef, startPoint, endPoint]);

  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const fetchCorridor = async () => {
      try {
        const { routeLine, corridor } = await getBufferedCorridor(startPoint, endPoint);
        onCorridorReady({ label: 'Custom Route', routeLine, corridor });
        setClickMessage('Route set. Click reset to try again.');

        // Clear them to prevent retriggering
        setStartPoint(null);
        setEndPoint(null);
      } catch (err) {
        console.error('Failed to get route:', err);
        setClickMessage('Error generating route.');
      }
    };

    fetchCorridor();
  }, [startPoint, endPoint, onCorridorReady]);

  return (
    <div className="text-sm space-y-2">
      <p>{clickMessage}</p>
      {startPoint && <p>Start: {startPoint[1].toFixed(4)}, {startPoint[0].toFixed(4)}</p>}
      {endPoint && <p>End: {endPoint[1].toFixed(4)}, {endPoint[0].toFixed(4)}</p>}
    </div>
  );
}
