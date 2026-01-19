import { Product } from '@/types/pos';

export const products: Product[] = [
  // Getränke
  { id: 'bier', name: 'Bier', price: 3.50, category: 'drinks', icon: '🍺' },
  { id: 'radler', name: 'Radler', price: 3.50, category: 'drinks', icon: '🍋' },
  { id: 'wein-weiss', name: 'Weißwein', price: 4.00, category: 'drinks', icon: '🍷' },
  { id: 'wein-rot', name: 'Rotwein', price: 4.00, category: 'drinks', icon: '🍷' },
  { id: 'cola', name: 'Cola', price: 2.50, category: 'drinks', icon: '🥤' },
  { id: 'fanta', name: 'Fanta', price: 2.50, category: 'drinks', icon: '🧃' },
  { id: 'spezi', name: 'Spezi', price: 2.50, category: 'drinks', icon: '🥤' },
  { id: 'wasser', name: 'Wasser', price: 2.00, category: 'drinks', icon: '💧' },
  { id: 'apfelschorle', name: 'Apfelschorle', price: 2.50, category: 'drinks', icon: '🍎' },
  { id: 'kaffee', name: 'Kaffee', price: 2.00, category: 'drinks', icon: '☕' },
  
  // Speisen
  { id: 'bratwurst', name: 'Bratwurst', price: 4.00, category: 'food', icon: '🌭' },
  { id: 'steak', name: 'Steak', price: 6.00, category: 'food', icon: '🥩' },
  { id: 'pommes', name: 'Pommes', price: 3.00, category: 'food', icon: '🍟' },
  { id: 'breze', name: 'Breze', price: 1.50, category: 'food', icon: '🥨' },
  { id: 'kuchen', name: 'Kuchen', price: 2.50, category: 'food', icon: '🍰' },
  
  // Sonstiges
  { id: 'eintritt', name: 'Eintritt', price: 5.00, category: 'other', icon: '🎫' },
  { id: 'tombola', name: 'Tombola-Los', price: 2.00, category: 'other', icon: '🎟️' },
];
