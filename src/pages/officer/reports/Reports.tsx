import React, { useState } from 'react';
import { FileText, Download, Plus, FileBarChart, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { cn } from '../../../utils';

interface Report {
  id: string;
  name: string;
  dateRange: string;
  generatedOn: string;
  status: 'Ready' | 'Generating';
}

const INITIAL_REPORTS: Report[] = [
  { id: '1', name: 'Monthly Disease Surveillance', dateRange: 'Sep 1 - Sep 30, 2026', generatedOn: 'Oct 1, 2026', status: 'Ready' },
  { id: '2', name: 'Q3 Crop Health Summary', dateRange: 'Jul 1 - Sep 30, 2026', generatedOn: 'Oct 2, 2026', status: 'Ready' },
  { id: '3', name: 'Ahmedabad District Weekly', dateRange: 'Oct 8 - Oct 15, 2026', generatedOn: 'Oct 16, 2026', status: 'Ready' },
];

export function Reports() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  const handleDownload = (name: string) => {
    addToast({
      variant: 'success',
      title: 'Download Started',
      description: `Downloading ${name}.pdf to your device.`
    });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate generation progress
    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(false);
      
      const newReport: Report = {
        id: Date.now().toString(),
        name: 'Custom Ad-hoc Report',
        dateRange: 'Oct 1 - Oct 21, 2026',
        generatedOn: 'Today',
        status: 'Ready'
      };
      
      setReports([newReport, ...reports]);
      
      addToast({
        variant: 'success',
        title: 'Report Generated',
        description: 'Your new report is ready for download.'
      });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mt-4 md:mt-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-[var(--color-primary)]" />
            Reports
          </h1>
          <p className="text-sm font-medium text-[var(--color-primary)]/80">Showing data for: Ahmedabad District</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Generate New Report
        </button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-neutral-50 dark:bg-neutral-900/50">
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Report Name</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Date Range</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Generated On</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-gray-900 dark:text-gray-100">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{report.dateRange}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{report.generatedOn}</td>
                  <td className="p-4">
                    <Badge variant={report.status === 'Ready' ? 'green' : 'amber'}>
                      {report.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDownload(report.name)}
                      disabled={report.status !== 'Ready'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Generate Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <CardBody className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Generate Report</h2>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                  <select className="w-full bg-neutral-100 dark:bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Quarter</option>
                    <option>Custom Range...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Scope</label>
                  <select className="w-full bg-neutral-100 dark:bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option>Ahmedabad District</option>
                    <option>All Gujarat (State Overview)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    disabled={isGenerating}
                    className="flex-1 py-2.5 font-semibold text-gray-600 hover:bg-neutral-100 dark:text-gray-400 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isGenerating}
                    className="flex-1 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate PDF'
                    )}
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
