import express from "express";
import {
    ForecastWeather,
    getAllForecast,
    getForecastsByReportAndLocation,
} from "../controllers/Forecast.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/forecast/all',verifyUser, getAllForecast);
router.get('/forecast/filter',verifyUser, getForecastsByReportAndLocation);
router.get('/forecast/predict',verifyUser, ForecastWeather);

export default router;