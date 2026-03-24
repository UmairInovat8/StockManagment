
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  company_name: 'company_name',
  company_code: 'company_code',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  brand_name: 'brand_name',
  brand_code: 'brand_code',
  metadata: 'metadata',
  profileUrl: 'profileUrl',
  profileContent: 'profileContent',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BranchScalarFieldEnum = {
  id: 'id',
  branch_name: 'branch_name',
  branch_code: 'branch_code',
  type: 'type',
  status: 'status',
  poc: 'poc',
  branch_location: 'branch_location',
  resources_assigned: 'resources_assigned',
  counters_count: 'counters_count',
  shelves_count: 'shelves_count',
  gondolas_count: 'gondolas_count',
  area_manager_name: 'area_manager_name',
  business_entity_type: 'business_entity_type',
  invoice_to: 'invoice_to',
  count_schedule_date: 'count_schedule_date',
  metadata: 'metadata',
  parentId: 'parentId',
  brandId: 'brandId',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  tenantId: 'tenantId'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  roleId: 'roleId',
  permissionId: 'permissionId'
};

exports.Prisma.UserBranchAccessScalarFieldEnum = {
  userId: 'userId',
  branchId: 'branchId'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  code: 'code',
  qrValue: 'qrValue',
  locationType: 'locationType',
  parent_id: 'parent_id',
  branchId: 'branchId',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemScalarFieldEnum = {
  id: 'id',
  sku_code: 'sku_code',
  sku_name: 'sku_name',
  description: 'description',
  client_sku_code: 'client_sku_code',
  quantity: 'quantity',
  size_dimensions: 'size_dimensions',
  status: 'status',
  uom: 'uom',
  unit_cost_price: 'unit_cost_price',
  brand_name: 'brand_name',
  gtin: 'gtin',
  batch: 'batch',
  expiry: 'expiry',
  productionDate: 'productionDate',
  barcode: 'barcode',
  qrCode: 'qrCode',
  serialNumber: 'serialNumber',
  upc_code: 'upc_code',
  box_dimensions: 'box_dimensions',
  metadata: 'metadata',
  brandId: 'brandId',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ItemIdentifierScalarFieldEnum = {
  id: 'id',
  type: 'type',
  value: 'value',
  itemId: 'itemId'
};

exports.Prisma.AuditScalarFieldEnum = {
  id: 'id',
  name: 'name',
  status: 'status',
  audit_date_time: 'audit_date_time',
  suggestedChanges: 'suggestedChanges',
  transfersCleared: 'transfersCleared',
  itemsArranged: 'itemsArranged',
  internetApproved: 'internetApproved',
  acknowledgmentLog: 'acknowledgmentLog',
  reminderStatus: 'reminderStatus',
  checklistAckAt: 'checklistAckAt',
  resolvedAt: 'resolvedAt',
  pharmacistSigned: 'pharmacistSigned',
  tenantId: 'tenantId',
  branchId: 'branchId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditSectionScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  locationId: 'locationId',
  assignedUserId: 'assignedUserId',
  status: 'status',
  lockReason: 'lockReason',
  lockedBy: 'lockedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditAssignmentScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  userId: 'userId',
  checkInAt: 'checkInAt',
  checkOutAt: 'checkOutAt',
  createdAt: 'createdAt'
};

exports.Prisma.AuditSohBaselineScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  itemId: 'itemId',
  quantity: 'quantity',
  createdAt: 'createdAt'
};

exports.Prisma.CountEventScalarFieldEnum = {
  id: 'id',
  client_event_id: 'client_event_id',
  tenantId: 'tenantId',
  sectionId: 'sectionId',
  itemId: 'itemId',
  userId: 'userId',
  quantity: 'quantity',
  looseQuantity: 'looseQuantity',
  isExternalApiData: 'isExternalApiData',
  dataSource: 'dataSource',
  scannedAt: 'scannedAt',
  durationSeconds: 'durationSeconds',
  metadata: 'metadata'
};

exports.Prisma.SectionItemTotalScalarFieldEnum = {
  id: 'id',
  sectionId: 'sectionId',
  itemId: 'itemId',
  total: 'total'
};

exports.Prisma.VarianceTotalScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  itemId: 'itemId',
  sohQuantity: 'sohQuantity',
  countedQuantity: 'countedQuantity',
  variance: 'variance',
  adjustmentQty: 'adjustmentQty',
  isResolved: 'isResolved',
  pharmacistRemarks: 'pharmacistRemarks'
};

exports.Prisma.DiscrepancyCaseScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  itemId: 'itemId',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.DiscrepancyActionScalarFieldEnum = {
  id: 'id',
  caseId: 'caseId',
  type: 'type',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  type: 'type',
  data: 'data',
  createdAt: 'createdAt'
};

exports.Prisma.ClientSignoffScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  userId: 'userId',
  rating: 'rating',
  varianceAck: 'varianceAck',
  signature: 'signature',
  checklistAnswers: 'checklistAnswers',
  createdAt: 'createdAt'
};

exports.Prisma.InternalSignoffScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  userId: 'userId',
  grnStatus: 'grnStatus',
  notes: 'notes',
  signature: 'signature',
  teamSignature: 'teamSignature',
  checklistAnswers: 'checklistAnswers',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationLogScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  type: 'type',
  recipient: 'recipient',
  content: 'content',
  sentAt: 'sentAt'
};

exports.Prisma.ErrorLogScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  itemId: 'itemId',
  userId: 'userId',
  category: 'category',
  message: 'message',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.ImportJobScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  status: 'status',
  total: 'total',
  processed: 'processed',
  failed: 'failed',
  message: 'message',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.BranchType = exports.$Enums.BranchType = {
  PHARMACY: 'PHARMACY',
  RETAIL: 'RETAIL'
};

exports.LocationType = exports.$Enums.LocationType = {
  SHELF: 'SHELF',
  COUNTER: 'COUNTER',
  GONDOLA: 'GONDOLA',
  BIN: 'BIN'
};

exports.Prisma.ModelName = {
  Tenant: 'Tenant',
  Brand: 'Brand',
  Branch: 'Branch',
  User: 'User',
  Role: 'Role',
  Permission: 'Permission',
  UserRole: 'UserRole',
  RolePermission: 'RolePermission',
  UserBranchAccess: 'UserBranchAccess',
  Location: 'Location',
  Item: 'Item',
  ItemIdentifier: 'ItemIdentifier',
  Audit: 'Audit',
  AuditSection: 'AuditSection',
  AuditAssignment: 'AuditAssignment',
  AuditSohBaseline: 'AuditSohBaseline',
  CountEvent: 'CountEvent',
  SectionItemTotal: 'SectionItemTotal',
  VarianceTotal: 'VarianceTotal',
  DiscrepancyCase: 'DiscrepancyCase',
  DiscrepancyAction: 'DiscrepancyAction',
  Report: 'Report',
  ClientSignoff: 'ClientSignoff',
  InternalSignoff: 'InternalSignoff',
  AuditLog: 'AuditLog',
  NotificationLog: 'NotificationLog',
  ErrorLog: 'ErrorLog',
  ImportJob: 'ImportJob'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
