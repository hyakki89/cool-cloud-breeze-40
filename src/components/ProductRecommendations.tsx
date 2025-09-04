import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  badge?: string;
}

interface ProductRecommendationsProps {
  products: RecommendedProduct[];
  title?: string;
  className?: string;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

const ProductRecommendations = ({
  products,
  title = "Vous aimerez aussi",
  className = "",
  onProductClick,
  onAddToCart
}: ProductRecommendationsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          'w-3 h-3',
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ));
  };

  if (products.length === 0) return null;

  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-2xl font-bold gradient-text text-center">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="card-cloud hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => onProductClick?.(product.id)}
          >
            <CardContent className="p-4 space-y-4">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Badges */}
                {product.badge && (
                  <Badge className="absolute top-2 left-2 product-badge-sale">
                    {product.badge}
                  </Badge>
                )}

                {/* Quick Add Button */}
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 btn-cloud"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(product.id);
                  }}
                  disabled={!product.available}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                    <span className="font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <div className="text-green-600 text-xs font-medium">
                      Économisez {formatPrice(product.compareAtPrice - product.price)}
                    </div>
                  )}
                </div>

                {/* Availability */}
                {!product.available && (
                  <Badge variant="secondary" className="text-xs">
                    Rupture de stock
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;