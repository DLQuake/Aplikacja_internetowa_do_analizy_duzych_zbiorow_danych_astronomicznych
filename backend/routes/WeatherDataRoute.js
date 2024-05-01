import express from "express";
import {
    getAllweatherdata,
    getWeatherdataById,
    getFilteredWeatherdata,
    saveWeatherDatatoDB,
    ForecastWeather,
    deleteWeatherDataByCityName,
    getCurrentWeather
} from "../controllers/WeatherData.js";

const router = express.Router();

router.get('/weatherdata/all', getAllweatherdata);
router.get('/weatherdata/one/:id', getWeatherdataById);
router.get('/weatherdata/current', getCurrentWeather);
router.get('/weatherdata/filter', getFilteredWeatherdata);
router.get("/weatherdata", saveWeatherDatatoDB);
router.get("/weatherdata/forecast", ForecastWeather);
router.delete("/weatherdata/delete", deleteWeatherDataByCityName);

export default router;