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
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await auditLogService.exportLogs({ 
        entityType, 
        action: actionFilter 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      // Optional: add a toast notification if we had one available, 
      // but let's stick to the requirements.
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ClipboardList size={28} />