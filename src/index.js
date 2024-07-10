import dotenv from 'dotenv';
import { app } from "./app.js";
import prisma from '../prisma/indes.js'

const port = process.env.PORT || 7000;


dotenv.config({
    path: './.env'
})

async function main() {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    })
}

main()
    .catch((e) => {
        console.log(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })