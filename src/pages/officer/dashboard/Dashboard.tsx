import React from 'react';
import { Card, CardBody } from '../../../components/ui/Card';
import { TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react';
import { cn } from '../../../utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const SCAN_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  scans: Math.floor(Math.random() * 50) + 20 + (i > 20 ? i * 2 : 0) // slight upward trend at the end
}));

const DISEASE_DATA = [
  { name: 'Early Blight', count: 145 },
  { name: 'Late Blight', count: 98 },
  { name: 'Leaf Rust', count: 76 },
  { name: 'Powdery Mildew', count: 42 },
  { name: 'Aphids', count: 31 },
];

function StatCard({ title, value, trend, isPositive }: { title: string, value: string, trend: string, isPositive: boolean }) {
  return (
    <Card>
      <CardBody className="p-5">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">{title}</h3>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
          <div className={cn("flex items-center text-sm font-medium", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {trend}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function OfficerDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[var(--color-primary)]" />
          Dashboard
        </h1>
        <p className="text-sm font-medium text-[var(--color-primary)]/80">Showing data for: Ahmedabad District</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        <StatCard title="Total Scans (Month)" value="1,248" trend="12%" isPositive={true} />
        <StatCard title="Active Outbreaks" value="3" trend="1" isPositive={false} />
        <StatCard title="Average Confidence" value="89%" trend="2.4%" isPositive={true} />
        <StatCard title="Farmers Reached" value="412" trend="8%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Scan Volume Chart */}
        <Card className="flex flex-col h-full">
          <CardBody className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Scan Volume (Last 30 Days)</h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SCAN_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} minTickGap={30} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="scans" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Top Diseases Chart */}
        <Card className="flex flex-col h-full">
          <CardBody className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Top Diseases Detected (Month)</h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISEASE_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
