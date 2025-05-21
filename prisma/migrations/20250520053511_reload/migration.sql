/*
  Warnings:

  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `doctors` table. All the data in the column will be lost.
  - The `payment_status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `profile_status` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `users` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `available_doctors` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `payment_date` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date_of_birth` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `joining_date` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `fees` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED', 'PENDING_PAYMENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropForeignKey
ALTER TABLE "available_doctors" DROP CONSTRAINT "available_doctors_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "available_doctors" DROP CONSTRAINT "available_doctors_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_available_doctor_id_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_date",
ADD COLUMN     "payment_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "profile_status",
DROP COLUMN "date_of_birth",
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL,
DROP COLUMN "joining_date",
ADD COLUMN     "joining_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "fees" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_deleted",
DROP COLUMN "status",
ADD COLUMN     "status" "UserAccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION';

-- DropTable
DROP TABLE "available_doctors";

-- CreateTable
CREATE TABLE "availableDoctors" (
    "id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "available_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availableDoctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "availableDoctors_doctor_id_slotId_available_date_key" ON "availableDoctors"("doctor_id", "slotId", "available_date");

-- AddForeignKey
ALTER TABLE "available_services" ADD CONSTRAINT "available_services_available_doctor_id_fkey" FOREIGN KEY ("available_doctor_id") REFERENCES "availableDoctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availableDoctors" ADD CONSTRAINT "availableDoctors_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availableDoctors" ADD CONSTRAINT "availableDoctors_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
