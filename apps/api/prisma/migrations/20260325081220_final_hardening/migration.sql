/*
  Warnings:

  - You are about to drop the column `auditId` on the `AuditAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `checkInAt` on the `AuditAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `checkOutAt` on the `AuditAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AuditAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuditAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `AuditSohBaseline` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AuditSohBaseline` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `AuditSohBaseline` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `AuditSohBaseline` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `ClientSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `checklistAnswers` on the `ClientSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ClientSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ClientSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `varianceAck` on the `ClientSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `caseId` on the `DiscrepancyAction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `DiscrepancyAction` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `DiscrepancyCase` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `DiscrepancyCase` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `DiscrepancyCase` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `ErrorLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ErrorLog` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ErrorLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ErrorLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ImportJob` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ImportJob` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `ImportJob` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ImportJob` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `InternalSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `checklistAnswers` on the `InternalSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `InternalSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `grnStatus` on the `InternalSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `teamSignature` on the `InternalSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InternalSignoff` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ItemIdentifier` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `NotificationLog` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `NotificationLog` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Role` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permissionId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `SectionItemTotal` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `SectionItemTotal` table. All the data in the column will be lost.
  - The primary key for the `UserBranchAccess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branchId` on the `UserBranchAccess` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserBranchAccess` table. All the data in the column will be lost.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleId` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the column `adjustmentQty` on the `VarianceTotal` table. All the data in the column will be lost.
  - You are about to drop the column `auditId` on the `VarianceTotal` table. All the data in the column will be lost.
  - You are about to drop the column `countedQuantity` on the `VarianceTotal` table. All the data in the column will be lost.
  - You are about to drop the column `isResolved` on the `VarianceTotal` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `VarianceTotal` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacistRemarks` on the `VarianceTotal` table. All the data in the column will be lost.
  - You are about to drop the column `sohQuantity` on the `VarianceTotal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audit_id,item_id]` on the table `AuditSohBaseline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audit_id]` on the table `ClientSignoff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audit_id,item_id]` on the table `DiscrepancyCase` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audit_id]` on the table `InternalSignoff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,tenant_id]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[section_id,item_id]` on the table `SectionItemTotal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audit_id,item_id]` on the table `VarianceTotal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audit_id` to the `AuditAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `AuditAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `AuditSohBaseline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `AuditSohBaseline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `ClientSignoff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ClientSignoff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `case_id` to the `DiscrepancyAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `DiscrepancyCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `DiscrepancyCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `ErrorLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `ErrorLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ErrorLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `ImportJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ImportJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `InternalSignoff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `InternalSignoff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `ItemIdentifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `NotificationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `SectionItemTotal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_id` to the `SectionItemTotal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `UserBranchAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserBranchAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audit_id` to the `VarianceTotal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `counted_quantity` to the `VarianceTotal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `VarianceTotal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soh_quantity` to the `VarianceTotal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditAssignment" DROP CONSTRAINT "AuditAssignment_auditId_fkey";

-- DropForeignKey
ALTER TABLE "AuditAssignment" DROP CONSTRAINT "AuditAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_auditId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuditSohBaseline" DROP CONSTRAINT "AuditSohBaseline_auditId_fkey";

-- DropForeignKey
ALTER TABLE "AuditSohBaseline" DROP CONSTRAINT "AuditSohBaseline_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ClientSignoff" DROP CONSTRAINT "ClientSignoff_auditId_fkey";

-- DropForeignKey
ALTER TABLE "ClientSignoff" DROP CONSTRAINT "ClientSignoff_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiscrepancyAction" DROP CONSTRAINT "DiscrepancyAction_caseId_fkey";

-- DropForeignKey
ALTER TABLE "InternalSignoff" DROP CONSTRAINT "InternalSignoff_auditId_fkey";

-- DropForeignKey
ALTER TABLE "InternalSignoff" DROP CONSTRAINT "InternalSignoff_userId_fkey";

-- DropForeignKey
ALTER TABLE "ItemIdentifier" DROP CONSTRAINT "ItemIdentifier_itemId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationLog" DROP CONSTRAINT "NotificationLog_auditId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_auditId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "SectionItemTotal" DROP CONSTRAINT "SectionItemTotal_itemId_fkey";

-- DropForeignKey
ALTER TABLE "SectionItemTotal" DROP CONSTRAINT "SectionItemTotal_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "UserBranchAccess" DROP CONSTRAINT "UserBranchAccess_branchId_fkey";

-- DropForeignKey
ALTER TABLE "UserBranchAccess" DROP CONSTRAINT "UserBranchAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "VarianceTotal" DROP CONSTRAINT "VarianceTotal_itemId_fkey";

-- DropIndex
DROP INDEX "AuditSohBaseline_auditId_itemId_key";

-- DropIndex
DROP INDEX "ClientSignoff_auditId_key";

-- DropIndex
DROP INDEX "DiscrepancyCase_auditId_itemId_key";

-- DropIndex
DROP INDEX "ImportJob_tenantId_idx";

-- DropIndex
DROP INDEX "InternalSignoff_auditId_key";

-- DropIndex
DROP INDEX "Role_name_tenantId_key";

-- DropIndex
DROP INDEX "SectionItemTotal_sectionId_itemId_key";

-- DropIndex
DROP INDEX "VarianceTotal_auditId_itemId_key";

-- AlterTable
ALTER TABLE "AuditAssignment" DROP COLUMN "auditId",
DROP COLUMN "checkInAt",
DROP COLUMN "checkOutAt",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "check_in_at" TIMESTAMP(3),
ADD COLUMN     "check_out_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "auditId",
DROP COLUMN "createdAt",
DROP COLUMN "entityId",
DROP COLUMN "userId",
ADD COLUMN     "audit_id" UUID,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity_id" TEXT,
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "AuditSohBaseline" DROP COLUMN "auditId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "itemId",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ClientSignoff" DROP COLUMN "auditId",
DROP COLUMN "checklistAnswers",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
DROP COLUMN "varianceAck",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "checklist_answers" JSONB,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD COLUMN     "variance_ack" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DiscrepancyAction" DROP COLUMN "caseId",
DROP COLUMN "createdAt",
ADD COLUMN     "case_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DiscrepancyCase" DROP COLUMN "auditId",
DROP COLUMN "createdAt",
DROP COLUMN "itemId",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ErrorLog" DROP COLUMN "auditId",
DROP COLUMN "createdAt",
DROP COLUMN "itemId",
DROP COLUMN "userId",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ImportJob" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "InternalSignoff" DROP COLUMN "auditId",
DROP COLUMN "checklistAnswers",
DROP COLUMN "createdAt",
DROP COLUMN "grnStatus",
DROP COLUMN "teamSignature",
DROP COLUMN "userId",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "checklist_answers" JSONB,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "grn_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "team_signature" TEXT,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ItemIdentifier" DROP COLUMN "itemId",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "NotificationLog" DROP COLUMN "auditId",
DROP COLUMN "sentAt",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "auditId",
DROP COLUMN "createdAt",
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "tenantId",
ADD COLUMN     "tenant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "permissionId",
DROP COLUMN "roleId",
ADD COLUMN     "permission_id" UUID NOT NULL,
ADD COLUMN     "role_id" UUID NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id", "permission_id");

-- AlterTable
ALTER TABLE "SectionItemTotal" DROP COLUMN "itemId",
DROP COLUMN "sectionId",
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "section_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "UserBranchAccess" DROP CONSTRAINT "UserBranchAccess_pkey",
DROP COLUMN "branchId",
DROP COLUMN "userId",
ADD COLUMN     "branch_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "UserBranchAccess_pkey" PRIMARY KEY ("user_id", "branch_id");

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
DROP COLUMN "roleId",
DROP COLUMN "userId",
ADD COLUMN     "role_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id", "role_id");

-- AlterTable
ALTER TABLE "VarianceTotal" DROP COLUMN "adjustmentQty",
DROP COLUMN "auditId",
DROP COLUMN "countedQuantity",
DROP COLUMN "isResolved",
DROP COLUMN "itemId",
DROP COLUMN "pharmacistRemarks",
DROP COLUMN "sohQuantity",
ADD COLUMN     "adjustment_qty" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "audit_id" UUID NOT NULL,
ADD COLUMN     "counted_quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "is_resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "pharmacist_remarks" TEXT,
ADD COLUMN     "soh_quantity" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuditSohBaseline_audit_id_item_id_key" ON "AuditSohBaseline"("audit_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSignoff_audit_id_key" ON "ClientSignoff"("audit_id");

-- CreateIndex
CREATE UNIQUE INDEX "DiscrepancyCase_audit_id_item_id_key" ON "DiscrepancyCase"("audit_id", "item_id");

-- CreateIndex
CREATE INDEX "ImportJob_tenant_id_idx" ON "ImportJob"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "InternalSignoff_audit_id_key" ON "InternalSignoff"("audit_id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_tenant_id_key" ON "Role"("name", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "SectionItemTotal_section_id_item_id_key" ON "SectionItemTotal"("section_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "VarianceTotal_audit_id_item_id_key" ON "VarianceTotal"("audit_id", "item_id");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAccess" ADD CONSTRAINT "UserBranchAccess_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAccess" ADD CONSTRAINT "UserBranchAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemIdentifier" ADD CONSTRAINT "ItemIdentifier_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditAssignment" ADD CONSTRAINT "AuditAssignment_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditAssignment" ADD CONSTRAINT "AuditAssignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSohBaseline" ADD CONSTRAINT "AuditSohBaseline_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSohBaseline" ADD CONSTRAINT "AuditSohBaseline_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionItemTotal" ADD CONSTRAINT "SectionItemTotal_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionItemTotal" ADD CONSTRAINT "SectionItemTotal_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "AuditSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VarianceTotal" ADD CONSTRAINT "VarianceTotal_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscrepancyAction" ADD CONSTRAINT "DiscrepancyAction_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "DiscrepancyCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSignoff" ADD CONSTRAINT "ClientSignoff_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSignoff" ADD CONSTRAINT "ClientSignoff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalSignoff" ADD CONSTRAINT "InternalSignoff_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalSignoff" ADD CONSTRAINT "InternalSignoff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
