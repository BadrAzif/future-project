import prisma from '../models/index.js';

const connectDb = async () => {
    try {
        await prisma.$connect()
        console.log('Database connected successfully');
    } catch (error) {
        console.log('failed to conncet to the database');
        process.exit(1)
    }
}
export { prisma, connectDb }