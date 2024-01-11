import {
  TiWeatherCloudy,
  TiWeatherDownpour,
  // TiWeatherNight,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherSnow,
  TiWeatherStormy,
  TiWeatherSunny,
  // TiWeatherWindy,
  TiWeatherWindyCloudy,
} from "react-icons/ti";

interface WeatherIconProps {
  className: string;
  size: number;
  color: string;
}

type WeatherDataMapping = {
  [code: number]: [string, React.ReactElement<WeatherIconProps>];
};

const weatherDataMapping: WeatherDataMapping = {
  0: [
    "Clear sky",
    <TiWeatherSunny className="inline" size={40} color="yellow" />,
  ],
  1: [
    "Mainly clear",
    <TiWeatherCloudy className="inline" size={40} color="gray" />,
  ],
  2: [
    "Partly cloudy",
    <TiWeatherPartlySunny className="inline" size={40} color="orange" />,
  ],
  3: [
    "Overcast",
    <TiWeatherCloudy className="inline" size={40} color="gray" />,
  ],
  45: [
    "Fog and depositing rime fog",
    <TiWeatherWindyCloudy className="inline" size={40} color="gray" />,
  ],
  48: [
    "Fog and depositing rime fog",
    <TiWeatherWindyCloudy className="inline" size={40} color="gray" />,
  ],
  51: [
    "Drizzle: Light intensity",
    <TiWeatherShower className="inline" size={40} color="lightblue" />,
  ],
  53: [
    "Drizzle: Moderate intensity",
    <TiWeatherShower className="inline" size={40} color="lightblue" />,
  ],
  55: [
    "Drizzle: Dense intensity",
    <TiWeatherShower className="inline" size={40} color="lightblue" />,
  ],
  56: [
    "Freezing Drizzle: Light intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  57: [
    "Freezing Drizzle: Dense intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  61: [
    "Rain: Slight intensity",
    <TiWeatherDownpour className="inline" size={40} color="lightblue" />,
  ],
  63: [
    "Rain: Moderate intensity",
    <TiWeatherDownpour className="inline" size={40} color="lightblue" />,
  ],
  65: [
    "Rain: Heavy intensity",
    <TiWeatherDownpour className="inline" size={40} color="lightblue" />,
  ],
  66: [
    "Freezing Rain: Light intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  67: [
    "Freezing Rain: Heavy intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  71: [
    "Snow fall: Slight intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  73: [
    "Snow fall: Moderate intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  75: [
    "Snow fall: Heavy intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  77: [
    "Snow grains",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  80: [
    "Rain showers: Slight intensity",
    <TiWeatherShower className="inline" size={40} color="lightblue" />,
  ],
  81: [
    "Rain showers: Moderate intensity",
    <TiWeatherShower className="inline" size={40} color="lightblue" />,
  ],
  82: [
    "Rain showers: Violent intensity",
    <TiWeatherDownpour className="inline" size={40} color="lightblue" />,
  ],
  85: [
    "Snow showers: Slight intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  86: [
    "Snow showers: Heavy intensity",
    <TiWeatherSnow className="inline" size={40} color="white" />,
  ],
  95: [
    "Thunderstorm: Slight intensity",
    <TiWeatherStormy className="inline" size={40} color="gray" />,
  ],
  96: [
    "Thunderstorm with slight hail",
    <TiWeatherStormy className="inline" size={40} color="gray" />,
  ],
  99: [
    "Thunderstorm with heavy hail",
    <TiWeatherStormy className="inline" size={40} color="gray" />,
  ],
};

import { fetchWeatherApi } from "openmeteo";

const params = {
  "latitude": [24.84608],
  "longitude": [67.0014],
  "current": [
    "temperature_2m",
    "apparent_temperature",
    "weather_code",
    "wind_speed_10m",
  ],
  "hourly": ["temperature_2m", "weather_code"],
  "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
  "wind_speed_unit": "ms",
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
// const timezone = response.timezone();
// const timezoneAbbreviation = response.timezoneAbbreviation();
// const latitude = response.latitude();
// const longitude = response.longitude();

const current = response.current()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
interface WeatherData {
  current: {
    time: Date;
    temperature2m: number;
    apparentTemperature: number;
    weatherCode: number;
    windSpeed10m: number;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array;
    weatherCode: Float32Array;
  };
  daily: {
    time: Date[];
    weatherCode: Float32Array;
    temperature2mMax: Float32Array;
    temperature2mMin: Float32Array;
  };
}
const weatherData: WeatherData = {
  current: {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature2m: current.variables(0)!.value(),
    apparentTemperature: current.variables(1)!.value(),
    weatherCode: current.variables(2)!.value(),
    windSpeed10m: current.variables(3)!.value(),
  },
  hourly: {
    time: range(
      Number(hourly.time()),
      Number(hourly.timeEnd()),
      hourly.interval(),
    ).map(
      (t) => new Date((t + utcOffsetSeconds) * 1000),
    ),
    temperature2m: hourly.variables(0)!.valuesArray()!,
    weatherCode: hourly.variables(1)!.valuesArray()!,
  },
  daily: {
    time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval())
      .map(
        (t) => new Date((t + utcOffsetSeconds) * 1000),
      ),
    weatherCode: daily.variables(0)!.valuesArray()!,
    temperature2mMax: daily.variables(1)!.valuesArray()!,
    temperature2mMin: daily.variables(2)!.valuesArray()!,
  },
};

// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.hourly.time.length; i++) {
  console.log(
    // weatherData.hourly.time[i].toISOString(),
    // weatherData.hourly.temperature2m[i],
    weatherData.hourly.weatherCode[i],
  );
}
for (let i = 0; i < weatherData.daily.time.length; i++) {
  console.log(
    // weatherData.daily.time[i].toISOString(),
    weatherData.daily.weatherCode[i],
    // weatherData.daily.temperature2mMax[i],
    // weatherData.daily.temperature2mMin[i]
  );
}

