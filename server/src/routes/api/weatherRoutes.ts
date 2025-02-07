import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;
  const weatherData = await WeatherService.getWeatherForCity(cityName);

  // TODO: save city to search history
  HistoryService.addCity(cityName);

  res.status(200).json(weatherData);
});

// TODO: GET search history
router.get("/history", async (_req: Request, res: Response) => {
  res.json(await HistoryService.getCities());
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  // read in the history data:
  const { id } = req.params;
  try {
    await HistoryService.removeCity(id);
    res.status(200).json({ id });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

export default router;
