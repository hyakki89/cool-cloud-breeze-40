import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  variantId: string;
  productId: string;
  quantity: number;
  title: string;
  price: number;
  image?: string;
  options: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalQuantity: 0,
    totalPrice: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalQuantity, totalPrice };
  }, []);

  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(
          cartItem => cartItem.variantId === item.variantId
        );

        let newItems: CartItem[];
        
        if (existingItemIndex >= 0) {
          // Update existing item
          newItems = [...prevCart.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + (item.quantity || 1)
          };
        } else {
          // Add new item
          newItems = [...prevCart.items, { ...item, quantity: item.quantity || 1 }];
        }

        const totals = calculateTotals(newItems);
        
        return {
          items: newItems,
          ...totals
        };
      });

      toast.success(`${item.title} ajouté au panier`, {
        description: `Quantité: ${item.quantity || 1}`
      });
      
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setIsLoading(false);
    }
  }, [calculateTotals]);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      );
      
      const totals = calculateTotals(newItems);
      
      return {
        items: newItems,
        ...totals
      };
    });
  }, [calculateTotals]);

  const removeFromCart = useCallback((variantId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.variantId !== variantId);
      const totals = calculateTotals(newItems);
      
      return {
        items: newItems,
        ...totals
      };
    });
    
    toast.info('Produit retiré du panier');
  }, [calculateTotals]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      totalQuantity: 0,
      totalPrice: 0
    });
  }, []);

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};