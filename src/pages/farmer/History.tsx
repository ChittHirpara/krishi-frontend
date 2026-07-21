import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScans } from '../../context/ScanContext';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Trash2, Filter } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../utils';

export function History() {
  const { scans, deleteScan } = useScans();
  const { addToast } = useToast();
  const [filterCrop, setFilterCrop] = useState<string>('all');

  const uniqueCrops = Array.from(new Set(scans.map(s => s.crop)));

  const filteredScans = filterCrop === 'all' 
    ? scans 
    : scans.filter(s => s.crop === filterCrop);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigating to the scan detail
    if (window.confirm('Are you sure you want to delete this scan?')) {
      deleteScan(id);
      addToast({
        variant: 'info',
        title: 'Scan Deleted',
        description: 'The scan has been removed from your history.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Scan History</h1>
          <p className="text-sm text-gray-500 mt-1">Review your past diagnoses</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <button
            onClick={() => setFilterCrop('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCrop === 'all' 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'bg-neutral-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            All Crops
          </button>
          {uniqueCrops.map(crop => (
            <button
              key={crop}
              onClick={() => setFilterCrop(crop)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCrop === crop 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {filteredScans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScans.map(scan => (
            <Link key={scan.id} to={`/app/scan/${scan.id}`} className="group">
              <Card className="h-full flex flex-col hover:border-[var(--color-primary)]/50 transition-colors">
                <div className="h-40 w-full relative rounded-t-2xl overflow-hidden">
                  <img src={scan.imageUrl} alt={scan.crop} className={cn("w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", scan.status === 'pending' && "opacity-60 grayscale")} />
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
                <CardBody className="p-4 flex-1 flex flex-col justify-between relative">
                  <div>
                    <div className="flex justify-between items-start mb-1 pr-8">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                        {scan.status === 'pending' ? 'Queued for Analysis' : scan.diseaseName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{scan.crop}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {formatDistanceToNow(new Date(scan.date), { addSuffix: true })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {format(new Date(scan.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardBody className="py-12 text-center flex flex-col items-center">
            <Filter className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No scans found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {filterCrop === 'all' 
                ? "You haven't scanned any crops yet. Try scanning a leaf to get started."
                : `You don't have any scans for ${filterCrop}.`}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
