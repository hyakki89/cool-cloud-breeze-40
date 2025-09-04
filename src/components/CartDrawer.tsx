import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart, CartItem } from '@/hooks/useCart';

interface CartDrawerProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CartDrawer = ({ trigger, isOpen, onOpenChange }: CartDrawerProps) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleCheckout = () => {
    // Here you would integrate with your checkout process
    console.log('Redirecting to checkout with cart:', cart);
  };

  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <div className="flex gap-4 p-4 card-cloud rounded-2xl">
      {/* Product Image */}
      {item.image && (
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex-1 space-y-2">
        <h4 className="font-semibold text-sm leading-tight">
          {item.title}
        </h4>
        
        {/* Options */}
        {Object.entries(item.options).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {Object.entries(item.options).map(([key, value]) => (
              <Badge key={key} variant="outline" className="text-xs">
                {key}: {value}
              </Badge>
            ))}
          </div>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="w-8 h-8 p-0"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="w-8 h-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">
              {formatPrice(item.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFromCart(item.variantId)}
              className="w-8 h-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cart.totalQuantity > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs product-badge-sale"
              >
                {cart.totalQuantity}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="gradient-text">Panier ({cart.totalQuantity})</span>
            {cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                Vider
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits pour commencer vos achats
            </p>
            <Button className="btn-cloud">
              Continuer les achats
            </Button>
          </div>
        ) : (
          /* Cart Items */
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItemComponent key={item.variantId} item={item} />
                ))}
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className="p-6 border-t bg-muted/30">
              <div className="space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total ({cart.totalQuantity} articles)</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(cart.totalPrice)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-cloud text-white font-semibold py-6 text-lg"
                  size="lg"
                >
                  Procéder au paiement
                </Button>

                {/* Continue Shopping */}
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange?.(false)}
                >
                  Continuer les achats
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;