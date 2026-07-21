import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Badge } from '../../../components/ui/Badge';

const ACCURACY_DATA = [
  { date: 'Oct 1', accuracy: 88.5 },
  { date: 'Oct 5', accuracy: 89.2 },
  { date: 'Oct 10', accuracy: 90.1 },
  { date: 'Oct 15', accuracy: 91.4 },
  { date: 'Oct 20', accuracy: 92.8 },
  { date: 'Oct 25', accuracy: 94.2 },
  { date: 'Oct 30', accuracy: 95.1 },
];

const BREAKDOWN_DATA = [
  { category: 'Tomato / Early Blight', accuracy: '96.5%', sampleSize: 1240, status: 'Excellent' },
  { category: 'Potato / Late Blight', accuracy: '94.2%', sampleSize: 850, status: 'Good' },
  { category: 'Wheat / Leaf Rust', accuracy: '88.7%', sampleSize: 420, status: 'Needs Improvement' },
  { category: 'Cotton / Aphids', accuracy: '91.4%', sampleSize: 630, status: 'Good' },
];

export function ModelAccuracy() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-[var(--color-primary)]" />
          Model Accuracy
        </h1>
        <p className="text-sm font-medium text-gray-500">AI diagnostic performance based on agronomist and user feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Trend Chart */}
        <Card className="flex flex-col">
          <CardBody className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Aggregate Accuracy Trend (30 Days)</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACCURACY_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                    formatter={(val: number) => [`${val}%`, 'Accuracy']}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={4} dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Breakdown Table */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Category Breakdown</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-neutral-50 dark:bg-neutral-900/50">
                  <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Crop / Disease</th>
                  <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Accuracy</th>
                  <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Samples</th>
                  <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {BREAKDOWN_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{row.category}</td>
                    <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{row.accuracy}</td>
                    <td className="p-4 text-sm text-gray-500">{row.sampleSize}</td>
                    <td className="p-4 text-right">
                      <Badge variant={row.status === 'Excellent' ? 'green' : row.status === 'Good' ? 'green' : 'amber'}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
