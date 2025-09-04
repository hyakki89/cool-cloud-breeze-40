import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Zap, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import ProductPrice from './ProductPrice';
import ProductStockIndicator from './ProductStockIndicator';
import ProductVariantPicker from './ProductVariantPicker';
import { useCart } from '@/hooks/useCart';
import { useProductVariants, ProductVariant } from '@/hooks/useProductVariants';

interface ProductFormProps {
  product: {
    id: string;
    title: string;
    description: string;
    variants: ProductVariant[];
    options: Array<{
      name: string;
      values: string[];
    }>;
    images?: Array<{
      id: string;
      url: string;
      alt: string;
    }>;
  };
  className?: string;
}

const ProductForm = ({ product, className = "" }: ProductFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const {
    selectedOptions,
    currentVariant,
    availableOptions,
    updateOption,
    isOptionValueAvailable,
    hasVariants
  } = useProductVariants({
    variants: product.variants,
    options: product.options,
    defaultVariantId: product.variants[0]?.id
  });

  const { addToCart, isLoading } = useCart();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (currentVariant?.inventory || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!currentVariant || !currentVariant.available) {
      toast.error('Ce produit n\'est pas disponible');
      return;
    }

    await addToCart({
      variantId: currentVariant.id,
      productId: product.id,
      title: `${product.title} - ${Object.values(selectedOptions).join(', ')}`,
      price: currentVariant.price,
      image: currentVariant.image || product.images?.[0]?.url,
      options: selectedOptions,
      quantity
    });
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    // Here you would typically redirect to checkout
    toast.success('Redirection vers le paiement...');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Retiré de la wishlist' : 'Ajouté à la wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  const isOutOfStock = !currentVariant?.available || (currentVariant?.inventory || 0) <= 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Product Title & Description */}
      <div>
        <h1 className="text-3xl font-bold mb-4 gradient-text">
          {product.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price */}
      {currentVariant && (
        <Card className="card-cloud">
          <CardContent className="p-6">
            <ProductPrice
              price={currentVariant.price}
              compareAtPrice={currentVariant.compareAtPrice}
              size="lg"
              showSavings={true}
            />
            <ProductStockIndicator
              inventory={currentVariant.inventory}
              available={currentVariant.available}
              showExactCount={true}
              className="mt-4"
            />
          </CardContent>
        </Card>
      )}

      {/* Variant Options */}
      {hasVariants && (
        <div className="space-y-4">
          {availableOptions.map((option) => (
            <ProductVariantPicker
              key={option.name}
              optionName={option.name}
              options={option.values.map(value => ({
                name: value,
                value: value,
                available: isOptionValueAvailable(option.name, value),
                color: option.name.toLowerCase() === 'couleur' ? getColorValue(value) : undefined
              }))}
              selectedValue={selectedOptions[option.name] || ''}
              onChange={(value) => updateOption(option.name, value)}
              displayType={option.name.toLowerCase() === 'couleur' ? 'swatch' : 'button'}
            />
          ))}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Quantité :</label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= (currentVariant?.inventory || 10)}
            className="w-10 h-10 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className="w-full btn-cloud text-white font-semibold py-6 text-lg"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isLoading ? 'Ajout en cours...' : isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
        </Button>

        {/* Buy Now */}
        <Button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isLoading}
          variant="outline"
          className="w-full py-6 text-lg font-semibold border-2"
          size="lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Acheter maintenant
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlist}
          className={cn(
            'transition-colors',
            isWishlisted && 'text-red-500 hover:text-red-600'
          )}
        >
          <Heart className={cn('w-4 h-4 mr-2', isWishlisted && 'fill-current')} />
          Wishlist
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>

      {/* Product Features */}
      <Card className="card-cloud">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Livraison gratuite en France</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Retours gratuits sous 30 jours</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Garantie 2 ans</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get color values for swatches
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'blanc': '#FFFFFF',
    'white': '#FFFFFF',
    'noir': '#000000',
    'black': '#000000',
    'rose': '#FFB6C1',
    'pink': '#FFB6C1',
    'bleu': '#87CEEB',
    'blue': '#87CEEB',
    'rouge': '#FF6B6B',
    'red': '#FF6B6B',
    'vert': '#51CF66',
    'green': '#51CF66',
    'jaune': '#FFD43B',
    'yellow': '#FFD43B',
    'violet': '#E6E6FA',
    'purple': '#E6E6FA'
  };
  
  return colorMap[colorName.toLowerCase()] || '#F3F4F6';
};

export default ProductForm;