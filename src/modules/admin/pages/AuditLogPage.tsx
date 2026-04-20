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
            </div>
            Audit Logs
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Track all administrative operations and system changes.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black italic uppercase rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter by action (e.g. POST, scenario)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-600"
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-600 appearance-none"
            value={entityType}
            onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
          >
            <option value="">All Entity Types</option>
            <option value="users">Users</option>
            <option value="engine">Engine (Scenarios/Scenes)</option>
            <option value="organizations">Organizations</option>
            <option value="reports">Reports</option>
            <option value="blogs">Blogs</option>
            <option value="resources">Resources</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 rounded-2xl text-primary font-bold text-sm">
          <Info size={16} />
          <span>Real-time administrative tracking enabled.</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Network Info</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-500 font-bold italic">
                    Failed to load audit logs. Please check your permissions.
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                    No matching audit logs found.
                  </td>
                </tr>
              ) : (
                data?.items.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</span>
                        <span className="text-[10px] font-mono text-slate-400">{format(new Date(log.createdAt), 'HH:mm:ss')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{log.user?.username || 'System'}</span>
                          <span className="text-[10px] font-medium text-slate-400">{log.user?.email || 'automated@horizon'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight",
                          log.action.includes('POST') ? "bg-emerald-500/10 text-emerald-600" :
                          log.action.includes('PUT') || log.action.includes('PATCH') ? "bg-blue-500/10 text-blue-600" :
                          log.action.includes('DELETE') ? "bg-red-500/10 text-red-600" : "bg-slate-500/10 text-slate-600"
                        )}>
                          {log.action.split(' ')[0]}
                        </span>
                        <span className="text-sm font-medium text-slate-600 truncate max-w-[200px]" title={log.action}>
                          {log.action.split(' ')[1] || log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 capitalize">{log.entityType}</span>
                        <span className="text-[10px] font-mono text-slate-400">{log.entityId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Activity size={12} />
                        <span className="text-[10px] font-mono">{log.ipAddress || 'unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold italic text-slate-500">
              Showing {data.items.length} of {data.total} logs
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                  const pageNum = i + 1; // Simplistic pagination
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-xl font-bold transition-all shadow-sm",
                        page === pageNum ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal/Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-xl h-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black italic tracking-tight text-slate-900 uppercase">Log Details</h2>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedLog.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-full hover:bg-white hover:shadow-xl transition-all"
              >
                <ChevronRight size={24} className="transform rotate-0" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Calendar size={12} /> Date & Time
                  </span>
                  <p className="text-sm font-bold text-slate-700">{format(new Date(selectedLog.createdAt), 'PPP p')}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity size={12} /> Action Method
                  </span>
                  <p className="text-sm font-black text-primary">{selectedLog.action.split(' ')[0]}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request Path</span>
                <p className="text-sm font-mono bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 break-all">
                  {selectedLog.action.split(' ')[1] || selectedLog.action}
                </p>
              </div>

              {/* Payload Data */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Metadata / Payload</span>
                  <div className="bg-slate-900 rounded-3xl p-6 overflow-hidden">
                    <pre className="text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Agent</span>
                  <p className="text-[10px] font-sans text-slate-500 italic leading-relaxed">
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/30">
              <button 
                onClick={() => setSelectedLog(null)}
                className="w-full py-4 bg-slate-900 text-white font-black italic uppercase rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
