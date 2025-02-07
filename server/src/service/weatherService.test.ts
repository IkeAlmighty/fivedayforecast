// run `tsx src/service/weatherService.test.ts` with Develop/server as root folder
// (need to install tsx globally with `npm i -g tsx` for it to work)

import WeatherService from "./weatherService";
import dotenv from "dotenv";
dotenv.config();

const baseUrl: string = process.env.API_BASE_URL || "";
const apiKey: string = process.env.API_KEY || "";

const weatherService = new WeatherService(baseUrl, "Minneapolis", apiKey);

let result = await (weatherService as any).fetchLocationData("Minneapolis");
console.log(result);

result = await (weatherService as any).fetchWeatherData({
  lat: 44.98,
  lon: -93.2638,
});
