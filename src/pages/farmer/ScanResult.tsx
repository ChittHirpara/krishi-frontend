import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScans } from '../../context/ScanContext';
import { useToast } from '../../components/ui/Toast';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfidenceRing } from '../../components/ui/ConfidenceRing';
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils';

export function ScanResultView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scans } = useScans();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'chemical' | 'organic'>('chemical');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const scan = scans.find(s => s.id === id);

  if (!scan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Scan not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/app')}>Go Home</Button>
      </div>
    );
  }

  if (scan.status === 'pending') {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-24 md:pb-6 animate-in fade-in duration-500 text-center">
        <div className="flex items-center gap-3 mb-6 text-left">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Analysis Queued</h1>
        </div>
        
        <Card className="overflow-hidden border-dashed border-2 border-gray-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="h-48 w-full relative">
            <img src={scan.imageUrl} alt={scan.crop} className="w-full h-full object-cover grayscale opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-4 rounded-full">
                <Clock className="w-12 h-12 text-amber-500" />
              </div>
            </div>
          </div>
          <CardBody className="py-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Queued — will sync when back online</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              No connection detected. Your {scan.crop} scan is saved locally and will be diagnosed automatically once you're back online.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const isLowConfidence = (scan.confidence || 0) < 65;
  const isHealthy = scan.status === 'healthy';

  const handleFeedback = (isPositive: boolean) => {
    setFeedbackGiven(true);
    addToast({
      variant: 'success',
      title: 'Feedback Received',
      description: 'Thanks for helping improve our model!',
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24 md:pb-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Analysis Result</h1>
      </div>

      {isLowConfidence && !isHealthy && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-400">Low Confidence</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                Our AI isn't entirely sure about this result. We recommend requesting an expert review.
              </p>
            </div>
          </div>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none">
            Request Expert Review
          </Button>
        </div>
      )}

      {isHealthy && (
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0" />
          <div>
            <h4 className="font-bold text-green-900 dark:text-green-400">Crop looks healthy!</h4>
            <p className="text-sm text-green-700 dark:text-green-300/80">No immediate action needed.</p>
          </div>
        </div>
      )}

      <Card>
        <div className="h-48 w-full relative">
          <img src={scan.imageUrl} alt={scan.crop} className="w-full h-full object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="text-white">
              <h2 className="text-2xl font-bold">{scan.diseaseName}</h2>
              {scan.scientificName && (
                <p className="text-sm text-white/80 italic mt-0.5">{scan.scientificName}</p>
              )}
            </div>
            <div className="bg-white rounded-full p-1 shadow-lg">
              <ConfidenceRing value={scan.confidence} size={50} strokeWidth={4} />
            </div>
          </div>
        </div>
        
        <CardBody className="border-t border-[var(--color-border)] dark:border-neutral-800">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Top Predictions</h3>
          <div className="space-y-3">
            {scan.predictions.map((pred, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium w-24 truncate">{pred.name}</span>
                <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                    style={{ width: `${pred.probability}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 font-medium w-8 text-right">{pred.probability}%</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {!isHealthy && scan.treatment && (
        <Card>
          <div className="flex border-b border-[var(--color-border)] dark:border-neutral-800">
            {['chemical', 'organic'].map((tab) => {
              const hasContent = scan.treatment![tab as keyof typeof scan.treatment];
              if (!hasContent) return null;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors",
                    activeTab === tab
                      ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          
          <CardBody className="space-y-4">
            {scan.treatment[activeTab] ? (
              <>
                <div>
                  <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Recommended Product</h4>
                  <p className="font-medium text-lg">{scan.treatment[activeTab]!.name}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Dosage & Application</h4>
                  <p className="text-sm">{scan.treatment[activeTab]!.dosage}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <h4 className="text-xs text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Safety Note
                  </h4>
                  <p className="text-sm text-amber-900 dark:text-amber-300">{scan.treatment[activeTab]!.safetyNote}</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Prevention Tips</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {scan.treatment[activeTab]!.preventionTips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{tip}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No {activeTab} treatment available for this disease.</p>
            )}
          </CardBody>
        </Card>
      )}

      <div className="text-center pt-4">
        {!feedbackGiven ? (
          <>
            <p className="text-sm font-medium text-gray-500 mb-3">Was this diagnosis correct?</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => handleFeedback(true)} className="gap-2">
                <ThumbsUp className="w-4 h-4" /> Yes
              </Button>
              <Button variant="secondary" onClick={() => handleFeedback(false)} className="gap-2">
                <ThumbsDown className="w-4 h-4" /> No
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-full inline-block">
            Thanks for your feedback!
          </p>
        )}
      </div>
    </div>
  );
}
