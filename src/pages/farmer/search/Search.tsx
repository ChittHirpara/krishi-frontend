import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Leaf, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../utils';

interface MockResult {
  id: string;
  treatmentName: string;
  crop: string;
  disease: string;
  snippet: string;
  relevance: string;
}

const MOCK_DATABASE: MockResult[] = [
  {
    id: '1',
    treatmentName: 'Chlorothalonil 75% WP',
    crop: 'Tomato',
    disease: 'Early Blight',
    snippet: 'Chemical fungicide effective against Alternaria solani. Apply 2g per liter of water. Observe 7-day PHI.',
    relevance: 'High Match'
  },
  {
    id: '2',
    treatmentName: 'Copper Soap',
    crop: 'Tomato',
    disease: 'Early Blight (Organic)',
    snippet: 'Organic alternative for blight management. Spray every 7-10 days ensuring good coverage of lower leaves.',
    relevance: 'Medium Match'
  },
  {
    id: '3',
    treatmentName: 'Mancozeb 75% WP',
    crop: 'Potato',
    disease: 'Late Blight',
    snippet: 'Broad-spectrum protectant fungicide. Preventative spray before disease appearance is crucial during humid weather.',
    relevance: 'High Match'
  },
  {
    id: '4',
    treatmentName: 'Crop Rotation',
    crop: 'General',
    disease: 'Soil-borne pathogens',
    snippet: 'Cultural practice to prevent disease buildup. Avoid planting Solanaceae crops in the same field consecutively.',
    relevance: 'Low Match'
  },
  {
    id: '5',
    treatmentName: 'Neem Oil Extract',
    crop: 'Wheat',
    disease: 'Rust',
    snippet: 'Botanical extract with fungicidal properties. Acts as a preventative measure for leaf rust in early stages.',
    relevance: 'Medium Match'
  }
];

export function Search() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MockResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query);
      } else if (query.trim().length === 0) {
        setResults([]);
        setHasSearched(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = (q: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate network delay for semantic search feel
    setTimeout(() => {
      const lowerQ = q.toLowerCase();
      const filtered = MOCK_DATABASE.filter(item => 
        item.treatmentName.toLowerCase().includes(lowerQ) ||
        item.disease.toLowerCase().includes(lowerQ) ||
        item.crop.toLowerCase().includes(lowerQ) ||
        item.snippet.toLowerCase().includes(lowerQ)
      );
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col gap-1 shrink-0 mt-4 md:mt-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
          Smart Search
        </h1>
        <p className="text-sm text-gray-500">Semantic search across treatments, diseases, and protocols</p>
      </div>

      <div className="relative shrink-0">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'organic tomato blight' or 'rust treatment'"
          className="block w-full pl-11 pr-10 py-4 bg-white dark:bg-neutral-900 border border-[var(--color-border)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow text-gray-900 dark:text-gray-100 shadow-sm"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasSearched ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-50 py-12">
            <BookOpen className="w-16 h-16" />
            <p className="font-medium">Type a query to search our agricultural knowledge base</p>
          </div>
        ) : isSearching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-sm animate-pulse">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-16" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full w-20" />
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full w-24" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4 pb-4">
            <p className="text-sm font-semibold text-gray-500 mb-2">Found {results.length} results</p>
            {results.map((result) => (
              <Card key={result.id} className="hover:border-[var(--color-primary)]/50 transition-colors group cursor-pointer">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg font-bold text-[var(--color-primary)] group-hover:underline">{result.treatmentName}</h3>
                    <Badge variant={result.relevance === 'High Match' ? 'green' : result.relevance === 'Medium Match' ? 'amber' : 'gray'}>
                      {result.relevance}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {result.snippet}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                      <Leaf className="w-3 h-3 text-green-600" />
                      {result.crop}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-xs font-medium text-red-600 dark:text-red-400">
                      {result.disease}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No matching treatments or protocols found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
