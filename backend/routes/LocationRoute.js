import express from "express";
import {
    getAllLocations,
    getLocationById,
    getLocationDataToDB
} from "../controllers/Location.js";

const router = express.Router();

router.get('/locations', getAllLocations);
router.get('/locations/:city', getLocationById);
router.get('/location/:city', getLocationDataToDB);

export default router;