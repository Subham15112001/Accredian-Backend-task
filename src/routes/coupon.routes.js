import { Router } from "express";
import { createCoupon,useCouponByUser } from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const couponRouter = Router();

couponRouter.route("/create-coupon").post(createCoupon)
couponRouter.route("/use-coupon").post(verifyJWT,useCouponByUser)

export default couponRouter