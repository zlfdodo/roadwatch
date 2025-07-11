import { point, lineString } from '@turf/helpers';
import { pointToLineDistance } from '@turf/turf';

export function filterEventsNearRouteLine(events, routeLine, maxDistanceKm = 5) {
    if (!routeLine?.geometry?.coordinates?.length) return [];

    const line = lineString(routeLine.geometry.coordinates);

    return events.filter(event => {
        const coords = event?.geography?.coordinates;
        if (!Array.isArray(coords)) return false;

        // Handle single [lon, lat]
        if (
            coords.length === 2 &&
            typeof coords[0] === 'number'
        ) {
            const dist = pointToLineDistance(point(coords), line, { units: 'kilometers' });
            return dist <= maxDistanceKm;
        }

        // Handle array of [lon, lat] points (MultiPoint)
        if (
            Array.isArray(coords[0]) &&
            typeof coords[0][0] === 'number'
        ) {
            return coords.some(coord => {
                const dist = pointToLineDistance(point(coord), line, { units: 'kilometers' });
                return dist <= maxDistanceKm;
            });
        }

        return false;
    });
}
