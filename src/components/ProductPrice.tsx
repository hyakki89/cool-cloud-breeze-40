import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductPriceProps {
  price: number;
  compareAtPrice?: number;
  currency?: string;
  showSavings?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProductPrice = ({
  price,
  compareAtPrice,
  currency = '€',
  showSavings = true,
  size = 'md',
  className = ""
}: ProductPriceProps) => {
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const savings = isOnSale ? compareAtPrice - price : 0;
  const savingsPercentage = isOnSale ? Math.round((savings / compareAtPrice) * 100) : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const compareSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Compare at price (strikethrough) */}
        {isOnSale && (
          <span className={cn(
            'product-price-compare',
            compareSizeClasses[size]
          )}>
            {formatPrice(compareAtPrice)}
          </span>
        )}
        
        {/* Current price */}
        <span className={cn(
          'product-price-current font-bold gradient-text',
          sizeClasses[size]
        )}>
          {formatPrice(price)}
        </span>

        {/* Sale badge */}
        {isOnSale && (
          <Badge className="product-badge-sale">
            -{savingsPercentage}%
          </Badge>
        )}
      </div>

      {/* Savings display */}
      {isOnSale && showSavings && (
        <div className="text-green-600 font-semibold">
          Économisez {formatPrice(savings)} ({savingsPercentage}%)
        </div>
      )}

      {/* Price includes tax notice */}
      <p className="text-xs text-muted-foreground">
        Prix TTC, frais de livraison en sus
      </p>
    </div>
  );
};

export default ProductPrice;