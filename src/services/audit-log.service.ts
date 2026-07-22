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
    const { page, limit, userId, action, entityType } = params;
    const response = await api.get<AuditLogResponse>('/audit-logs', { 
      params: { page, limit, userId, action, entityType } 
    });
    return response.data;
  },

  exportLogs: async (params: {
    userId?: string;
    action?: string;
    entityType?: string;
  }) => {
    const { userId, action, entityType } = params;
    const response = await api.get('/audit-logs/export', {
      params: { userId, action, entityType },
      responseType: 'blob',
    });
    return response.data;
  },
};
