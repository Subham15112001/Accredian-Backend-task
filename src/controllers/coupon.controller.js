
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

const useCouponByUser = asyncHandler(async (req,res,next) => {

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

    if (couponCode?.isActive === false){
        throw new ApiError(401,"coupon is not active")
    }

    const useCoupon = await prisma.user.findUnique({
        where : {
            id : userId,
            CouponUserRelation : {
                some : {
                    coupons : {
                        couponCode : couponCode
                    }
                    
                }
            }
        },
        
    })

 
    if(useCoupon){
        throw new ApiError(401,"coupon code is already used by you")
    }
    
    const addCouponUsedByUser = await prisma.couponUserRelation.create({
       data : {
        coupons : {
            connect : {
                id : couponExist.id
            }
        },
        users : {
            connect : {
                id : userId
            }
        }
       },
        include : {
            coupons : true,
            users : true
        }
    })
    
    if(!addCouponUsedByUser){
        throw new ApiError(401,"unable to used coupon please try again")
    }

    return res.status(201)
              .json(new ApiResponse(201,addCouponUsedByUser,"used coupon successfully"))
})

const toggleCouponById = asyncHandler(async (req,res,next) => {
    const couponId = req.body.couponId

    const getCoupon = await prisma.coupon.findUnique({
        where : {
            id : couponId
        },
    })
    console.log(getCoupon)

    if(!getCoupon){
        throw new ApiError(401,"invalid coupon")
    }
    const updateCoupon = await prisma.coupon.update({
        where : {
            id : couponId
        },
        data : {
            isActive : (!getCoupon.isActive)
        }
    })

    if(!getCoupon){
        throw new ApiError(401,"invalid coupon")
    }

    return res.status(201)
              .json(new ApiResponse(201,updateCoupon,"coupon activation toggle"))
})

const toggleCouponByCouponCode = asyncHandler(async(req,res,next) => {
    const couponCode = req.body.couponCode

    const getCoupon = await prisma.coupon.findUnique({
        where: {
            couponCode : couponCode
        },
    })
    console.log(getCoupon)

    if (!getCoupon) {
        throw new ApiError(401, "invalid coupon")
    }
    const updateCoupon = await prisma.coupon.update({
        where: {
            couponCode : couponCode
        },
        data: {
            isActive: (!getCoupon.isActive)
        }
    })

    if (!getCoupon) {
        throw new ApiError(401, "invalid coupon")
    }

    return res.status(201)
        .json(new ApiResponse(201, updateCoupon, "coupon activation toggle"))
})


export {
    createCoupon,
    useCouponByUser,
    toggleCouponById,
    toggleCouponByCouponCode
}