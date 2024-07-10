import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const prisma = new PrismaClient

prisma.$extends({
    model : {
        user : {
            async isPasswordCorrect(password,reqPassword){
                return await bcrypt.compare(password,reqPassword)
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
                        expiresIn: process.env.REFRESH_TOKEN_SECRET
                    }
                )
            }
        }
    },
    query : {
        user : {
            async create({ model, operation, args, query }){
                const user = args.data;
                user.password = await bcrypt.hash(this.password, 10);
                args.data = user;
                query(args);
            },
            async update({ model, operation, args, query }){
                const user = args.data;
                user.password = await bcrypt.hash(this.password, 10);
                args.data = user;
                query(args);
            }
        }
    }
})

export default prisma