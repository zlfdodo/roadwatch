const KM_TO_DEG = 0.009;

export function bufferToBBox([lon, lat], kmBuffer = 50) {
  const deg = kmBuffer * KM_TO_DEG;
  return [lon - deg, lat - deg, lon + deg, lat + deg];
}

export const CITY_LOCATIONS = [
  { label: 'Vancouver', coord: [-123.1207, 49.2827] },
  { label: 'Kamloops', coord: [-120.3273, 50.6745] },
  { label: 'Kelowna', coord: [-119.4960, 49.8880] },
  { label: 'Castlegar', coord: [-117.6591, 49.2965] },
  { label: 'Cranbrook', coord: [-115.7651, 49.5122] },
];

export const RESORT_LOCATIONS = [
  { label: 'Whistler', coord: [-122.9574, 50.1163] },
  { label: 'Cypress', coord: [-123.2030, 49.3966] },
  { label: 'Grouse', coord: [-123.0825, 49.3701] },
  { label: 'Seymour', coord: [-122.9519, 49.3846] },
  { label: 'Big White', coord: [-118.9308, 49.7216] },
  { label: 'Sun Peaks', coord: [-119.8882, 50.8848] },
  { label: 'SilverStar', coord: [-119.0604, 50.3597] },
  { label: 'Kicking Horse', coord: [-117.0475, 51.2981] },
  { label: 'Panorama', coord: [-116.2393, 50.4603] },
];
