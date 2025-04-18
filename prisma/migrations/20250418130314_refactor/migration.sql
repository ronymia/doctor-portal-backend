/*
  Warnings:

  - You are about to drop the column `doctor_availability_id` on the `available_services` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_contact` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `medical_history` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the `doctor_availabilities` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[available_doctor_id,slot_id,slot_date,service_id]` on the table `available_services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `available_doctor_id` to the `available_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergency_contact` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_history` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_doctor_availability_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "doctor_availabilities_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_availabilities" DROP CONSTRAINT "doctor_availabilities_slot_id_fkey";

-- DropIndex
DROP INDEX "available_services_doctor_availability_id_slot_id_slot_date_key";

-- AlterTable
ALTER TABLE "available_services" DROP COLUMN "doctor_availability_id",
ADD COLUMN     "available_doctor_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "emergency_contact" TEXT NOT NULL,
ADD COLUMN     "medical_history" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "emergency_contact",
DROP COLUMN "medical_history",
ALTER COLUMN "profile_status" DROP NOT NULL;

-- DropTable
DROP TABLE "doctor_availabilities";

-- CreateTable
CREATE TABLE "available_doctors" (
    "id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "available_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "available_doctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "available_doctors_doctor_id_slot_id_available_date_key" ON "available_doctors"("doctor_id", "slot_id", "available_date");

-- CreateIndex
CREATE UNIQUE INDEX "available_services_available_doctor_id_slot_id_slot_date_se_key" ON "available_services"("available_doctor_id", "slot_id", "slot_date", "service_id");

-- AddForeignKey
ALTER TABLE "available_services" ADD CONSTRAINT "available_services_available_doctor_id_fkey" FOREIGN KEY ("available_doctor_id") REFERENCES "available_doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_doctors" ADD CONSTRAINT "available_doctors_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_doctors" ADD CONSTRAINT "available_doctors_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
