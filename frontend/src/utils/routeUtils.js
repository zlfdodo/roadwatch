import { buffer, lineString } from '@turf/turf';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export async function getBufferedCorridor(from, to, bufferKm = 5) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.join(',')};${to.join(',')}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes || !data.routes.length) {
    throw new Error('No route found');
  }

  const route = data.routes[0].geometry;
  const routeLine = lineString(route.coordinates);
  const corridor = buffer(routeLine, bufferKm, { units: 'kilometers' });

  return { routeLine, corridor };
}
