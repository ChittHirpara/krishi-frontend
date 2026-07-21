import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';
import { useSystem } from '../../../context/SystemContext';
import { Card, CardBody } from '../../../components/ui/Card';
import { formatDistanceToNow } from 'date-fns';

export function AuditLogs() {
  const { auditLogs } = useSystem();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[var(--color-primary)]" />
          Audit Logs
        </h1>
        <p className="text-sm font-medium text-gray-500">Reverse-chronological feed of critical system actions.</p>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-neutral-50 dark:bg-neutral-900/50">
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Timestamp</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Actor</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Action</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{log.actor}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{log.action}</td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
