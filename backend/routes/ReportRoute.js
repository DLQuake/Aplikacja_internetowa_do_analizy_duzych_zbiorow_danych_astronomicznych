import express from "express";
import {
    deleteReport,
    getAllreport,
    getReportById
} from "../controllers/Report.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/report',verifyUser, getAllreport);
router.get('/report/:id',verifyUser, getReportById);
router.delete("/report/:id",verifyUser, deleteReport);

export default router;