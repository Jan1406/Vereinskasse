import { Product, ProductCategory } from '@/types/pos';
import { Pencil } from 'lucide-react';

interface ProductButtonProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAdminMode?: boolean;
  onEdit?: (product: Product) => void;
}

const categoryClass: Record<ProductCategory, string> = {
  drinks: 'product-card-drinks',
  food: 'product-card-food',
  other: 'product-card-other',
};

export function ProductButton({ product, onAdd, isAdminMode = false, onEdit }: ProductButtonProps) {
  const handleClick = () => {
    if (isAdminMode && onEdit) {
      onEdit(product);
    } else {
      onAdd(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`product-card relative ${categoryClass[product.category]} ${isAdminMode ? 'ring-2 ring-secondary ring-offset-2' : ''}`}
    >
      {isAdminMode && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
          <Pencil className="w-3 h-3 text-secondary-foreground" />
        </div>
      )}
      <span className="text-3xl">{product.icon}</span>
      <span className="font-medium text-sm text-center leading-tight">{product.name}</span>
      <span className="text-primary font-bold">{product.price.toFixed(2)} €</span>
    </button>
  );
}
