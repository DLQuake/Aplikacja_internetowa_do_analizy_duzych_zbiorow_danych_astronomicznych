import express from "express";
import {
    getAllForecast,
} from "../controllers/Forecast.js";

const router = express.Router();

router.get('/forecast/all', getAllForecast);

export default router;