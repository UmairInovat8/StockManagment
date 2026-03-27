/*
  Warnings:

  - The `status` column on the `Audit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `AuditSection` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `ImportJob` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[auditId,locationId]` on the table `AuditSection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'STARTING');

-- CreateEnum
CREATE TYPE "SectionStatus" AS ENUM ('OPEN', 'LOCKED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "AuditStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "AuditSection" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "SectionStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "AuditSohBaseline" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CountEvent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ImportJob" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "AuditSection_auditId_locationId_key" ON "AuditSection"("auditId", "locationId");

-- CreateIndex
CREATE INDEX "CountEvent_sectionId_itemId_idx" ON "CountEvent"("sectionId", "itemId");
