'use client';

export function GenAiLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse [animation-delay:-0.2s]"></div>
        <div className="absolute inset-4 rounded-full bg-primary/40 animate-pulse [animation-delay:-0.4s]"></div>
        <div className="absolute inset-6 flex items-center justify-center rounded-full bg-primary/50">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-foreground">
          Generating Insights...
        </p>
        <p className="text-muted-foreground">
          Please wait while the AI analyzes your query.
        </p>
      </div>
    </div>
  );
}
