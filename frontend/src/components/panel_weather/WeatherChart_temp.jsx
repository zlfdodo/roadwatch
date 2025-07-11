import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend, CategoryScale } from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, CategoryScale);


function TempChart({ stations }) {
  const filteredStations = stations
    .filter(s =>
      typeof s.lat === 'number' &&
      typeof s.lon === 'number' &&
      typeof s.temperature_2m === 'number' &&
      !isNaN(s.lat) &&
      !isNaN(s.lon) &&
      !isNaN(s.temperature_2m)
    );

  const data = {
    datasets: filteredStations.map(s => ({
      label: s.name, // full name for tooltip
      data: [{
        x: s.lon,
        y: s.lat,
        r: (() => {
          const t = s.temperature_2m;
          const minT = -40;
          const maxT = 40;
          const minR = 1;
          const maxR = 10;
          const norm = (t - minT) / (maxT - minT);
          return minR + norm * (maxR - minR);
        })(),
        temp: s.temperature_2m  // keep the original temp for tooltip
      }],
      backgroundColor: s.temperature_2m <= 0
        ? 'rgba(0, 123, 255, 0.7)'   // blue if temp ≤ 0
        : 'rgba(255, 133, 0, 0.7)', // orange otherwise
      borderColor: '#fff',
      borderWidth: 1
    }))
  };

  // Chart options
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
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const station = ctx.dataset.label;
            const prec = ctx.raw.temp;
            return `${station}: ${prec.toFixed(1)} °C`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: 400 }}>
      <Bubble data={data} options={options} />
    </div>
  );
}

export default TempChart;