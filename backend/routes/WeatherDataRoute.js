import express from "express";
import {
    getAllweatherdata,
    getWeatherdataById,
    getFilteredWeatherdata,
    saveWeatherDatatoDB,
    ForecastWeather
} from "../controllers/WeatherData.js";

const router = express.Router();

router.get('/weatherdata/all', getAllweatherdata);
router.get('/weatherdata/:id', getWeatherdataById);
router.get('/weatherdata/filter', getFilteredWeatherdata);
router.get("/expressflask/:cityName", ForecastWeather);
router.get("/weatherdata", saveWeatherDatatoDB);

export default router;