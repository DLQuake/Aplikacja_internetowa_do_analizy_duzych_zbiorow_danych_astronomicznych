import express from "express";
import {Login, Register, logOut, Me} from "../controllers/Auth.js";

const router = express.Router();

router.get('/me', Me);
router.post("/register", Register);
router.post('/login', Login);
router.delete('/logout', logOut);

export default router;