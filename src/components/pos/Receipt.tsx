import { ReceiptItem } from '@/types/pos';
import { ReceiptItemRow } from './ReceiptItemRow';
import { printReceipt } from './PrintableReceipt';
import { ReceiptText, Trash2, CheckCircle, Printer } from 'lucide-react';

interface ReceiptProps {
  items: ReceiptItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClear: () => void;
  onComplete: () => void;
}

export function Receipt({ items, onUpdateQuantity, onRemoveItem, onClear, onComplete }: ReceiptProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="receipt-container flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Beleg</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {itemCount} Artikel
        </span>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
            <ReceiptText className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Noch keine Artikel</p>
            <p className="text-xs mt-1">Wähle Produkte aus der Liste</p>
          </div>
        ) : (
          items.map(item => (
            <ReceiptItemRow
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        {/* Total */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Gesamt</span>
          <span className="text-2xl font-bold text-primary">
            {total.toFixed(2)} €
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClear}
            disabled={items.length === 0}
            className="pos-button pos-button-destructive flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            Löschen
          </button>
          <button
            onClick={() => printReceipt(items, total)}
            disabled={items.length === 0}
            className="pos-button flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted/80 text-foreground"
          >
            <Printer className="w-5 h-5" />
            Drucken
          </button>
          <button
            onClick={onComplete}
            disabled={items.length === 0}
            className="pos-button pos-button-success flex-[2] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            Abschließen
          </button>
        </div>
      </div>
    </div>
  );
}
