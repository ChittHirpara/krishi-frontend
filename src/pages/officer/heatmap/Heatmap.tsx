import React, { useState } from 'react';
import { Map, AlertTriangle } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../utils';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

interface DistrictData {
  id: string;
  name: string;
  intensity: number; // 0 to 100
  disease: string;
  cases: number;
}

interface AlertData {
  id: string;
  district: string;
  disease: string;
  severity: Severity;
  cases: number;
  date: string;
}

const DISTRICTS: DistrictData[] = [
  { id: '1', name: 'Ahmedabad', intensity: 20, disease: 'Aphids', cases: 12 },
  { id: '2', name: 'Surat', intensity: 85, disease: 'Early Blight', cases: 145 },
  { id: '3', name: 'Vadodara', intensity: 10, disease: 'Healthy', cases: 0 },
  { id: '4', name: 'Rajkot', intensity: 65, disease: 'Late Blight', cases: 89 },
  { id: '5', name: 'Bhavnagar', intensity: 45, disease: 'Leaf Rust', cases: 54 },
  { id: '6', name: 'Jamnagar', intensity: 5, disease: 'Healthy', cases: 0 },
  { id: '7', name: 'Junagadh', intensity: 30, disease: 'Powdery Mildew', cases: 31 },
  { id: '8', name: 'Gandhinagar', intensity: 15, disease: 'Whitefly', cases: 8 },
  { id: '9', name: 'Anand', intensity: 92, disease: 'Early Blight', cases: 178 },
];

const ALERTS: AlertData[] = [
  { id: 'a1', district: 'Anand', disease: 'Early Blight', severity: 'Critical', cases: 178, date: 'Oct 12' },
  { id: 'a2', district: 'Surat', disease: 'Early Blight', severity: 'High', cases: 145, date: 'Oct 14' },
  { id: 'a3', district: 'Rajkot', disease: 'Late Blight', severity: 'Medium', cases: 89, date: 'Oct 15' },
  { id: 'a4', district: 'Bhavnagar', disease: 'Leaf Rust', severity: 'Low', cases: 54, date: 'Oct 16' },
];

function getIntensityColor(intensity: number) {
  if (intensity === 0) return 'bg-neutral-100 dark:bg-neutral-800';
  if (intensity < 25) return 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-900/50';
  if (intensity < 50) return 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-900/50';
  if (intensity < 75) return 'bg-amber-200 dark:bg-amber-900/60 border-amber-300 dark:border-amber-900/50';
  return 'bg-red-200 dark:bg-red-900/60 border-red-300 dark:border-red-900/50';
}

function getBadgeVariant(severity: Severity) {
  switch (severity) {
    case 'Critical': return 'red';
    case 'High': return 'red';
    case 'Medium': return 'amber';
    case 'Low': return 'green';
    default: return 'gray';
  }
}

export function Heatmap() {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="w-6 h-6 text-[var(--color-primary)]" />
          Outbreak Heatmap
        </h1>
        <p className="text-sm font-medium text-[var(--color-primary)]/80">Showing data for: Gujarat State Overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto pb-4">
        {/* Heatmap Grid */}
        <Card className="lg:col-span-2 flex flex-col h-full min-h-[400px]">
          <CardBody className="p-5 flex-1 flex flex-col relative">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">District Intensity</h3>
            
            <div className="flex-1 flex items-center justify-center relative">
              <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg aspect-square">
                {DISTRICTS.map((district) => (
                  <div
                    key={district.id}
                    onMouseEnter={() => setHoveredDistrict(district)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className={cn(
                      "relative rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-center p-2 text-center",
                      getIntensityColor(district.intensity),
                      hoveredDistrict?.id === district.id ? "scale-105 shadow-md z-10" : "scale-100"
                    )}
                  >
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm md:text-base">
                      {district.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tooltip */}
              {hoveredDistrict && hoveredDistrict.cases > 0 && (
                <div className="absolute top-4 right-4 bg-white dark:bg-neutral-900 border border-[var(--color-border)] p-4 rounded-xl shadow-xl z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">{hoveredDistrict.name}</h4>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Disease: <span className="font-semibold text-gray-900 dark:text-gray-200">{hoveredDistrict.disease}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Active Cases: <span className="font-semibold text-gray-900 dark:text-gray-200">{hoveredDistrict.cases}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200" /> None</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-100 border border-green-200" /> Low</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200" /> Moderate</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-200 border border-amber-300" /> High</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-200 border border-red-300" /> Critical</div>
            </div>
          </CardBody>
        </Card>

        {/* Alerts List */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Active Outbreak Alerts
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {ALERTS.map(alert => (
              <Card key={alert.id} className="hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{alert.district}</h4>
                    <Badge variant={getBadgeVariant(alert.severity)} className={alert.severity === 'Critical' ? 'animate-pulse' : ''}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">{alert.disease}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{alert.cases} reported cases</span>
                      <span>Detected: {alert.date}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
