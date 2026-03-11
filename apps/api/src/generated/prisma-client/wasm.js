
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
  name: 'name',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BranchScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  status: 'status',
  poc: 'poc',
  address: 'address',
  resources: 'resources',
  counters: 'counters',
  shelves: 'shelves',
  gondolas: 'gondolas',
  brandId: 'brandId',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
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
  parent_id: 'parent_id',
  branchId: 'branchId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemScalarFieldEnum = {
  id: 'id',
  sku: 'sku',
  name: 'name',
  description: 'description',
  brandName: 'brandName',
  gtin: 'gtin',
  batch: 'batch',
  expiry: 'expiry',
  productionDate: 'productionDate',
  barcode: 'barcode',
  qrCode: 'qrCode',
  serialNumber: 'serialNumber',
  upc: 'upc',
  boxLength: 'boxLength',
  boxWidth: 'boxWidth',
  boxHeight: 'boxHeight',
  boxWeight: 'boxWeight',
  tenantId: 'tenantId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
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
  scheduledDate: 'scheduledDate',
  scheduledTime: 'scheduledTime',
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
  scannedAt: 'scannedAt',
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
  variance: 'variance'
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

exports.Prisma.SignoffScalarFieldEnum = {
  id: 'id',
  auditId: 'auditId',
  userId: 'userId',
  signature: 'signature',
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
  Signoff: 'Signoff',
  AuditLog: 'AuditLog'
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
