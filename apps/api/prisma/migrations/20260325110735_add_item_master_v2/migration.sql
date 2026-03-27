/*
  Warnings:

  - You are about to drop the `Audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditSohBaseline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientSignoff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscrepancyAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscrepancyCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ErrorLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InternalSignoff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemIdentifier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SectionItemTotal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VarianceTotal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditAssignment" DROP CONSTRAINT "AuditAssignment_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditAssignment" DROP CONSTRAINT "AuditAssignment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditSection" DROP CONSTRAINT "AuditSection_assigned_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditSection" DROP CONSTRAINT "AuditSection_auditId_fkey";

-- DropForeignKey
ALTER TABLE "AuditSection" DROP CONSTRAINT "AuditSection_locationId_fkey";

-- DropForeignKey
ALTER TABLE "AuditSohBaseline" DROP CONSTRAINT "AuditSohBaseline_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "AuditSohBaseline" DROP CONSTRAINT "AuditSohBaseline_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "ClientSignoff" DROP CONSTRAINT "ClientSignoff_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "ClientSignoff" DROP CONSTRAINT "ClientSignoff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CountEvent" DROP CONSTRAINT "CountEvent_item_id_fkey";

-- DropForeignKey
ALTER TABLE "CountEvent" DROP CONSTRAINT "CountEvent_section_id_fkey";

-- DropForeignKey
ALTER TABLE "DiscrepancyAction" DROP CONSTRAINT "DiscrepancyAction_case_id_fkey";

-- DropForeignKey
ALTER TABLE "InternalSignoff" DROP CONSTRAINT "InternalSignoff_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "InternalSignoff" DROP CONSTRAINT "InternalSignoff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemIdentifier" DROP CONSTRAINT "ItemIdentifier_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "NotificationLog" DROP CONSTRAINT "NotificationLog_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_audit_id_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "SectionItemTotal" DROP CONSTRAINT "SectionItemTotal_item_id_fkey";

-- DropForeignKey
ALTER TABLE "SectionItemTotal" DROP CONSTRAINT "SectionItemTotal_section_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBranchAccess" DROP CONSTRAINT "UserBranchAccess_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBranchAccess" DROP CONSTRAINT "UserBranchAccess_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_user_id_fkey";

-- DropForeignKey
ALTER TABLE "VarianceTotal" DROP CONSTRAINT "VarianceTotal_item_id_fkey";

-- DropTable
DROP TABLE "Audit";

-- DropTable
DROP TABLE "AuditAssignment";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "AuditSection";

-- DropTable
DROP TABLE "AuditSohBaseline";

-- DropTable
DROP TABLE "Branch";

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "ClientSignoff";

-- DropTable
DROP TABLE "CountEvent";

-- DropTable
DROP TABLE "DiscrepancyAction";

-- DropTable
DROP TABLE "DiscrepancyCase";

-- DropTable
DROP TABLE "ErrorLog";

-- DropTable
DROP TABLE "ImportJob";

-- DropTable
DROP TABLE "InternalSignoff";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "ItemIdentifier";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "NotificationLog";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "SectionItemTotal";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRole";

-- DropTable
DROP TABLE "VarianceTotal";

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_code" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_masters" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "item_masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "brand_name" TEXT NOT NULL,
    "brand_code" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "profileUrl" TEXT,
    "profileContent" TEXT,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
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
    "brand_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "qr_value" TEXT NOT NULL,
    "location_type" "LocationType" NOT NULL DEFAULT 'SHELF',
    "parent_id" UUID,
    "branch_id" UUID NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
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
    "production_date" TIMESTAMP(3),
    "barcode" TEXT,
    "qr_code" TEXT,
    "serial_number" TEXT,
    "upc_code" TEXT,
    "box_dimensions" JSONB,
    "metadata" JSONB DEFAULT '{}',
    "brand_id" UUID,
    "item_master_id" UUID,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_identifiers" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "item_id" UUID NOT NULL,

    CONSTRAINT "item_identifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'DRAFT',
    "audit_date_time" TIMESTAMP(3),
    "suggestedChanges" JSONB,
    "transfersCleared" BOOLEAN NOT NULL DEFAULT false,
    "itemsArranged" BOOLEAN NOT NULL DEFAULT false,
    "internetApproved" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgmentLog" JSONB,
    "reminder_status" TEXT DEFAULT 'NONE',
    "checklist_ack_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "pharmacist_signed" BOOLEAN NOT NULL DEFAULT false,
    "tenant_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "item_master_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_sections" (
    "id" UUID NOT NULL,
    "auditId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "assigned_user_id" UUID,
    "status" "SectionStatus" NOT NULL DEFAULT 'OPEN',
    "lock_reason" TEXT,
    "locked_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "audit_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_assignments" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "check_in_at" TIMESTAMP(3),
    "check_out_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_soh_baselines" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "audit_soh_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "count_events" (
    "id" UUID NOT NULL,
    "client_event_id" TEXT NOT NULL,
    "tenant_id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "loose_quantity" DOUBLE PRECISION DEFAULT 0,
    "is_external_api_data" BOOLEAN NOT NULL DEFAULT false,
    "data_source" TEXT DEFAULT 'MANUAL',
    "scanned_at" TIMESTAMP(3) NOT NULL,
    "duration_seconds" INTEGER DEFAULT 0,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "count_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_item_totals" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "section_item_totals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variance_totals" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "soh_quantity" DOUBLE PRECISION NOT NULL,
    "counted_quantity" DOUBLE PRECISION NOT NULL,
    "variance" DOUBLE PRECISION NOT NULL,
    "adjustment_qty" DOUBLE PRECISION DEFAULT 0,
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "pharmacist_remarks" TEXT,

    CONSTRAINT "variance_totals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discrepancy_cases" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discrepancy_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discrepancy_actions" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discrepancy_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_signoffs" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER,
    "variance_ack" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT NOT NULL,
    "checklist_answers" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_signoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_signoffs" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grn_status" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "signature" TEXT NOT NULL,
    "team_signature" TEXT,
    "checklist_answers" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_signoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "audit_id" UUID,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entity_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_jobs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "item_master_id" UUID,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "total" INTEGER NOT NULL DEFAULT 0,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_company_code_key" ON "tenants"("company_code");

-- CreateIndex
CREATE UNIQUE INDEX "item_masters_tenant_id_name_key" ON "item_masters"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_brand_code_key" ON "brands"("brand_code");

-- CreateIndex
CREATE UNIQUE INDEX "branches_branch_code_key" ON "branches"("branch_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_tenant_id_key" ON "roles"("name", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "locations_branch_id_code_key" ON "locations"("branch_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "locations_branch_id_qr_value_key" ON "locations"("branch_id", "qr_value");

-- CreateIndex
CREATE INDEX "items_item_master_id_idx" ON "items"("item_master_id");

-- CreateIndex
CREATE UNIQUE INDEX "items_tenant_id_sku_code_key" ON "items"("tenant_id", "sku_code");

-- CreateIndex
CREATE INDEX "item_identifiers_value_idx" ON "item_identifiers"("value");

-- CreateIndex
CREATE UNIQUE INDEX "audit_sections_auditId_locationId_key" ON "audit_sections"("auditId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "audit_soh_baselines_audit_id_item_id_key" ON "audit_soh_baselines"("audit_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "count_events_client_event_id_key" ON "count_events"("client_event_id");

-- CreateIndex
CREATE INDEX "count_events_section_id_item_id_idx" ON "count_events"("section_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "section_item_totals_section_id_item_id_key" ON "section_item_totals"("section_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "variance_totals_audit_id_item_id_key" ON "variance_totals"("audit_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "discrepancy_cases_audit_id_item_id_key" ON "discrepancy_cases"("audit_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "client_signoffs_audit_id_key" ON "client_signoffs"("audit_id");

-- CreateIndex
CREATE UNIQUE INDEX "internal_signoffs_audit_id_key" ON "internal_signoffs"("audit_id");

-- CreateIndex
CREATE INDEX "import_jobs_tenant_id_idx" ON "import_jobs"("tenant_id");

-- AddForeignKey
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAccess" ADD CONSTRAINT "UserBranchAccess_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAccess" ADD CONSTRAINT "UserBranchAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_item_master_id_fkey" FOREIGN KEY ("item_master_id") REFERENCES "item_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_identifiers" ADD CONSTRAINT "item_identifiers_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_item_master_id_fkey" FOREIGN KEY ("item_master_id") REFERENCES "item_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_sections" ADD CONSTRAINT "audit_sections_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_sections" ADD CONSTRAINT "audit_sections_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_sections" ADD CONSTRAINT "audit_sections_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_assignments" ADD CONSTRAINT "audit_assignments_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_assignments" ADD CONSTRAINT "audit_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_soh_baselines" ADD CONSTRAINT "audit_soh_baselines_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_soh_baselines" ADD CONSTRAINT "audit_soh_baselines_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_events" ADD CONSTRAINT "count_events_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_events" ADD CONSTRAINT "count_events_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "audit_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_item_totals" ADD CONSTRAINT "section_item_totals_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_item_totals" ADD CONSTRAINT "section_item_totals_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "audit_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variance_totals" ADD CONSTRAINT "variance_totals_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discrepancy_actions" ADD CONSTRAINT "discrepancy_actions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "discrepancy_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_signoffs" ADD CONSTRAINT "client_signoffs_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_signoffs" ADD CONSTRAINT "client_signoffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_signoffs" ADD CONSTRAINT "internal_signoffs_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_signoffs" ADD CONSTRAINT "internal_signoffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_item_master_id_fkey" FOREIGN KEY ("item_master_id") REFERENCES "item_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
