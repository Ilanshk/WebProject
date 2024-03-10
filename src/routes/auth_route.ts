import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller"
router.post("/login",authController.login);
router.post("/register",authController.register);
router.post("/logout",authController.logout);

//Route to get a new access token
//We do not send anything in the HTTP body request
//The refresh token is in the header of the HTTP request
router.get("/refresh",authController.refresh);

export default router;