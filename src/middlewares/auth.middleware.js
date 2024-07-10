import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import prisma from '../../prisma/indes.js'

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
        // console.log(req.header("Authorization")?.replace("Bearer",""))
        if (!token) {
            throw new ApiError(403, "unauthorised request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await prisma.user.findUnique({
            where : {
                id : decodedToken.id
            },
            omit : {
                password : true,
            }
        });

        if (!user) {
            throw new ApiError(403, "invalid access token");
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(403, "Refresh token has expired");
        } else if (error.name === 'JsonWebTokenError') {
            throw new ApiError(403, "Invalid refresh token");
        } else {
            next(error);
        }
    }
})
