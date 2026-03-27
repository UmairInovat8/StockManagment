export interface Item {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventorySyncJob {
  id: string;
  status: 'STARTING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  errorLog?: string;
  tenantId: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  tenantId: string;
  role: 'ADMIN' | 'AUDITOR';
}
