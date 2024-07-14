
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/indes.js'

const createCoupon = asyncHandler(async (req,res,next) => {

    const {couponCode} = req.body;
   
    const createCouponResponse = await prisma.coupon.create({
        data : {
            couponCode : couponCode
        }
    })

    if(!createCouponResponse){
        throw new ApiError(401,"error in creating coupon code")
    }

   

    return res.status(201)
              .json(new ApiResponse(201,{createCouponResponse},"added coupon successfully"))
})

const addCouponUser = asyncHandler(async (req,res,next) => {

    const couponCode = req.body.couponCode;
    const userId = req.user.id;

    const couponExist = await prisma.coupon.findUnique({
        where : {
            "couponCode" : couponCode
        }
    })

    if(!couponExist){
        throw new ApiError(401,"coupon code is not valid")
    }

    
    
})
export {
    createCoupon,
    addCouponUser
}