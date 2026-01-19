import { forwardRef } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ReceiptItem, CompletedReceipt } from '@/types/pos';

interface PrintableReceiptProps {
  items: ReceiptItem[];
  total: number;
  receiptNumber?: number;
  completedAt?: Date;
}

export const PrintableReceipt = forwardRef<HTMLDivElement, PrintableReceiptProps>(
  ({ items, total, receiptNumber, completedAt = new Date() }, ref) => {
    return (
      <div ref={ref} className="print-receipt">
        <style>
          {`
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body * {
                visibility: hidden;
              }
              .print-receipt, .print-receipt * {
                visibility: visible;
              }
              .print-receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
                padding: 5mm;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
                color: black;
                background: white;
              }
            }
            .print-receipt {
              width: 80mm;
              padding: 5mm;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              color: black;
              background: white;
            }
            .print-receipt .header {
              text-align: center;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px dashed black;
            }
            .print-receipt .header h1 {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .print-receipt .header p {
              margin: 2px 0;
              font-size: 11px;
            }
            .print-receipt .items {
              margin-bottom: 10px;
            }
            .print-receipt .item {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .print-receipt .item-name {
              flex: 1;
            }
            .print-receipt .item-qty {
              width: 30px;
              text-align: right;
            }
            .print-receipt .item-price {
              width: 50px;
              text-align: right;
            }
            .print-receipt .divider {
              border-top: 1px dashed black;
              margin: 10px 0;
            }
            .print-receipt .total {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              font-weight: bold;
              margin: 10px 0;
            }
            .print-receipt .footer {
              text-align: center;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px dashed black;
              font-size: 11px;
            }
          `}
        </style>
        
        <div className="header">
          <h1>VEREINSKASSE</h1>
          <p>{format(completedAt, 'EEEE, d. MMMM yyyy', { locale: de })}</p>
          <p>{format(completedAt, 'HH:mm')} Uhr</p>
          {receiptNumber && <p>Beleg #{receiptNumber}</p>}
        </div>

        <div className="items">
          <div className="item" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            <span className="item-name">Artikel</span>
            <span className="item-qty">Anz</span>
            <span className="item-price">Preis</span>
          </div>
          <div className="divider" />
          {items.map(item => (
            <div key={item.product.id} className="item">
              <span className="item-name">{item.product.name}</span>
              <span className="item-qty">{item.quantity}×</span>
              <span className="item-price">{(item.product.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
        </div>

        <div className="divider" />
        
        <div className="total">
          <span>GESAMT</span>
          <span>{total.toFixed(2)} €</span>
        </div>

        <div className="footer">
          <p>Vielen Dank für Ihren Einkauf!</p>
          <p>* * *</p>
        </div>
      </div>
    );
  }
);

PrintableReceipt.displayName = 'PrintableReceipt';

export function printReceipt(items: ReceiptItem[], total: number, receiptNumber?: number) {
  const printWindow = window.open('', '_blank', 'width=350,height=600');
  if (!printWindow) return;

  const now = new Date();
  const formattedDate = format(now, 'EEEE, d. MMMM yyyy', { locale: de });
  const formattedTime = format(now, 'HH:mm');

  const itemsHtml = items.map(item => `
    <div class="item">
      <span class="item-name">${item.product.name}</span>
      <span class="item-qty">${item.quantity}×</span>
      <span class="item-price">${(item.product.price * item.quantity).toFixed(2)}€</span>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Beleg</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Courier New', monospace;
        }
        .print-receipt {
          width: 80mm;
          padding: 5mm;
          font-size: 12px;
          line-height: 1.4;
          color: black;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px dashed black;
        }
        .header h1 {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 5px 0;
        }
        .header p {
          margin: 2px 0;
          font-size: 11px;
        }
        .items {
          margin-bottom: 10px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
        }
        .item-name {
          flex: 1;
        }
        .item-qty {
          width: 30px;
          text-align: right;
        }
        .item-price {
          width: 50px;
          text-align: right;
        }
        .divider {
          border-top: 1px dashed black;
          margin: 10px 0;
        }
        .total {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: bold;
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px dashed black;
          font-size: 11px;
        }
      </style>
    </head>
    <body>
      <div class="print-receipt">
        <div class="header">
          <h1>VEREINSKASSE</h1>
          <p>${formattedDate}</p>
          <p>${formattedTime} Uhr</p>
          ${receiptNumber ? `<p>Beleg #${receiptNumber}</p>` : ''}
        </div>

        <div class="items">
          <div class="item" style="font-weight: bold; margin-bottom: 5px;">
            <span class="item-name">Artikel</span>
            <span class="item-qty">Anz</span>
            <span class="item-price">Preis</span>
          </div>
          <div class="divider"></div>
          ${itemsHtml}
        </div>

        <div class="divider"></div>
        
        <div class="total">
          <span>GESAMT</span>
          <span>${total.toFixed(2)} €</span>
        </div>

        <div class="footer">
          <p>Vielen Dank für Ihren Einkauf!</p>
          <p>* * *</p>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export function printCompletedReceipt(receipt: CompletedReceipt, receiptNumber?: number) {
  printReceipt(receipt.items, receipt.total, receiptNumber);
}
