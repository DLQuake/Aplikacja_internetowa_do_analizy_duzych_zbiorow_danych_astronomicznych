import express from "express";
import {
    getAllLocations,
    getLocationById,
    getLocationDataFromAPIToDB
} from "../controllers/Location.js";

const router = express.Router();

router.get('/locations', getAllLocations);
router.get('/locations/:city', getLocationById);
router.get('/location/:city', getLocationDataFromAPIToDB);

export default router;