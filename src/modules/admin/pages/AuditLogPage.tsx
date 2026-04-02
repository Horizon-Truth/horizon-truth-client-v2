import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  User,
  Shield,
  Activity,
  Calendar,
  Info,
  Download
} from 'lucide-react';
import { auditLogService } from '@/services/audit-log.service';
import type { AuditLogItem } from '@/services/audit-log.service';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [entityType, setEntityType] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['audit-logs', page, limit, entityType, actionFilter],
    queryFn: () => auditLogService.getLogs({ page, limit, entityType, action: actionFilter }),
  });

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const handlePageChange = (newPage: number) => {