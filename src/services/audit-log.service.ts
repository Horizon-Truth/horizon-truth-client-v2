import api from './api';

export interface AuditLogItem {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId: string;
  metadata: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}