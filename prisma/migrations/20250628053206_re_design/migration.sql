/*
  Warnings:

  - You are about to drop the column `slot_id` on the `available_services` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admin_id]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[available_doctor_id,service_id]` on the table `available_services` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctor_id]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patient_id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_id` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fees` to the `available_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "available_services" DROP CONSTRAINT "available_services_slot_id_fkey";

-- DropIndex
DROP INDEX "available_services_available_doctor_id_slot_id_slot_date_se_key";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "admin_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "available_services" DROP COLUMN "slot_id",
ADD COLUMN     "fees" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "doctor_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "patient_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "fees";

-- AlterTable
ALTER TABLE "time_slots" ADD COLUMN     "doctor_schedule_id" TEXT,
ALTER COLUMN "start_time" SET DATA TYPE TEXT,
ALTER COLUMN "end_time" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "doctor_profiles" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientProfile" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "allergies" TEXT,
    "chronicDiseases" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_schedules" (
    "id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "day_of_week" INTEGER,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT,
    "treatment" JSONB,
    "prescription" JSONB,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profiles_doctorId_key" ON "doctor_profiles"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_patientId_key" ON "PatientProfile"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_admin_id_key" ON "admins"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "available_services_available_doctor_id_service_id_key" ON "available_services"("available_doctor_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_doctor_id_key" ON "doctors"("doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_patient_id_key" ON "patients"("patient_id");

-- AddForeignKey
ALTER TABLE "doctor_profiles" ADD CONSTRAINT "doctor_profiles_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfile" ADD CONSTRAINT "PatientProfile_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_doctor_schedule_id_fkey" FOREIGN KEY ("doctor_schedule_id") REFERENCES "doctor_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
