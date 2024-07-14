import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/indes.js'

const generateAccessTokenandRefreshToken = async (userId) => {
    try {

        // get user by id
        const accessToken = await prisma.user.generateAccessToken(userId);
        const refreshToken = await prisma.user.generateRefreshToken(userId);

        const response =  await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                "refreshToken" : refreshToken
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
  

    if(!createUser){
        throw new ApiError(500,"something went wrong when creating user")
    }

    return res.status(201)
              .json(new ApiResponse(201,createUser,"created user successfully"))
})

const loginUser = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;
    
    let userExist = await prisma.user.findUnique({
        where : {
            email : email
        }
    })
    
    if(!userExist){
        throw new ApiError(404,"user does not exist")
    }

    let comparePassword = await prisma.user.isPasswordCorrect(userExist.password,password)

    if(!comparePassword){
        throw new ApiError(401,"user password is wrong")
    }

    const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(userExist.id,password)

    const loginUser = await prisma.user.findUnique({
        where : {
            id : userExist.id
        }
    })

   // console.log(loginUser)

    if(!loginUser ){
        throw new ApiError(401,"error in login")
    }

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new ApiResponse(200, {
            user: loginUser,
            accessToken,
            refreshToken
        },
            "user login successfully"
        ))
             
})

const logoutUser = asyncHandler(async (req,res,next) => {

    const user = req?.user;
 
    const response = await prisma.user.update({
        where : {
            id : user.id
        },
        data : {
            refreshToken : null
        }
    })

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "user successfully logout"))

})

const refreshAccessToken = asyncHandler(async (req,res,next) => {

    const incomingRefreshToken = req?.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(403,"Unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await prisma.user.findUnique({
            where : {
                id : decodedToken.id
            }
        })

        if(!user){
            throw new ApiError(403,"invalid authorisation")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(403,"refresh token is expire")
        }

        const { refreshToken, accessToken } = await generateAccessTokenandRefreshToken(user?.id);

        const option = {
            htmlOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("refreshToken", refreshToken, option)
            .cookie("accessToken", accessToken, option)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "accessToken and refreshToken send successfully"))
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

const getCurrentUser = asyncHandler(async (req, res, next) => {
    return res.status(200)
        .json(new ApiResponse(200, req.user, "current user fetched"))
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser}