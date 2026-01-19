import { ReceiptItem } from '@/types/pos';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface ReceiptItemRowProps {
  item: ReceiptItem;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export function ReceiptItemRow({ item, onUpdateQuantity, onRemove }: ReceiptItemRowProps) {
  const total = item.product.price * item.quantity;

  return (
    <div className="receipt-item animate-pop-in">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-2xl">{item.product.icon}</span>
        <div className="flex flex-col min-w-0">
          <span className="font-medium truncate">{item.product.name}</span>
          <span className="text-sm text-muted-foreground">
            {item.product.price.toFixed(2)} € × {item.quantity}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-primary min-w-[70px] text-right">
          {total.toFixed(2)} €
        </span>
        
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onUpdateQuantity(item.product.id, -1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(item.product.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors ml-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
