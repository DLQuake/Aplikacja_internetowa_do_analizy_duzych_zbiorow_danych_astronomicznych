import express from "express";
import {
    forecastWeatherData,
    getHistoryWeatherData,
    getWeatherByLocationName,
    getWeatherData,
    runPythonScript,
    sendRequestToFlask
} from "../controllers/WeatherData.js";

const router = express.Router();

router.get('/weatherdata/location/:city', getWeatherByLocationName);
router.get("/weatherdata/:cityName", getWeatherData)
router.get("/historyweatherdata/:cityName", getHistoryWeatherData)
router.get("/script", runPythonScript)
router.get("/forecastweatherdata/:cityName", forecastWeatherData)
router.get("/expressflask", sendRequestToFlask)

export default router;