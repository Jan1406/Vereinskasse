import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/pos';
import { products as defaultProducts } from '@/data/products';

const STORAGE_KEY = 'vereinskasse-products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return defaultProducts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to storage', e);
    }
  }, [products]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [...prev, product];
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(defaultProducts);
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    saveProduct,
    resetToDefaults,
  };
}
