import { Product } from '@/types/pos';

export const products: Product[] = [
  // Getränke
  { id: 'bier', name: 'Bier', price: 3.00, category: 'drinks', icon: '🍺' },
  { id: 'wein', name: 'Wein', price: 5.00, category: 'drinks', icon: '🍷' },
  { id: 'weinschorle', name: 'Weinschorle', price: 5.00, category: 'drinks', icon: '🥂' },
  { id: 'wasser', name: 'Wasser', price: 2.00, category: 'drinks', icon: '💧' },
  { id: 'softdrink', name: 'Softdrink', price: 2.00, category: 'drinks', icon: '🥤' },
  { id: 'apfelschorle', name: 'Apfelschorle', price: 2.00, category: 'drinks', icon: '🍎' },
  
  // Speisen
  { id: 'fleischkaese', name: 'Fleischkäse', price: 4.00, category: 'food', icon: '🥪' },
  { id: 'schupfnudeln', name: 'Schupfnudeln', price: 5.00, category: 'food', icon: '🍲' },
  { id: 'pommes', name: 'Pommes', price: 3.00, category: 'food', icon: '🍟' },
  { id: 'popcorn', name: 'Popcorn', price: 2.00, category: 'food', icon: '🍿' },
  
  // Sonstiges
  { id: 'pfand', name: 'Pfand', price: 2.00, category: 'other', icon: '🧾' },
];
