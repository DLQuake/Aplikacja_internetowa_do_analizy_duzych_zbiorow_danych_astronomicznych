import express from "express";
import {
    deleteLocation,
    getAllLocations,
    getLocationById,
    getLocationDataFromAPIToDB
} from "../controllers/Location.js";

const router = express.Router();

router.get('/locations', getAllLocations);
router.get('/locations/:id', getLocationById);
router.get('/location/:city', getLocationDataFromAPIToDB);
router.delete('/locations/:id', deleteLocation);

export default router;