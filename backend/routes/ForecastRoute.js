import express from "express";
import {
    ForecastWeather,
    getAllForecast,
} from "../controllers/Forecast.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/forecast/all', getAllForecast);
router.get('/forecast/predict', verifyUser, ForecastWeather);

export default router;