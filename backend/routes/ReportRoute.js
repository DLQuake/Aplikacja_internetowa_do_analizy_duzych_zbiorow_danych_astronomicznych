import express from "express";
import {
    getAllreport,
    getReportById
} from "../controllers/Report.js";

const router = express.Router();

router.get('/report/all', getAllreport);
router.get('/report/one', getReportById);

export default router;