import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const prisma = new PrismaClient().$extends({
    model : {
        user : {
            async isPasswordCorrect(password,reqPassword){
                return await bcrypt.compare(reqPassword, password)
            },
            generateRefreshToken(userId){
                return jwt.sign(
                    {
                        id:userId
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
                    }
                )
            },
            generateAccessToken(userId){
                return jwt.sign(
                    {
                        id: userId
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                    }
                )
            }
        }
    },
    query : {
        user : {
            async create({ model, operation, args, query }){
                let user = args.data;
                let password = await bcrypt.hash(user.password, 10);
                user = {...user,password : password}
                args.data = user;
                return query(args);
            },
            async update({ model, operation, args, query }){
                const user = args.data;
                if (user.password) { // Only hash password if it's provided
                    user.password = await bcrypt.hash(user.password, 10);
                }
               
                args.data = user;
                return query(args);
            }
        }
    }
})

export default prisma