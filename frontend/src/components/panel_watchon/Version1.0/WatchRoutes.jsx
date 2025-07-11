const KM_TO_DEG = 0.009; // Approximate conversion for mid-latitudes

function bufferToBBox([lon, lat], kmBuffer = 50) {
  const deg = kmBuffer * KM_TO_DEG;
  return [lon - deg, lat - deg, lon + deg, lat + deg];
}

export const WATCH_ROUTES = [
  // ─── Corridors ───────────────────────────────────────
  { label: 'Courtenay → Mount Washington', type: 'route', from: [-124.9859, 49.6853], to: [-125.3031, 49.7413] },
  { label: 'Vancouver → Whistler Mountain', type: 'route', from: [-123.1207, 49.2827], to: [-122.9574, 50.1163] },
  { label: 'Vancouver → Cypress Mountain', type: 'route', from: [-123.1207, 49.2827], to: [-123.2030, 49.3966] },
  { label: 'Vancouver → Grouse Mountain', type: 'route', from: [-123.1207, 49.2827], to: [-123.0814, 49.3772] },
  { label: 'Vancouver → Seymour Mountain', type: 'route', from: [-123.1207, 49.2827], to: [-122.9721, 49.3747] },
  { label: 'Vancouver → Sasquatch Mountain', type: 'route', from: [-123.1207, 49.2827], to: [-121.9403, 49.3799] },
  { label: 'Vancouver → Manning Park Resort', type: 'route', from: [-123.1207, 49.2827], to: [-120.9167, 49.0685] },
  { label: 'Kamloops → Sun Peaks Resort', type: 'route', from: [-120.3273, 50.6745], to: [-119.8882, 50.8848] },
  { label: 'Kamloops → Revelstoke Mountain', type: 'route', from: [-120.3273, 50.6745], to: [-118.1634, 50.9585] },
  { label: 'Kamloops → Kicking Horse Mountain', type: 'route', from: [-120.3273, 50.6745], to: [-117.0475, 51.2981] },
  { label: 'Kelowna → SilverStar Mountain', type: 'route', from: [-119.4960, 49.8880], to: [-119.0604, 50.3597] },
  { label: 'Kelowna → Big White', type: 'route', from: [-119.4960, 49.8880], to: [-118.9308, 49.7216] },
  { label: 'Kelowna → Apex Mountain', type: 'route', from: [-119.4960, 49.8880], to: [-119.9067, 49.3958] },
  { label: 'Castlegar → Red Mountain', type: 'route', from: [-117.6591, 49.2965], to: [-117.8206, 49.1013] },
  { label: 'Castlegar → Whitewater Ski Resort', type: 'route', from: [-117.6591, 49.2965], to: [-117.1457, 49.4432] },
  { label: 'Cranbrook → Kimberley Alpine Resort', type: 'route', from: [-115.7651, 49.5122], to: [-116.0047, 49.6878] },
  { label: 'Cranbrook → Fernie Alpine Resort', type: 'route', from: [-115.7651, 49.5122], to: [-115.0870, 49.4624] },
  { label: 'Cranbrook → Panorama Mountain Resort', type: 'route', from: [-115.7651, 49.5122], to: [-116.2393, 50.4603] },

  // ─── Buffers (Watch 50 km Around Resorts) ─────────────
  { label: 'Watch 50km around Mount Washington', type: 'buffer', center: [-125.3031, 49.7413], bbox: bufferToBBox([-125.3031, 49.7413]) },
  { label: 'Watch 50km around Whistler', type: 'buffer', center: [-122.9574, 50.1163], bbox: bufferToBBox([-122.9574, 50.1163]) },
  { label: 'Watch 50km around Cypress', type: 'buffer', center: [-123.2030, 49.3966], bbox: bufferToBBox([-123.2030, 49.3966]) },
  { label: 'Watch 50km around Grouse', type: 'buffer', center: [-123.0814, 49.3772], bbox: bufferToBBox([-123.0814, 49.3772]) },
  { label: 'Watch 50km around Seymour', type: 'buffer', center: [-122.9721, 49.3747], bbox: bufferToBBox([-122.9721, 49.3747]) },
  { label: 'Watch 50km around Sasquatch', type: 'buffer', center: [-121.9403, 49.3799], bbox: bufferToBBox([-121.9403, 49.3799]) },
  { label: 'Watch 50km around Manning Park', type: 'buffer', center: [-120.9167, 49.0685], bbox: bufferToBBox([-120.9167, 49.0685]) },
  { label: 'Watch 50km around Sun Peaks', type: 'buffer', center: [-119.8882, 50.8848], bbox: bufferToBBox([-119.8882, 50.8848]) },
  { label: 'Watch 50km around Revelstoke', type: 'buffer', center: [-118.1634, 50.9585], bbox: bufferToBBox([-118.1634, 50.9585]) },
  { label: 'Watch 50km around Kicking Horse', type: 'buffer', center: [-117.0475, 51.2981], bbox: bufferToBBox([-117.0475, 51.2981]) },
  { label: 'Watch 50km around SilverStar', type: 'buffer', center: [-119.0604, 50.3597], bbox: bufferToBBox([-119.0604, 50.3597]) },
  { label: 'Watch 50km around Big White', type: 'buffer', center: [-118.9308, 49.7216], bbox: bufferToBBox([-118.9308, 49.7216]) },
  { label: 'Watch 50km around Apex', type: 'buffer', center: [-119.9067, 49.3958], bbox: bufferToBBox([-119.9067, 49.3958]) },
  { label: 'Watch 50km around Red Mountain', type: 'buffer', center: [-117.8206, 49.1013], bbox: bufferToBBox([-117.8206, 49.1013]) },
  { label: 'Watch 50km around Whitewater', type: 'buffer', center: [-117.1457, 49.4432], bbox: bufferToBBox([-117.1457, 49.4432]) },
  { label: 'Watch 50km around Kimberley', type: 'buffer', center: [-116.0047, 49.6878], bbox: bufferToBBox([-116.0047, 49.6878]) },
  { label: 'Watch 50km around Fernie', type: 'buffer', center: [-115.0870, 49.4624], bbox: bufferToBBox([-115.0870, 49.4624]) },
  { label: 'Watch 50km around Panorama', type: 'buffer', center: [-116.2393, 50.4603], bbox: bufferToBBox([-116.2393, 50.4603]) },
];
