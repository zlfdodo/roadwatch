import TempChart from './WeatherChart_temp';
import PrecipChart from './WeatherChart_precip';
import SnowDepthChart from './WeatherChart_snow';

import { useState } from 'react';

function WeatherPanel({ stations }) {
  const [active, setActive] = useState('temp');

  return (
    <div className="weather-panel">
      <h3>🌦️ Weather </h3>
      <div className="tabs">
        <button onClick={() => setActive('temp')}>🌡️ Temp</button>
        <button onClick={() => setActive('precip')}>🌧️ Precip</button>
        <button onClick={() => setActive('snow')}>❄️ Snow</button>
      </div>

      <div className="chart">
        {active === 'temp' && <TempChart stations={stations} />}
        {active === 'precip' && <PrecipChart stations={stations} />}
        {active === 'snow' && <SnowDepthChart stations={stations} />}
      </div>
    </div>
  );
}

export default WeatherPanel