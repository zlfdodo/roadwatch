import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

function PrecipChart({ stations }) {
  const filteredStations = stations.filter(
    s =>
      typeof s.lat === 'number' &&
      typeof s.lon === 'number' &&
      typeof s.precipitation === 'number' &&
      !isNaN(s.lat) &&
      !isNaN(s.lon) &&
      !isNaN(s.precipitation)
  );

  // No valid data: show message
  if (filteredStations.length === 0) {
    return (
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontStyle: 'italic', color: '#888' }}>🌧️ No precipitation data available</p>
      </div>
    );
  }

  const data = {
    datasets: filteredStations.map((s) => ({
      label: s.name,
      data: [{
        x: s.lon,         // longitude on x-axis
        y: s.lat,         // latitude on y-axis
        r: (() => {
          const minP = 0;
          const maxP = 20;
          const minR = 3;
          const maxR = 12;
          const p = s.precipitation ?? 0;

          const clampedP = Math.min(Math.max(p, minP), maxP);
          const norm = (clampedP - minP) / (maxP - minP);
          return minR + norm * (maxR - minR);
        })(),
        precip: s.precipitation
      }],
      backgroundColor: s.precipitation > 5
        ? 'rgba(128, 0, 128, 0.7)' // purple
        : 'rgba(0, 123, 255, 0.7)', // blue
      borderColor: '#fff',
      borderWidth: 1
    }))
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Longitude (°)' },
      },
      y: {
        title: { display: true, text: 'Latitude (°)' },
        reverse: false, // north on top
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const station = ctx.dataset.label;
            const prec = ctx.raw.precip;
            return `${station}: ${prec.toFixed(1)} mm`;
          }
        }
      },
      legend: { display: false }
    }
  };

  return (
    <div style={{ height: 400 }}>
      <Bubble data={data} options={options} />
    </div>
  );
}

export default PrecipChart;
