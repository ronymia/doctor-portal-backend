"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const prisma_1 = require("../../generated/prisma");
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new adapter_pg_1.PrismaPg({
    connectionString,
    // host: process.env.DB_HOST,
    // port: Number(process.env.DB_PORT),
    // password: process.env.DB_PASSWORD,
    // user: process.env.DB_USER,
    // database: process.env.DATABASE,
});
exports.prisma = new prisma_1.PrismaClient({ adapter });
