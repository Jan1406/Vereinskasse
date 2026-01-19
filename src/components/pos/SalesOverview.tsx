import { useState } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { DailySales, CompletedReceipt } from '@/types/pos';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Receipt, 
  ShoppingBag, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  Trash2,
  Download,
  Printer
} from 'lucide-react';
import { printCompletedReceipt } from './PrintableReceipt';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SalesOverviewProps {
  dailySales: DailySales[];
  onClearAll: () => void;
}

export function SalesOverview({ dailySales, onClearAll }: SalesOverviewProps) {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [showClearDialog, setShowClearDialog] = useState(false);

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const exportToCSV = () => {
    const headers = ['Datum', 'Uhrzeit', 'Beleg-Nr.', 'Artikel', 'Menge', 'Einzelpreis', 'Summe'];
    const rows: string[][] = [];

    dailySales.forEach(day => {
      day.receipts.forEach((receipt, receiptIdx) => {
        receipt.items.forEach(item => {
          rows.push([
            format(parseISO(day.date), 'dd.MM.yyyy'),
            format(receipt.completedAt, 'HH:mm'),
            `${receiptIdx + 1}`,
            item.product.name,
            item.quantity.toString(),
            item.product.price.toFixed(2).replace('.', ','),
            (item.product.price * item.quantity).toFixed(2).replace('.', ',')
          ]);
        });
      });
    });

    // Add summary row
    rows.push([]);
    rows.push(['Gesamt', '', '', '', totalItems.toString(), '', totalRevenue.toFixed(2).replace('.', ',')]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verkaufsstatistik_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = dailySales.reduce((sum, day) => sum + day.total, 0);
  const totalReceipts = dailySales.reduce((sum, day) => sum + day.receipts.length, 0);
  const totalItems = dailySales.reduce((sum, day) => sum + day.itemCount, 0);

  const todaySales = dailySales.find(d => isToday(parseISO(d.date)));

  return (
    <div className="h-full flex flex-col bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Verkaufsübersicht</h2>
          </div>
          {dailySales.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportToCSV}
                className="text-primary hover:text-primary hover:bg-primary/10"
                title="Als CSV exportieren"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Alle Belege löschen"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Today's Stats */}
      {todaySales && (
        <div className="p-4 border-b border-border bg-primary/5">
          <div className="text-xs font-medium text-muted-foreground mb-2">Heute</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {todaySales.total.toFixed(2)} €
              </div>
              <div className="text-xs text-muted-foreground">Umsatz</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todaySales.receipts.length}</div>
              <div className="text-xs text-muted-foreground">Belege</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todaySales.itemCount}</div>
              <div className="text-xs text-muted-foreground">Artikel</div>
            </div>
          </div>
        </div>
      )}

      {/* Total Stats */}
      {dailySales.length > 1 && (
        <div className="px-4 py-3 border-b border-border bg-muted/20">
          <div className="text-xs font-medium text-muted-foreground mb-1">Gesamt</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">{totalRevenue.toFixed(2)} €</span>
            <span className="text-muted-foreground">{totalReceipts} Belege</span>
            <span className="text-muted-foreground">{totalItems} Artikel</span>
          </div>
        </div>
      )}

      {/* Daily Breakdown */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {dailySales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Receipt className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Noch keine abgeschlossenen Belege</p>
            </div>
          ) : (
            <div className="space-y-1">
              {dailySales.map(day => (
                <DayCard
                  key={day.date}
                  day={day}
                  isExpanded={expandedDates.has(day.date)}
                  onToggle={() => toggleDate(day.date)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alle Belege löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle {totalReceipts} Belege 
              werden unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Alle löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface DayCardProps {
  day: DailySales;
  isExpanded: boolean;
  onToggle: () => void;
}

function DayCard({ day, isExpanded, onToggle }: DayCardProps) {
  const dateObj = parseISO(day.date);
  const isCurrentDay = isToday(dateObj);
  const formattedDate = isCurrentDay 
    ? 'Heute' 
    : format(dateObj, 'EEEE, d. MMMM', { locale: de });

  return (
    <div className={`rounded-lg border ${isCurrentDay ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-left text-sm font-medium">{formattedDate}</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-primary">{day.total.toFixed(2)} €</span>
          <span className="text-muted-foreground">{day.receipts.length} Belege</span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          {day.receipts.map((receipt, idx) => (
            <ReceiptCard key={receipt.id} receipt={receipt} index={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReceiptCardProps {
  receipt: CompletedReceipt;
  index: number;
}

function ReceiptCard({ receipt, index }: ReceiptCardProps) {
  const time = format(receipt.completedAt, 'HH:mm');
  
  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    printCompletedReceipt(receipt, index);
  };
  
  return (
    <div className="ml-7 p-2 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">
          #{index} · {time} Uhr
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-1 rounded hover:bg-muted transition-colors"
            title="Beleg drucken"
          >
            <Printer className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <span className="text-sm font-medium">{receipt.total.toFixed(2)} €</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {receipt.items.map(item => (
          <span key={item.product.id} className="inline-block mr-2">
            {item.quantity}× {item.product.name}
          </span>
        ))}
      </div>
    </div>
  );
}
