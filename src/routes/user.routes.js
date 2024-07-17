import  {Router}  from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/refresh-token").get(refreshAccessToken)
userRouter.route("/current-user").get(verifyJWT,getCurrentUser)

export default userRouter
