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

export interface AuditLogResponse {
  items: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const auditLogService = {
  getLogs: async (params: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entityType?: string;
  }) => {
    // Mapping internal actionFilter to what the backend expects (action)
    const { page, limit, userId, action, entityType } = params;
    const response = await api.get<AuditLogResponse>('/audit-logs', { 
      params: { page, limit, userId, action, entityType } 
    });
    return response.data;
  },
};
