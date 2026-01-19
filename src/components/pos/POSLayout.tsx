import { useState, useCallback } from 'react';
import { Product, ProductCategory, ReceiptItem } from '@/types/pos';
import { useProducts } from '@/hooks/useProducts';
import { useReceipts } from '@/hooks/useReceipts';
import { ProductGrid } from './ProductGrid';
import { Receipt } from './Receipt';
import { SalesOverview } from './SalesOverview';
import { ProductEditorDialog } from './ProductEditorDialog';
import { toast } from 'sonner';
import { Store, Settings, X, RotateCcw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function POSLayout() {
  const { products, saveProduct, deleteProduct, resetToDefaults } = useProducts();
  const { addReceipt, getDailySales, clearAllReceipts } = useReceipts();
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showSalesOverview, setShowSalesOverview] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = useCallback((product: Product) => {
    setReceiptItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setReceiptItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is ReceiptItem => item !== null);
    });
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setReceiptItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleClear = useCallback(() => {
    setReceiptItems([]);
    toast.info('Beleg gelöscht');
  }, []);

  const handleComplete = useCallback(() => {
    if (receiptItems.length === 0) return;
    const receipt = addReceipt(receiptItems);
    toast.success(`Beleg abgeschlossen: ${receipt.total.toFixed(2)} €`);
    setReceiptItems([]);
  }, [receiptItems, addReceipt]);

  const handleClearAllReceipts = useCallback(() => {
    clearAllReceipts();
    toast.success('Alle Belege gelöscht');
  }, [clearAllReceipts]);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setEditorOpen(true);
  }, []);

  const handleAddNewProduct = useCallback(() => {
    setEditingProduct(null);
    setEditorOpen(true);
  }, []);

  const handleSaveProduct = useCallback((product: Product) => {
    saveProduct(product);
    toast.success(editingProduct ? 'Produkt aktualisiert' : 'Produkt hinzugefügt');
  }, [saveProduct, editingProduct]);

  const handleDeleteProduct = useCallback((productId: string) => {
    deleteProduct(productId);
    toast.success('Produkt gelöscht');
  }, [deleteProduct]);

  const handleResetProducts = useCallback(() => {
    resetToDefaults();
    toast.success('Produkte zurückgesetzt');
  }, [resetToDefaults]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Store className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-tight">Vereinskasse</h1>
          <p className="text-xs text-muted-foreground">Veranstaltungs-Kassensystem</p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {isAdminMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetProducts}
              className="text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Zurücksetzen
            </Button>
          )}
          <Button
            variant={showSalesOverview ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowSalesOverview(!showSalesOverview)}
            className={showSalesOverview ? 'ring-2 ring-primary ring-offset-2' : ''}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Statistik
          </Button>
          <Button
            variant={isAdminMode ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={isAdminMode ? 'ring-2 ring-secondary ring-offset-2' : ''}
          >
            {isAdminMode ? (
              <>
                <X className="w-4 h-4 mr-1" />
                Admin beenden
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="bg-secondary/20 border-b border-secondary/30 px-4 py-2 text-center">
          <span className="text-sm font-medium text-secondary-foreground">
            ✏️ Admin-Modus aktiv – Klicke auf Produkte zum Bearbeiten
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0 overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 min-h-0 lg:h-full overflow-hidden flex flex-col">
          <ProductGrid
            products={products}
            onAddProduct={handleAddProduct}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            isAdminMode={isAdminMode}
            onEditProduct={handleEditProduct}
            onAddNewProduct={handleAddNewProduct}
          />
        </div>

        {/* Receipt / Sales Section */}
        <div className="lg:w-[400px] xl:w-[450px] shrink-0 h-[350px] lg:h-full">
          {showSalesOverview ? (
            <SalesOverview
              dailySales={getDailySales()}
              onClearAll={handleClearAllReceipts}
            />
          ) : (
            <Receipt
              items={receiptItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClear={handleClear}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>

      {/* Product Editor Dialog */}
      <ProductEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
