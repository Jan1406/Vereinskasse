import { Product } from '@/types/pos';

export const products: Product[] = [
  // Getränke – vom Fass (0,4 l)
  { id: 'pils-fass', name: 'Pils vom Fass', price: 3.50, category: 'drinks', icon: '🍺' },
  { id: 'radler-fass', name: 'Radler vom Fass', price: 3.50, category: 'drinks', icon: '🍺' },

  // Getränke – aus der Flasche (0,33 l)
  { id: 'pils-flasche', name: 'Pils Flasche', price: 3.00, category: 'drinks', icon: '🍾' },
  { id: 'helles-flasche', name: 'Helles Flasche', price: 3.00, category: 'drinks', icon: '🍾' },
  { id: 'radler-flasche', name: 'Radler Flasche', price: 3.00, category: 'drinks', icon: '🍾' },
  { id: 'alkoholfrei-flasche', name: 'Alkoholfreies Bier', price: 3.00, category: 'drinks', icon: '🍾' },
  { id: 'fassbrause-flasche', name: 'Fassbrause', price: 3.00, category: 'drinks', icon: '🍾' },
  { id: 'kickers-sixer', name: 'Kickers Sixer', price: 15.00, category: 'drinks', icon: '📦' },

  // Getränke – Sonstige
  { id: 'weinschorle', name: 'Weinschorle (0,4)', price: 4.00, category: 'drinks', icon: '🥂' },
  { id: 'capri-sun', name: 'Capri Sun', price: 1.00, category: 'drinks', icon: '🧃' },

  // Speisen
  { id: 'fleischkaese', name: 'Fleischkäse im Brötchen', price: 4.00, category: 'food', icon: '🥪' },
  { id: 'weisswuerste', name: 'Weißwürste mit Brezel', price: 5.00, category: 'food', icon: '🌭' },
  { id: 'pommes', name: 'Pommes', price: 3.00, category: 'food', icon: '🍟' },

  // Sonstiges
  { id: 'pfand-becher', name: 'Pfand Becher', price: 2.00, category: 'other', icon: '🥤' },
  { id: 'pfand-flasche', name: 'Pfand Flasche', price: 1.00, category: 'other', icon: '🍾' },
];
