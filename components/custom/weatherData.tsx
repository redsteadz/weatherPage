import { fetchWeatherApi } from 'openmeteo';
	
const params = {
	"latitude": [30.1841, "NaN"],
	"longitude": [67.0014, "NaN"],
	"current": ["temperature_2m", "apparent_temperature", "weather_code", "wind_speed_10m"],
	"hourly": ["temperature_2m", "weather_code"],
	"daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
	"wind_speed_unit": "ms"
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
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();

const current = response.current()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature2m: current.variables(0)!.value(),
		apparentTemperature: current.variables(1)!.value(),
		weatherCode: current.variables(2)!.value(),
		windSpeed10m: current.variables(3)!.value(),
	},
	hourly: {
		time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		temperature2m: hourly.variables(0)!.valuesArray()!,
		weatherCode: hourly.variables(1)!.valuesArray()!,
	},
	daily: {
		time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		weatherCode: daily.variables(0)!.valuesArray()!,
		temperature2mMax: daily.variables(1)!.valuesArray()!,
		temperature2mMin: daily.variables(2)!.valuesArray()!,
	},

};

// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.hourly.time.length; i++) {
	console.log(
		weatherData.hourly.time[i].toISOString(),
		weatherData.hourly.temperature2m[i],
		weatherData.hourly.weatherCode[i]
	);
}
for (let i = 0; i < weatherData.daily.time.length; i++) {
	console.log(
		weatherData.daily.time[i].toISOString(),
		weatherData.daily.weatherCode[i],
		weatherData.daily.temperature2mMax[i],
		weatherData.daily.temperature2mMin[i]
	);
}
