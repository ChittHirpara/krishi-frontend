import React, { useState } from 'react';
import { Leaf, ShieldAlert, X, Edit2 } from 'lucide-react';
import { useSystem, Treatment } from '../../../context/SystemContext';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export function Treatments() {
  const { treatments } = useSystem();
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col relative">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="w-6 h-6 text-[var(--color-primary)]" />
          Treatment Library
        </h1>
        <p className="text-sm font-medium text-[var(--color-primary)]/80">Browse and propose edits to global crop treatments.</p>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {treatments.map(t => (
          <Card key={t.id} className="hover:border-[var(--color-primary)] transition-colors cursor-pointer group" onClick={() => setSelectedTreatment(t)}>
            <CardBody className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="green" className="capitalize">{t.crop}</Badge>
                  <Badge variant="red" className="capitalize">{t.disease}</Badge>
                </div>
                <Badge variant={t.type === 'Organic' ? 'green' : 'amber'}>{t.type}</Badge>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{t.dosage}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                {t.preventionTips}
              </p>
              
              <div className="mt-auto flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="line-clamp-2">{t.safetyNotes}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {selectedTreatment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardBody className="p-0 flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="green" className="capitalize">{selectedTreatment.crop}</Badge>
                    <Badge variant="red" className="capitalize">{selectedTreatment.disease}</Badge>
                    <Badge variant={selectedTreatment.type === 'Organic' ? 'green' : 'amber'}>{selectedTreatment.type}</Badge>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Treatment Details</h2>
                </div>
                <button 
                  onClick={() => setSelectedTreatment(null)}
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Dosage & Method</h3>
                  <div className="text-gray-900 dark:text-gray-100 font-medium bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-[var(--color-border)]">
                    {selectedTreatment.dosage}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Safety Notes</h3>
                  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{selectedTreatment.safetyNotes}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Prevention Tips</h3>
                  <div className="text-gray-700 dark:text-gray-300 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-[var(--color-border)]">
                    <p className="leading-relaxed">{selectedTreatment.preventionTips}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--color-border)] bg-neutral-50 dark:bg-neutral-900/50 rounded-b-2xl">
                <button 
                  onClick={() => setSelectedTreatment(null)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
