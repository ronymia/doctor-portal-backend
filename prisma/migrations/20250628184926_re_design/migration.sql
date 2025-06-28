/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `visitDate` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `doctor_schedule_id` on the `time_slots` table. All the data in the column will be lost.
  - You are about to drop the `availableDoctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slot_id,service_id,slot_date,available_doctor_id]` on the table `available_services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot_id` to the `available_services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availableDoctors" DROP CONSTRAINT "availableDoctors_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "availableDoctors" DROP CONSTRAINT "availableDoctors_slotId_fkey";

-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_available_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "time_slots" DROP CONSTRAINT "time_slots_doctor_schedule_id_fkey";

-- DropIndex
DROP INDEX "available_services_available_doctor_id_service_id_key";

-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "visitDate",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "visit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "diagnosis" DROP NOT NULL;

-- AlterTable
ALTER TABLE "available_services" ADD COLUMN     "slot_id" TEXT NOT NULL,
ALTER COLUMN "fees" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "time_slots" DROP COLUMN "doctor_schedule_id";

-- DropTable
DROP TABLE "availableDoctors";

-- DropTable
DROP TABLE "doctor_schedules";

-- CreateTable
CREATE TABLE "available_doctors" (
    "id" TEXT NOT NULL,
    "available_date" TIMESTAMP(3) NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "available_doctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "available_doctors_doctor_id_slot_id_available_date_key" ON "available_doctors"("doctor_id", "slot_id", "available_date");

-- CreateIndex
CREATE UNIQUE INDEX "available_services_slot_id_service_id_slot_date_available_d_key" ON "available_services"("slot_id", "service_id", "slot_date", "available_doctor_id");

-- AddForeignKey
ALTER TABLE "available_doctors" ADD CONSTRAINT "available_doctors_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_doctors" ADD CONSTRAINT "available_doctors_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_services" ADD CONSTRAINT "available_services_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_services" ADD CONSTRAINT "available_services_available_doctor_id_fkey" FOREIGN KEY ("available_doctor_id") REFERENCES "available_doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_available_service_id_fkey" FOREIGN KEY ("available_service_id") REFERENCES "available_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
