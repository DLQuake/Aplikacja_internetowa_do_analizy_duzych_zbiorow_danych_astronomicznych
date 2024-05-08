import express from "express";
import {
    deleteReport,
    getAllreport,
    getReportById
} from "../controllers/Report.js";

const router = express.Router();

router.get('/report', getAllreport);
router.get('/report/:id', getReportById);
router.delete("/report/:id", deleteReport);

export default router;