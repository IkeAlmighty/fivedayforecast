import dotenv from "dotenv";
import historyService from "./historyService.js";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: number;
  lat: number;
}

// TODO: Define a class for the Weather object
// constructs an object for a single forecast frame
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, forecastSlice: any) {
    this.city = city;
    this.date = new Date(forecastSlice["dt_txt"]).toDateString();
    this.icon = forecastSlice.weather[0].icon;
    this.iconDescription = forecastSlice.weather[0].description;
    this.tempF = forecastSlice.main.temp;
    this.windSpeed = forecastSlice.wind.speed;
    this.humidity = forecastSlice.main.humidity;
  }

  // Getter to return all data as an object
  get allData(): object {
    return {
      city: this.city,
      date: this.date,
      icon: this.icon,
      iconDescription: this.iconDescription,
      tempF: this.tempF,
      windSpeed: this.windSpeed,
      humidity: this.humidity,
    };
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseUrl: string;
  cityName: string;
  apiKey: string;

  constructor(baseUrl: string, cityName: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.cityName = cityName;
    this.apiKey = apiKey;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await fetch(query);

      if (!response.ok) {
        throw new Error(`HTTP Error, status ${response.status}`);
      }

      const data = await response.json();
      const coords: Coordinates = data.city.coord;
      return coords;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon }: Coordinates = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseUrl}?q=${this.cityName}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    const { lat, lon }: Coordinates =
      this.destructureLocationData(locationData);

    return { lat, lon };
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));

    if (!response.ok) {
      throw new Error(`HTTP error, status ${response.status}`);
    }

    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(this.cityName, response.list[0]).allData;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: any, weatherData: any) {
    let datesAdded: string[] = [];
    const forecasts: Object[] = [];
    weatherData.list.forEach((forecastSlice: any) => {
      const weather = new Weather(this.cityName, forecastSlice);

      if (!datesAdded.includes(weather.date)) {
        forecasts.push(weather.allData);
        datesAdded.push(weather.date);
      }
    });

    return [currentWeather, ...forecasts.slice(0, 5)];
  }

  // TODO: Complete getWeatherForCity method
  static async getWeatherForCity(city: string) {
    const baseUrl: string | undefined = process.env.API_BASE_URL;
    const apiKey: string | undefined = process.env.API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error("baseUrl or apiKey are not defined in env variables");
    }

    const service = new WeatherService(baseUrl, city, apiKey);

    const coords = await service.fetchAndDestructureLocationData();
    const weatherData = await service.fetchWeatherData(coords);
    const currentWeather = service.parseCurrentWeather(weatherData);
    const forecast = service.buildForecastArray(currentWeather, weatherData);

    // add to history:
    historyService.addCity(city);

    return forecast; // this gets returned and sent to the frontend
  }
}

export default WeatherService;
