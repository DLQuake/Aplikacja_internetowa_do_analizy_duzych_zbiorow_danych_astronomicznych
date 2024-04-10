import express from "express";
import {
    getHistoryWeatherData,
    getWeatherByLocationName,
    getWeatherData,
    sendRequestToFlask
} from "../controllers/WeatherData.js";

const router = express.Router();

router.get('/weatherdata/location/:city', getWeatherByLocationName);
router.get("/weatherdata/:cityName", getWeatherData)
router.get("/historyweatherdata/:cityName", getHistoryWeatherData)
router.get("/expressflask/:cityName", sendRequestToFlask)

export default router;