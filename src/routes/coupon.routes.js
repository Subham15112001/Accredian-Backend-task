import { Router } from "express";
import { createCoupon,useCouponByUser ,toggleCouponById, toggleCouponByCouponCode} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const couponRouter = Router();

couponRouter.route("/create-coupon").post(createCoupon)
couponRouter.route("/use-coupon").post(verifyJWT,useCouponByUser)
couponRouter.route("/toggle-coupon").post(toggleCouponById)
couponRouter.route("/toggle-couponBycode").post(toggleCouponByCouponCode)

export default couponRouter