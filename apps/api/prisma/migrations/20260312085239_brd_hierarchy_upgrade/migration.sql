-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('PHARMACY', 'RETAIL');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('SHELF', 'COUNTER', 'GONDOLA', 'BIN');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_code" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" UUID NOT NULL,
    "brand_name" TEXT NOT NULL,
    "brand_code" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "profileUrl" TEXT,
    "profileContent" TEXT,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" UUID NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_code" TEXT NOT NULL,
    "type" "BranchType" NOT NULL DEFAULT 'RETAIL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "poc" TEXT,
    "branch_location" TEXT,
    "resources_assigned" INTEGER DEFAULT 0,
    "counters_count" INTEGER DEFAULT 0,
    "shelves_count" INTEGER DEFAULT 0,
    "gondolas_count" INTEGER DEFAULT 0,
    "area_manager_name" TEXT,
    "business_entity_type" TEXT,
    "invoice_to" TEXT,
    "count_schedule_date" TIMESTAMP(3),
    "metadata" JSONB DEFAULT '{}',
    "parentId" UUID,
    "brandId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "UserBranchAccess" (
    "userId" UUID NOT NULL,
    "branchId" UUID NOT NULL,

    CONSTRAINT "UserBranchAccess_pkey" PRIMARY KEY ("userId","branchId")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "qrValue" TEXT NOT NULL,
    "locationType" "LocationType" NOT NULL DEFAULT 'SHELF',
    "parent_id" UUID,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" UUID NOT NULL,
    "sku_code" TEXT NOT NULL,
    "sku_name" TEXT NOT NULL,
    "description" TEXT,
    "client_sku_code" TEXT,
    "quantity" DOUBLE PRECISION DEFAULT 0,
    "size_dimensions" TEXT,
    "status" TEXT DEFAULT 'ACTIVE',
    "uom" TEXT DEFAULT 'EA',
    "unit_cost_price" DOUBLE PRECISION DEFAULT 0,
    "brand_name" TEXT,
    "gtin" TEXT,
    "batch" TEXT,
    "expiry" TIMESTAMP(3),
    "productionDate" TIMESTAMP(3),
    "barcode" TEXT,
    "qrCode" TEXT,
    "serialNumber" TEXT,
    "upc_code" TEXT,
    "box_dimensions" JSONB,
    "metadata" JSONB DEFAULT '{}',
    "brandId" UUID,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemIdentifier" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "itemId" UUID NOT NULL,

    CONSTRAINT "ItemIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "audit_date_time" TIMESTAMP(3),
    "suggestedChanges" JSONB,
    "transfersCleared" BOOLEAN NOT NULL DEFAULT false,
    "itemsArranged" BOOLEAN NOT NULL DEFAULT false,
    "internetApproved" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgmentLog" JSONB,
    "reminderStatus" TEXT DEFAULT 'NONE',
    "checklistAckAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "pharmacistSigned" BOOLEAN NOT NULL DEFAULT false,
    "tenantId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditSection" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "assignedUserId" UUID,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "lockReason" TEXT,
    "lockedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditAssignment" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "checkInAt" TIMESTAMP(3),
    "checkOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditSohBaseline" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditSohBaseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountEvent" (
    "id" UUID NOT NULL,
    "client_event_id" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "looseQuantity" DOUBLE PRECISION DEFAULT 0,
    "isExternalApiData" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" TEXT DEFAULT 'MANUAL',
    "scannedAt" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER DEFAULT 0,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "CountEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionItemTotal" (
    "id" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SectionItemTotal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VarianceTotal" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "sohQuantity" DOUBLE PRECISION NOT NULL,
    "countedQuantity" DOUBLE PRECISION NOT NULL,
    "variance" DOUBLE PRECISION NOT NULL,
    "adjustmentQty" DOUBLE PRECISION DEFAULT 0,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "pharmacistRemarks" TEXT,

    CONSTRAINT "VarianceTotal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscrepancyCase" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscrepancyCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscrepancyAction" (
    "id" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscrepancyAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSignoff" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "rating" INTEGER,
    "varianceAck" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT NOT NULL,
    "checklistAnswers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSignoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalSignoff" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "grnStatus" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "signature" TEXT NOT NULL,
    "teamSignature" TEXT,
    "checklistAnswers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalSignoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "auditId" UUID,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_company_code_key" ON "Tenant"("company_code");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_brand_code_key" ON "Brand"("brand_code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branch_code_key" ON "Branch"("branch_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_tenantId_key" ON "Role"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_branchId_code_key" ON "Location"("branchId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Location_branchId_qrValue_key" ON "Location"("branchId", "qrValue");

-- CreateIndex
CREATE UNIQUE INDEX "Item_tenantId_sku_code_key" ON "Item"("tenantId", "sku_code");

-- CreateIndex
CREATE UNIQUE INDEX "ItemIdentifier_value_key" ON "ItemIdentifier"("value");

-- CreateIndex
CREATE UNIQUE INDEX "AuditSohBaseline_auditId_itemId_key" ON "AuditSohBaseline"("auditId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "CountEvent_client_event_id_key" ON "CountEvent"("client_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "SectionItemTotal_sectionId_itemId_key" ON "SectionItemTotal"("sectionId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "VarianceTotal_auditId_itemId_key" ON "VarianceTotal"("auditId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscrepancyCase_auditId_itemId_key" ON "DiscrepancyCase"("auditId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSignoff_auditId_key" ON "ClientSignoff"("auditId");

-- CreateIndex
CREATE UNIQUE INDEX "InternalSignoff_auditId_key" ON "InternalSignoff"("auditId");

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAccess" ADD CONSTRAINT "UserBranchAccess_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAccess" ADD CONSTRAINT "UserBranchAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemIdentifier" ADD CONSTRAINT "ItemIdentifier_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSection" ADD CONSTRAINT "AuditSection_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSection" ADD CONSTRAINT "AuditSection_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSection" ADD CONSTRAINT "AuditSection_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditAssignment" ADD CONSTRAINT "AuditAssignment_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditAssignment" ADD CONSTRAINT "AuditAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSohBaseline" ADD CONSTRAINT "AuditSohBaseline_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditSohBaseline" ADD CONSTRAINT "AuditSohBaseline_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountEvent" ADD CONSTRAINT "CountEvent_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountEvent" ADD CONSTRAINT "CountEvent_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "AuditSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionItemTotal" ADD CONSTRAINT "SectionItemTotal_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionItemTotal" ADD CONSTRAINT "SectionItemTotal_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "AuditSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VarianceTotal" ADD CONSTRAINT "VarianceTotal_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscrepancyAction" ADD CONSTRAINT "DiscrepancyAction_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "DiscrepancyCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSignoff" ADD CONSTRAINT "ClientSignoff_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSignoff" ADD CONSTRAINT "ClientSignoff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalSignoff" ADD CONSTRAINT "InternalSignoff_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalSignoff" ADD CONSTRAINT "InternalSignoff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
