import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import prisma from '../../prisma/indes.js'

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        //console.log(token)
        if (!token) {
            throw new ApiError(403, "unauthorised request")
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       // console.log(decodedToken)
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
            throw new ApiError(403, "Access token has expired");
        } else if (error.name === 'JsonWebTokenError') {
            throw new ApiError(403, "Invalid access token");
        } else {
            next(error);
        }
    }
})
