import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Camera, Image as ImageIcon, MapPin } from 'lucide-react';
import { useScans } from '../../context/ScanContext';
import { useOffline } from '../../context/OfflineContext';

export function Scanner() {
  const [crop, setCrop] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingText, setAnalyzingText] = useState('');
  const { addScan } = useScans();
  const { isOffline } = useOffline();
  const navigate = useNavigate();

  const handleCapture = () => {
    setHasImage(true);
  };

  const handleSubmit = () => {
    if (!hasImage || !crop) return;
    
    if (isOffline) {
      const scanId = addScan({
        crop,
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80',
        status: 'pending'
      });
      navigate(`/app/scan/${scanId}`);
      return;
    }
    
    setIsAnalyzing(true);
    setAnalyzingText('Detecting leaf boundary...');

    setTimeout(() => setAnalyzingText('Checking disease patterns...'), 800);
    setTimeout(() => setAnalyzingText('Almost done...'), 1600);

    setTimeout(() => {
      // Create a mock scan result for the selected crop
      const scanId = addScan({
        crop,
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80',
        diseaseName: 'Early Blight',
        scientificName: 'Alternaria solani',
        confidence: 85,
        status: 'diseased',
        predictions: [
          { name: 'Early Blight', probability: 85 },
          { name: 'Late Blight', probability: 10 },
          { name: 'Healthy', probability: 5 },
        ],
        treatment: {
          chemical: {
            type: 'chemical',
            name: 'Chlorothalonil 75% WP',
            dosage: '2g per liter of water',
            safetyNote: 'PHI: 7 days.',
            preventionTips: ['Rotate crops', 'Avoid overhead irrigation']
          },
          organic: {
            type: 'organic',
            name: 'Copper Soap',
            dosage: 'Spray every 7-10 days',
            safetyNote: 'Safe for organic farming.',
            preventionTips: ['Ensure good air circulation']
          }
        }
      });
      navigate(`/app/scan/${scanId}`);
    }, 2500);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
        <div className="w-64 h-64 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--color-primary)]">
          <img 
            src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80" 
            alt="Leaf" 
            className="w-full h-full object-cover blur-sm opacity-80"
          />
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)] shadow-[0_0_15px_3px_var(--color-primary)] animate-scanline" />
          <div className="absolute inset-0 border-2 border-dashed border-[var(--color-primary)]/50 rounded-3xl scale-90" />
        </div>
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-xl font-bold text-[var(--color-primary)] animate-pulse">Analyzing...</h2>
          <p className="text-sm text-gray-500 font-medium">{analyzingText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Scan Crop</h1>
        <p className="text-sm text-gray-500">Position the leaf within the frame</p>
      </div>

      <Select
        label="Select Crop Type"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        options={[
          { label: 'Select crop...', value: '' },
          { label: 'Tomato', value: 'Tomato' },
          { label: 'Wheat', value: 'Wheat' },
          { label: 'Cotton', value: 'Cotton' },
          { label: 'Rice', value: 'Rice' },
          { label: 'Chili', value: 'Chili' },
          { label: 'Sugarcane', value: 'Sugarcane' },
          { label: 'Groundnut', value: 'Groundnut' },
        ]}
        required
      />

      <Card className="overflow-hidden bg-black/5 dark:bg-black/20">
        <div className="aspect-[3/4] relative flex items-center justify-center">
          {hasImage ? (
            <img 
              src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80" 
              alt="Captured" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-4 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center text-gray-400">
              <Camera className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-medium">Camera View</span>
            </div>
          )}
          
          {/* Leaf outline guide */}
          <div className="absolute inset-8 border border-white/30 rounded-[100px_10px_100px_10px] pointer-events-none" />
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            aria-label="Capture Image"
          >
            <Camera className="w-8 h-8" />
          </button>
          
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all"
            aria-label="Upload from Gallery"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Add location</span>
          </div>
          <div className="w-11 h-6 bg-[var(--color-primary)] rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>

        <Button 
          className="w-full py-4 text-base" 
          disabled={!hasImage || !crop}
          onClick={handleSubmit}
        >
          Submit for Diagnosis
        </Button>
      </div>
    </div>
  );
}
