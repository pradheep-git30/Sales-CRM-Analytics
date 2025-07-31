'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  history: string[];
  onQueryClick: (query: string) => void;
  onClearHistory: () => void;
}

export function HistorySidebar({ history, onQueryClick, onClearHistory }: HistorySidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <History className="h-4 w-4" />
          <span className="sr-only">Query History</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Query History</SheetTitle>
        </SheetHeader>
        {history.length > 0 ? (
          <>
            <ScrollArea className="h-[calc(100%-120px)] my-4 pr-4">
              <div className="flex flex-col gap-2">
                {history.map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-left h-auto whitespace-normal"
                    onClick={() => onQueryClick(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter>
                <Button variant="destructive" onClick={onClearHistory} className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear History
                </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No history yet.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
