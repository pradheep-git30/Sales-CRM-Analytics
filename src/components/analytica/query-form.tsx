'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  loading: boolean;
}

const exampleQueries = [
  'iPhone sales in India 2023',
  'Compare Apple vs Samsung revenue in Asia 2024',
  'Top phone brands in Q1 2024 by revenue in USA',
  'EV vehicle growth in Germany between 2021 and 2024',
];

export function QueryForm({ onSubmit, loading }: QueryFormProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(query);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSubmit(example);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., iPhone sales in India 2023"
          className="flex-grow text-base"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !query.trim()} size="lg">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Send />
          )}
          <span className="sr-only">Submit Query</span>
        </Button>
      </form>
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
        <span className="text-sm text-muted-foreground mr-2 self-center">Try:</span>
        {exampleQueries.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleExampleClick(ex)}
            disabled={loading}
            className="text-sm text-primary hover:underline disabled:opacity-50 disabled:no-underline text-left"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
