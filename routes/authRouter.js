import express from "express";
import { login, logout, profile, register } from "../authController.js";
import {isAuthenticated}  from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register",register)

router.post("/login",login)

router.post("/logout",isAuthenticated,logout)

router.get("/profile",isAuthenticated,profile)


export default router;