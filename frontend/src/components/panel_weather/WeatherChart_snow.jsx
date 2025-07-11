import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

function SnowDepthChart({ stations }) {
  const filteredStations = stations.filter(
    s =>
      typeof s.lat === 'number' &&
      typeof s.lon === 'number' &&
      typeof s.snowfall === 'number' &&
      !isNaN(s.lat) &&
      !isNaN(s.lon) &&
      !isNaN(s.snowfall)
  );

  // No valid data: show message
  if (filteredStations.length === 0) {
    return (
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontStyle: 'italic', color: '#888' }}>❄️ No snow depth data available</p>
      </div>
    );
  }

  const data = {
    datasets: filteredStations.map((s) => ({
      label: s.name,
      data: [{
        x: s.lon,
        y: s.lat,
        r: (() => {
          const minS = 0;
          const maxS = 50;
          const minR = 1;
          const maxR = 10;
          const sVal = s.snowfall ?? 0;

          const clamped = Math.min(Math.max(sVal, minS), maxS);
          const norm = (clamped - minS) / (maxS - minS);
          return minR + norm * (maxR - minR);
        })(),
        snow: s.snowfall
      }],
      backgroundColor: s.snowfall > 10
        ? 'rgb(113, 227, 255)'
        : 'rgb(255, 255, 255)',
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
        reverse: false // north on top
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const station = ctx.dataset.label;
            const snow = ctx.raw.snow;
            return `${station}: ${snow.toFixed(1)} cm`;
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

export default SnowDepthChart;