function formatTime(date: Date): string {
  const formattedTime = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedTime}`;
}

function City() {
  return (
    <div className="flex justify-between items-center w-full h-32  m-3 *:m-5 bg-gray-900">
      <div>
        <div className="text-sm ">PK</div>
        <div className="text-2xl font-bold">Karachi</div>
        <div>{weatherDataMapping[weatherData.current.weatherCode][0]}</div>
      </div>
      <div>
        <div className="text-sm ">
          {weatherDataMapping[weatherData.current.weatherCode][1]}
        </div>
        <div className="text-2xl font-bold">
          {weatherData.current.temperature2m.toPrecision(2)}
        </div>
      </div>
    </div>
  );
}

function Daily(
  time: Date,
  weatherCode: number,
  tempMax: number,
  tempMin: number,
) {
  return (
    <div className="flex justify-between items-center w-full h-20  m-3 *:m-5 bg-gray-900">
      <div>{time.toLocaleDateString(undefined, { weekday: "long" })}</div>
      <div>
        {weatherDataMapping[weatherCode][1]}{" "}
        {weatherDataMapping[weatherCode][0]}
      </div>
      <div className="flex gap-1 items-center text-xl">
        {tempMin.toPrecision(2)}

        <span className="max-w-80 bg-slate-800 h-3 rounded-full mx-3 flex">
          <span className="bg-blue-500 h-3 max-w-32 rounded-full"></span>
        </span>

        {tempMax.toPrecision(2)}
      </div>
    </div>
  );
}
function LargeCities() {
  return (
    <div>
      <h1 className="text-xl font-bold my-3 text-white">
        Other Large Cities
      </h1>
      <div className="flex flex-col items-center *:rounded-2xl text-white">
        <City />
        <City />
        <City />
      </div>
    </div>
  );
}

function Forecast() {
  return (
    <div>
      <h1 className="text-xl font-bold my-3 text-white">
        5 Day Forecast
      </h1>
      <div className="flex flex-col items-center *:rounded-2xl text-white">
        {weatherData.daily.time.map((time, index) => {
          if (index < 5) {
            return Daily(
              time,
              weatherData.daily.weatherCode[index],
              weatherData.daily.temperature2mMax[index],
              weatherData.daily.temperature2mMin[index],
            );
          }
        })}
      </div>
    </div>
  );
}

function BottomBriefing() {
  return (
    <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_3fr] gap-12 grid-rows-1 w-[calc(100%)] h-[100%] mt-8">
      <LargeCities />
      <Forecast />
    </div>
  );
}

function LeftBriefing() {
  return (
    <div className="h-52 sm:max-w-96 bg-gray-900 flex justify-between text-white rounded-2xl self-stretch">
      <div className="flex flex-col items-center h-[100%] justify-evenly mx-5">
        <h1 className="text-5xl font-bold">
          {weatherData.current.temperature2m.toPrecision(2)}
        </h1>
        <div>
          {weatherDataMapping[weatherData.current.weatherCode][1]}{" "}
          {weatherDataMapping[weatherData.current.weatherCode][0]}
        </div>
        <div>
          feels like {weatherData.current.apparentTemperature.toPrecision(2)}
        </div>
      </div>
      <div className="flex flex-col items-center h-[100%] justify-evenly mx-5">
        <div className="text-3xl font-bold">
          Karachi
          <div className="text-sm font-normal text-right">
            {formatTime(weatherData.current.time)}
          </div>
        </div>

        <div>
          {weatherDataMapping[45][1]}{" "}
          {weatherData.current.windSpeed10m.toPrecision(2)}
          <div className="text-sm font-normal text-right">
            -1 to 3
          </div>
        </div>
      </div>
    </div>
  );
}

function Hourly(time: Date, temperature: number, weatherCode: number) {
  return (
    <div className="flex flex-col items-center justify-evenly text-white ">
      <div className="border-b-white first:border-b-2">{formatTime(time)}</div>
      <div className="flex flex-col items-center">
        {weatherDataMapping[weatherCode][1]}
        <div>{weatherDataMapping[weatherCode][0]}</div>
      </div>
      <div className="font-bold text-4xl">
        {temperature.toPrecision(2)}
      </div>
    </div>
  );
}

function RightBriefing() {
  return (
    <div className="flex gap-5 justify-center flex-wrap *:w-[6rem] *:h-52 *:rounded-2xl *:bg-gray-900">
      {weatherData.hourly.time.map((time, index) => {
        if (index < 9) {
          return Hourly(
            time,
            weatherData.hourly.temperature2m[index],
            weatherData.hourly.weatherCode[index],
          );
        }
        return null; // or some default value if you don't want to render anything
      })}
    </div>
  );
}

function Briefing() {
  return (
    <>
      <div className="grid grid-cols-[1fr] gap-12 sm:grid-cols-[1fr_3fr] grid-rows-1 min-w-[calc(100%-4rem)] h-[100%] mt-8">
        <LeftBriefing />
        <RightBriefing />
      </div>
      <BottomBriefing />
    </>
  );
}

export default Briefing;
