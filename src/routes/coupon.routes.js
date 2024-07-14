import { Router } from "express";
import { createCoupon } from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const couponRouter = Router();

couponRouter.route("/create-coupon").post(createCoupon)

export default couponRouter