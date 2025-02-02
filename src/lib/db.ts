import { PrismaClient } from '@prisma/client'

// export const db = new PrismaClient()

// import { PrismaClient } from "@prisma/client/extension"

declare global {
    var prisma: PrismaClient | undefined
}

export const db = global.prisma || new PrismaClient()

if(process.env.NODE_ENV !== 'production') global.prisma = db