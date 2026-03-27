/*
  Warnings:

  - You are about to drop the column `branchId` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `checklistAckAt` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacistSigned` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `reminderStatus` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `assignedUserId` on the `AuditSection` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AuditSection` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `AuditSection` table. All the data in the column will be lost.
  - You are about to drop the column `lockReason` on the `AuditSection` table. All the data in the column will be lost.
  - You are about to drop the column `lockedBy` on the `AuditSection` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AuditSection` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `dataSource` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `durationSeconds` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `isExternalApiData` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `looseQuantity` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `scannedAt` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CountEvent` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `productionDate` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `locationType` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `qrValue` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenant_id,sku_code]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branch_id,code]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branch_id,qr_value]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `AuditSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand_id` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `CountEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scanned_at` to the `CountEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_id` to the `CountEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `CountEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `CountEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_value` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "AuditSection" DROP CONSTRAINT "AuditSection_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "CountEvent" DROP CONSTRAINT "CountEvent_itemId_fkey";

-- DropForeignKey
ALTER TABLE "CountEvent" DROP CONSTRAINT "CountEvent_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_branchId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenantId_fkey";

-- DropIndex
DROP INDEX "CountEvent_sectionId_itemId_idx";

-- DropIndex
DROP INDEX "Item_tenantId_sku_code_key";

-- DropIndex
DROP INDEX "Location_branchId_code_key";

-- DropIndex
DROP INDEX "Location_branchId_qrValue_key";

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "branchId",
DROP COLUMN "checklistAckAt",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "pharmacistSigned",
DROP COLUMN "reminderStatus",
DROP COLUMN "resolvedAt",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "branch_id" UUID NOT NULL,
ADD COLUMN     "checklist_ack_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "pharmacist_signed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminder_status" TEXT DEFAULT 'NONE',
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AuditSection" DROP COLUMN "assignedUserId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "lockReason",
DROP COLUMN "lockedBy",
DROP COLUMN "updatedAt",
ADD COLUMN     "assigned_user_id" UUID,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "lock_reason" TEXT,
ADD COLUMN     "locked_by" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "brandId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "brand_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CountEvent" DROP COLUMN "createdAt",
DROP COLUMN "dataSource",
DROP COLUMN "deletedAt",
DROP COLUMN "durationSeconds",
DROP COLUMN "isExternalApiData",
DROP COLUMN "itemId",
DROP COLUMN "looseQuantity",
DROP COLUMN "scannedAt",
DROP COLUMN "sectionId",
DROP COLUMN "tenantId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_source" TEXT DEFAULT 'MANUAL',
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "duration_seconds" INTEGER DEFAULT 0,
ADD COLUMN     "is_external_api_data" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "item_id" UUID NOT NULL,
ADD COLUMN     "loose_quantity" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "scanned_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "section_id" UUID NOT NULL,
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "brandId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "productionDate",
DROP COLUMN "qrCode",
DROP COLUMN "serialNumber",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "brand_id" UUID,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "production_date" TIMESTAMP(3),
ADD COLUMN     "qr_code" TEXT,
ADD COLUMN     "serial_number" TEXT,
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "branchId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "locationType",
DROP COLUMN "qrValue",
DROP COLUMN "updatedAt",
ADD COLUMN     "branch_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "location_type" "LocationType" NOT NULL DEFAULT 'SHELF',
ADD COLUMN     "qr_value" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "CountEvent_section_id_item_id_idx" ON "CountEvent"("section_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_tenant_id_sku_code_key" ON "Item"("tenant_id", "sku_code");

-- CreateIndex
CREATE UNIQUE INDEX "Location_branch_id_code_key" ON "Location"("branch_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Location_branch_id_qr_value_key" ON "Location"("branch_id", "qr_value");

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSection" ADD CONSTRAINT "AuditSection_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountEvent" ADD CONSTRAINT "CountEvent_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountEvent" ADD CONSTRAINT "CountEvent_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "AuditSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
