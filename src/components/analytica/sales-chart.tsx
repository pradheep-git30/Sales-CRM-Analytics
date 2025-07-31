
'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useToast } from '@/hooks/use-toast';

type ChartType = 'bar' | 'line' | 'pie' | 'area';

interface SalesChartProps {
  dataTable: {
    columns: string[];
    rows: (string | number)[][];
  };
  initialChartType: string;
  suggestedVisuals: string[];
}

const ICONS: Record<string, React.ElementType> = {
  bar: BarChart2,
  line: LineChartIcon,
  pie: PieChartIcon,
  area: AreaChartIcon,
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function SalesChart({ dataTable, initialChartType, suggestedVisuals }: SalesChartProps) {
  const { toast } = useToast();
  
  const validVisuals = useMemo(() => {
    const visuals = new Set(suggestedVisuals.filter(v => ['bar', 'line', 'pie', 'area'].includes(v)));
    if (visuals.size === 0) visuals.add('bar'); // Default to bar if no valid visuals
    return Array.from(visuals);
  }, [suggestedVisuals]);

  const validInitialChart = useMemo(() => {
    return validVisuals.includes(initialChartType) ? initialChartType as ChartType : validVisuals[0] as ChartType;
  }, [validVisuals, initialChartType]);

  const [chartType, setChartType] = useState<ChartType>(validInitialChart);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChartType(validInitialChart);
  }, [validInitialChart]);

  const { chartData, xAxisKey, dataKeys } = useMemo(() => {
    const { columns, rows } = dataTable;
    if (!columns || columns.length < 2 || !rows || rows.length === 0) {
      return { chartData: [], xAxisKey: '', dataKeys: [] };
    }

    const firstRow = rows[0];
    const stringColumnIndex = columns.findIndex((col, index) => typeof firstRow[index] === 'string');
    const _xAxisKey = stringColumnIndex !== -1 ? columns[stringColumnIndex] : columns[0];
    
    const numericKeys: string[] = [];
    columns.forEach((col, index) => {
      if (typeof firstRow[index] === 'number') {
        numericKeys.push(col);
      }
    });
    
    const _dataKeys = numericKeys.length > 0 ? numericKeys : columns.filter(c => c !== _xAxisKey);

    const formattedData = rows.map(row => {
      const obj: { [key: string]: string | number } = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    return { chartData: formattedData, xAxisKey: _xAxisKey, dataKeys: _dataKeys };
  }, [dataTable]);
  
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    if (chartType === 'pie') {
      chartData.forEach((entry, index) => {
        const name = entry[xAxisKey] as string;
        if (name) {
          config[name] = {
            label: name,
            color: CHART_COLORS[index % CHART_COLORS.length],
          };
        }
      });
    } else {
      dataKeys.forEach((key, index) => {
        config[key] = {
          label: key,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
      });
    }
    return config;
  }, [dataKeys, chartType, chartData, xAxisKey]);
  
  const handleDownload = () => {
    if (!chartContainerRef.current) return;
    const svgElement = chartContainerRef.current.querySelector('svg');
    if (!svgElement) {
      toast({ variant: 'destructive', title: 'Error', description: 'Chart could not be downloaded.' });
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--background').trim() || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'analytica-chart.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load chart image for download.' });
    };
    img.src = url;
  };
  
  if (chartData.length === 0 || dataKeys.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Not enough data to display a chart.</p>;
  }

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        const pieDataKey = dataKeys[0];
        if (!pieDataKey) return null;
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip content={<ChartTooltipContent nameKey={xAxisKey} hideLabel />} />
              <Pie data={chartData} dataKey={pieDataKey} nameKey={xAxisKey} cx="50%" cy="50%" outerRadius={120}>
                 {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Legend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xAxisKey} tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Legend content={<ChartLegendContent />} />
              {dataKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} radius={4} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xAxisKey} tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Legend content={<ChartLegendContent />} />
              {dataKeys.map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xAxisKey} tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Legend content={<ChartLegendContent />} />
              {dataKeys.map((key, index) => (
                <Area key={key} type="monotone" dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke={CHART_COLORS[index % CHART_COLORS.length]} stackId="1" />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap justify-center gap-2">
          {validVisuals.map((vis) => {
            const Icon = ICONS[vis] || BarChart2;
            return (
              <Button
                key={vis}
                variant={chartType === vis ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType(vis as ChartType)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {vis.charAt(0).toUpperCase() + vis.slice(1)}
              </Button>
            );
          })}
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
      </div>

      <ChartContainer ref={chartContainerRef} config={chartConfig} className="w-full h-auto aspect-video">
        {renderChart()}
      </ChartContainer>
    </div>
  );
}
