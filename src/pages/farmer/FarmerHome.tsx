import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useScans } from '../../context/ScanContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Camera, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils';

export function FarmerHome() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { scans } = useScans();
  
  const getGreeting = () => {
    switch (language) {
      case 'HI': return 'नमस्ते';
      case 'GU': return 'નમસ્તે';
      default: return 'Namaste';
    }
  };

  const recentScans = scans.slice(0, 5);
  const activeAlerts = scans.filter(s => s.status === 'diseased' && s.confidence > 80).slice(0, 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          {getGreeting()}, {user?.name?.split(' ')[0]} <span className="animate-wave origin-bottom-right inline-block">👋</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Ready to check your crops today?
        </p>
      </div>

      {activeAlerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-400">Active Alert in Your Area</h4>
            <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-1">High risk of {activeAlerts[0].diseaseName} reported nearby. Check your {activeAlerts[0].crop} crops.</p>
          </div>
        </div>
      )}

      <Link to="/app/scan" className="block group">
        <div className="bg-[var(--color-primary)] dark:bg-green-700 rounded-2xl p-6 text-white shadow-lg shadow-[var(--color-primary)]/20 relative overflow-hidden transition-transform group-active:scale-[0.98]">
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 py-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Scan a Leaf</h2>
              <p className="text-white/80 text-sm mt-1">Identify diseases instantly</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 pointer-events-none">
            <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            </svg>
          </div>
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Scans</h3>
          <Link to="/app/history" className="text-sm font-medium text-[var(--color-primary)] flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentScans.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x scrollbar-hide">
            {recentScans.map(scan => (
              <Link 
                key={scan.id} 
                to={`/app/scan/${scan.id}`}
                className="shrink-0 w-64 snap-start"
              >
                <Card className="h-full hover:border-[var(--color-primary)]/50 transition-colors">
                  <div className="h-32 w-full overflow-hidden rounded-t-2xl relative">
                    <img src={scan.imageUrl} alt={scan.crop} className={cn("w-full h-full object-cover", scan.status === 'pending' && "opacity-60 grayscale")} />
                    <div className="absolute top-2 right-2">
                      {scan.status === 'pending' ? (
                        <Badge variant="gray" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">Pending Sync</Badge>
                      ) : (
                        <Badge variant={scan.status === 'healthy' ? 'green' : (scan.confidence || 0) > 80 ? 'red' : 'amber'}>
                          {scan.confidence}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                        {scan.status === 'pending' ? 'Queued for Analysis' : scan.diseaseName}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{scan.crop}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                      {formatDistanceToNow(new Date(scan.date), { addSuffix: true })}
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="text-center py-8">
              <p className="text-gray-500 text-sm">No recent scans. Try scanning a leaf!</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
