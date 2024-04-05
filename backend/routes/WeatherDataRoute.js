import express from "express";
import {
    getWeatherByLocationName,
    getWeatherData,
    runPythonScript
} from "../controllers/WeatherData.js";

const router = express.Router();

router.get('/weatherdata/location/:city', getWeatherByLocationName);
router.get("/weatherdata/:cityName", getWeatherData)
router.get("/script", runPythonScript)

export default router;