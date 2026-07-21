import React from 'react';
import { Activity, Database, Server, Bell, CheckCircle2 } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { cn } from '../../../utils';

function StatusTile({ title, status, uptime, icon: Icon }: { title: string, status: 'Operational'|'Degraded', uptime: string, icon: React.ElementType }) {
  const isOk = status === 'Operational';
  return (
    <Card>
      <CardBody className="p-5 flex items-center gap-4">
        <div className={cn("p-3 rounded-xl shrink-0", isOk ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500")}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOk ? "bg-green-400" : "bg-amber-400")}></span>
              <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", isOk ? "bg-green-500" : "bg-amber-500")}></span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{status} ({uptime})</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function SystemHealth() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-[var(--color-primary)]" />
          System Health
        </h1>
        <p className="text-sm font-medium text-gray-500">Live infrastructure overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusTile title="Core API" status="Operational" uptime="99.99%" icon={Server} />
        <StatusTile title="Database" status="Operational" uptime="99.99%" icon={Database} />
        <StatusTile title="AI Model Service" status="Operational" uptime="99.95%" icon={Activity} />
        <StatusTile title="Notification Service" status="Operational" uptime="99.98%" icon={Bell} />
      </div>

      <Card className="flex-1 min-h-[300px]">
        <CardBody className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">All Systems Go</h2>
            <p className="text-gray-500 max-w-md mx-auto">Infrastructure is routing normally. No active incidents or degraded performance across regional clusters.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
