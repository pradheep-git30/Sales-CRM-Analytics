'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface SalesTableProps {
  dataTable: {
    columns: string[];
    rows: (string | number)[][];
  };
}

export function SalesTable({ dataTable }: SalesTableProps) {
  if (!dataTable || !dataTable.columns || !dataTable.rows) {
    return <p className="text-muted-foreground text-center py-8">No data available for the table.</p>;
  }
  const { columns, rows } = dataTable;

  const handleExportCSV = () => {
    const header = columns.join(',');
    const csvRows = rows.map(row => 
      row.map(cell => {
        const strCell = String(cell);
        if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
          return `"${strCell.replace(/"/g, '""')}"`;
        }
        return strCell;
      }).join(',')
    );
    const csvContent = [header, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'analytica_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j} className="font-medium">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
