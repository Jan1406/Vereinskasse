import { Product, ProductCategory } from '@/types/pos';
import { ProductButton } from './ProductButton';
import { Plus } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  activeCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
  isAdminMode?: boolean;
  onEditProduct?: (product: Product) => void;
  onAddNewProduct?: () => void;
}

const categories: { key: ProductCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Alle', icon: '📋' },
  { key: 'drinks', label: 'Getränke', icon: '🍺' },
  { key: 'food', label: 'Speisen', icon: '🍽️' },
  { key: 'other', label: 'Sonstiges', icon: '🎫' },
];

export function ProductGrid({ 
  products, 
  onAddProduct, 
  activeCategory, 
  onCategoryChange,
  isAdminMode = false,
  onEditProduct,
  onAddNewProduct,
}: ProductGridProps) {
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card hover:bg-muted text-foreground'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto flex-1">
        {filteredProducts.map(product => (
          <ProductButton 
            key={product.id} 
            product={product} 
            onAdd={onAddProduct}
            isAdminMode={isAdminMode}
            onEdit={onEditProduct}
          />
        ))}
        
        {/* Add New Product Button (Admin Mode) */}
        {isAdminMode && onAddNewProduct && (
          <button
            onClick={onAddNewProduct}
            className="product-card border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
          >
            <Plus className="w-8 h-8 text-primary/60" />
            <span className="font-medium text-sm text-primary/80">Neues Produkt</span>
          </button>
        )}
      </div>
    </div>
  );
}
