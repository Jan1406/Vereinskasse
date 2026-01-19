import { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types/pos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ProductEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: 'drinks', label: 'Getränke' },
  { value: 'food', label: 'Speisen' },
  { value: 'other', label: 'Sonstiges' },
];

const emojiOptions = ['🍺', '🍷', '🥤', '☕', '💧', '🍎', '🍋', '🧃', '🌭', '🥩', '🍟', '🥨', '🍰', '🎫', '🎟️', '🍕', '🍔', '🧁', '🍦', '🥗', '🍪', '🥐', '🧀', '🍝'];

export function ProductEditorDialog({ open, onOpenChange, product, onSave, onDelete }: ProductEditorDialogProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('drinks');
  const [icon, setIcon] = useState('🍺');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!product;

  useEffect(() => {
    if (open) {
      if (product) {
        setName(product.name);
        setPrice(product.price.toFixed(2));
        setCategory(product.category);
        setIcon(product.icon || '🍺');
      } else {
        setName('');
        setPrice('');
        setCategory('drinks');
        setIcon('🍺');
      }
      setShowDeleteConfirm(false);
    }
  }, [product, open]);

  const handleSave = () => {
    const priceNum = parseFloat(price.replace(',', '.'));
    if (!name.trim() || isNaN(priceNum) || priceNum <= 0) return;

    const newProduct: Product = {
      id: product?.id || `product-${Date.now()}`,
      name: name.trim(),
      price: Math.round(priceNum * 100) / 100,
      category,
      icon,
    };

    onSave(newProduct);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (product && onDelete) {
      onDelete(product.id);
      onOpenChange(false);
    }
  };

  const isValid = name.trim() && price && !isNaN(parseFloat(price.replace(',', '.'))) && parseFloat(price.replace(',', '.')) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {isEditing ? 'Produkt bearbeiten' : 'Neues Produkt'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Bier"
              autoFocus
            />
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price">Preis (€)</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="z.B. 3.50"
              type="text"
              inputMode="decimal"
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label>Kategorie</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon */}
          <div className="grid gap-2">
            <Label>Symbol</Label>
            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-1">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                    icon === emoji
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEditing && onDelete && (
            <div className="flex-1">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Wirklich löschen?</span>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    Ja
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                    Nein
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Löschen
                </Button>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              Speichern
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
