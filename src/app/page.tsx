'use client';

import { useState, useEffect } from 'react';
import type { DataFormattingAnalysisOutput } from '@/ai/flows/data-formatting-analysis';
import { getSalesAnalytics } from '@/app/actions';
import { QueryForm } from '@/components/analytica/query-form';
import { ResultsDisplay } from '@/components/analytica/results-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, BrainCircuit } from 'lucide-react';
import { ThemeToggle } from '@/components/analytica/theme-toggle';
import { HistorySidebar } from '@/components/analytica/history-sidebar';
import { toast } from '@/hooks/use-toast';
import { GenAiLoading } from '@/components/analytica/gen-ai-loading';

export default function HomePage() {
  const [result, setResult] = useState<DataFormattingAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('analytica-query-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  const addToHistory = (query: string) => {
    if(!query) return;
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 50);
    setHistory(newHistory);
    try {
      localStorage.setItem('analytica-query-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  };

  const handleQuerySubmit = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentQuery(query);
    addToHistory(query);

    const response = await getSalesAnalytics(query);

    if (response.error) {
      setError(response.error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      })
    } else if (response.data) {
      setResult(response.data);
    }
    setLoading(false);
  };
  
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('analytica-query-history');
    } catch (e) {
      console.error('Failed to clear history from localStorage', e);
    }
  };

  const handleTimeframeQuery = (timeframe: string) => {
    const newQuery = `${currentQuery} for the last ${timeframe}`;
    handleQuerySubmit(newQuery);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-slate-950">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline tracking-tighter">Analytica</h1>
          </div>
          <div className="flex items-center gap-2">
            <HistorySidebar history={history} onQueryClick={handleQuerySubmit} onClearHistory={clearHistory} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8 mb-8 rounded-lg bg-card border shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-headline animate-in fade-in slide-in-from-top-4 duration-500">
              AI-Powered Data Analytics
            </h2>
            <p className="mt-4 text-center text-lg text-muted-foreground animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
              Ask any product or sales-related query to get real-time data, insights, and visualizations.
            </p>
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
              <QueryForm onSubmit={handleQuerySubmit} loading={loading} />
            </div>
          </div>
          <div className="mt-12">
            {loading && <GenAiLoading />}
            {error && !loading && (
              <Alert variant="destructive" className="animate-in fade-in duration-300">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && <ResultsDisplay data={result} onFollowUpClick={handleQuerySubmit} onTimeframeClick={handleTimeframeQuery} />}
          </div>
        </div>
      </main>
      <footer className="p-4 border-t mt-8 bg-card/50">
        <p className="text-center text-sm text-muted-foreground">
          Powered by Firebase AI Studio and Gemini.
        </p>
      </footer>
    </div>
  );
}
