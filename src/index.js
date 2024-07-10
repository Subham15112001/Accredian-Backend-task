import dotenv from 'dotenv';
import { app } from "./app.js";
import prisma from '../prisma/indes.js'

const port = process.env.PORT || 7000;


dotenv.config({
    path: './.env'
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})


