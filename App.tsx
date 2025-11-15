
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import QuoteInput from './components/QuoteInput';
import QuoteDisplay from './components/QuoteDisplay';
import Loader from './components/Loader';
import { generateQuotes } from './services/geminiService';
import type { QuoteData } from './types';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [quotes, setQuotes] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!keywords.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setQuotes(null);

    try {
      const result = await generateQuotes(keywords);
      setQuotes(result);
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate quotes: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords, isLoading]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <QuoteInput
            keywords={keywords}
            setKeywords={setKeywords}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          {isLoading && <Loader />}
          {error && <p className="text-center text-red-400 mt-6 bg-red-900/50 p-3 rounded-lg">{error}</p>}
          {quotes && !isLoading && (
            <div className="mt-12 animate-fade-in">
              <QuoteDisplay quotes={quotes} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
