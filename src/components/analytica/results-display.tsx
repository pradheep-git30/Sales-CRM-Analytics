import type { DataFormattingAnalysisOutput } from '@/ai/flows/data-formatting-analysis';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SalesChart } from './sales-chart';
import { SalesTable } from './sales-table';
import { Lightbulb, BarChart, List, FileText, CalendarRange } from 'lucide-react';
import { Separator } from '../ui/separator';
import { TypewriterEffect } from './typewriter-effect';

interface ResultsDisplayProps {
  data: DataFormattingAnalysisOutput;
  onFollowUpClick: (query: string) => void;
  onTimeframeClick: (timeframe: string) => void;
}

const timeframeOptions = ["3 months", "6 months", "9 months", "1 year", "2 years", "5 years"];

export function ResultsDisplay({ data, onFollowUpClick, onTimeframeClick }: ResultsDisplayProps) {
  const { summary, insight, chart_type, suggested_visuals, follow_ups, data_table, sources, estimated, confidence, note } = data;

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-top-8 duration-500">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="animate-in fade-in-0 slide-in-from-left-8 duration-500 delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="text-primary" /> Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypewriterEffect text={summary} />
          </CardContent>
        </Card>
        <Card className="animate-in fade-in-0 slide-in-from-right-8 duration-500 delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb className="text-primary" /> Business Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypewriterEffect text={insight} />
          </CardContent>
          {(estimated || note || confidence) && (
              <CardFooter className="flex-wrap gap-2 pt-4">
                {note && <p className="text-sm text-muted-foreground italic w-full">{note}</p>}
                {estimated && <Badge variant="outline">Estimated Data</Badge>}
                {confidence && <Badge variant="secondary">{`Confidence: ${confidence}%`}</Badge>}
              </CardFooter>
            )}
        </Card>
      </div>

      <Card className="animate-in fade-in-0 slide-in-from-bottom-8 duration-500 delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <BarChart className="text-primary" /> Data Visualization
          </CardTitle>
          <CardDescription>
            Visual representation of the sales data. You can switch between chart types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart
            dataTable={data_table}
            initialChartType={chart_type}
            suggestedVisuals={suggested_visuals}
          />
        </CardContent>
      </Card>

      <Card className="animate-in fade-in-0 slide-in-from-bottom-8 duration-500 delay-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <List className="text-primary" /> Data Table
          </CardTitle>
          <CardDescription>
            The raw data used for the analysis and visualization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable dataTable={data_table} />
        </CardContent>
      </Card>

      <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-500 delay-400">
        <h3 className="text-xl font-semibold mb-4 text-center font-headline flex items-center justify-center gap-2">
            <CalendarRange className="text-primary" />
            Refine Timeframe
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
            {timeframeOptions.map((t, i) => (
                <Button key={i} variant="outline" onClick={() => onTimeframeClick(t)}>
                    {t}
                </Button>
            ))}
        </div>
      </div>
      
      {follow_ups && follow_ups.length > 0 && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-500 delay-500">
          <Separator className="my-8" />
          <h3 className="text-xl font-semibold mb-4 text-center font-headline">Suggested Follow-ups</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {follow_ups.map((q, i) => (
              <Button key={i} variant="ghost" onClick={() => onFollowUpClick(q)}>
                {q}
              </Button>
            ))}
          </div>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-500 delay-600">
          <Separator className="my-8" />
          <h3 className="text-xl font-semibold mb-2 font-headline">Sources</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {sources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
