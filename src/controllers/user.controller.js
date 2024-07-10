import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/indes.js'

const generateAccessTokenandRefreshToken = async (userId,password) => {
    try {

        // get user by id
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        const accessToken = prisma.user.generateAccessToken(userId);
        const refreshToken = prisma.user.generateRefreshToken(userId);

        await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                refreshToken : refreshToken
            }
        })

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "something went wrong when creating new refresh token and access token")
    }
}

const registerUser = asyncHandler(async (req,res,next) => {
    const {  username, email, password } = req.body;

  
    if ([ username, email].some((value) => value.trim() === "")) {
        throw new ApiError(400, "all field are neccessary")
    }

    const existedUser = await prisma.user.findUnique({
        where : {
            "email" : email
        }
    })

    if(existedUser){
        throw new ApiError(409,"user already exist")
    }

    const createUser = await prisma.user.create({
        data : {
            "email":email,
            "password":password,
            "username":username
        }
    })
    console.log(createUser)

    if(!createUser){
        throw new ApiError(500,"something went wrong when creating user")
    }

    return res.status(201)
              .json(new ApiResponse(201,createUser,"created user successfully"))
})

const loginUser = asyncHandler(async (req,res,next) => {

})
export {registerUser,loginUser}