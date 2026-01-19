import { useState, useEffect, useCallback } from 'react';
import { CompletedReceipt, ReceiptItem, DailySales } from '@/types/pos';
import { format, isToday, parseISO, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

const STORAGE_KEY = 'pos-receipts';

export function useReceipts() {
  const [receipts, setReceipts] = useState<CompletedReceipt[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReceipts(parsed.map((r: any) => ({
          ...r,
          completedAt: new Date(r.completedAt)
        })));
      } catch (e) {
        console.error('Failed to parse stored receipts:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }, [receipts]);

  const addReceipt = useCallback((items: ReceiptItem[]) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newReceipt: CompletedReceipt = {
      id: 
      (globalThis.crypto && "randomUUID" in globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
      ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      items,
      total,
      completedAt: new Date()
    };
    setReceipts(prev => [...prev, newReceipt]);
    return newReceipt;
  }, []);

  const getTodaysReceipts = useCallback(() => {
    return receipts.filter(r => isToday(r.completedAt));
  }, [receipts]);

  const getTodaysSales = useCallback((): DailySales => {
    const todayReceipts = getTodaysReceipts();
    const total = todayReceipts.reduce((sum, r) => sum + r.total, 0);
    const itemCount = todayReceipts.reduce((sum, r) => 
      sum + r.items.reduce((iSum, item) => iSum + item.quantity, 0), 0
    );
    return {
      date: format(new Date(), 'yyyy-MM-dd'),
      receipts: todayReceipts,
      total,
      itemCount
    };
  }, [getTodaysReceipts]);

  const getDailySales = useCallback((): DailySales[] => {
    const salesByDate = new Map<string, CompletedReceipt[]>();
    
    receipts.forEach(receipt => {
      const dateKey = format(receipt.completedAt, 'yyyy-MM-dd');
      const existing = salesByDate.get(dateKey) || [];
      salesByDate.set(dateKey, [...existing, receipt]);
    });

    return Array.from(salesByDate.entries())
      .map(([date, dayReceipts]) => ({
        date,
        receipts: dayReceipts,
        total: dayReceipts.reduce((sum, r) => sum + r.total, 0),
        itemCount: dayReceipts.reduce((sum, r) => 
          sum + r.items.reduce((iSum, item) => iSum + item.quantity, 0), 0
        )
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [receipts]);

  const clearAllReceipts = useCallback(() => {
    setReceipts([]);
  }, []);

  return {
    receipts,
    addReceipt,
    getTodaysReceipts,
    getTodaysSales,
    getDailySales,
    clearAllReceipts
  };
}
