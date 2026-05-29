import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma';
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({
  connectionString,
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // password: process.env.DB_PASSWORD,
  // user: process.env.DB_USER,
  // database: process.env.DATABASE,
});
export const prisma = new PrismaClient({ adapter });
