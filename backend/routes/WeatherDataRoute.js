import express from "express";
import {
    getAllweatherdata,
    getWeatherdataById,
    getHistoryWeatherData,
    getWeatherdataByLocationName,
    saveWeatherDatatoDB,
    ForecastWeather
} from "../controllers/WeatherData.js";

const router = express.Router();

router.get('/weatherdatas', getAllweatherdata);
router.get('/weatherdatas/:id', getWeatherdataById);
router.get('/weatherdata/location/:cityName', getWeatherdataByLocationName);
router.get("/historyweatherdata", getHistoryWeatherData);
router.get("/expressflask/:cityName", ForecastWeather);
router.get("/weatherdata", saveWeatherDatatoDB);

export default router;