import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductStockIndicatorProps {
  inventory: number;
  available: boolean;
  lowStockThreshold?: number;
  showExactCount?: boolean;
  className?: string;
}

const ProductStockIndicator = ({
  inventory,
  available,
  lowStockThreshold = 5,
  showExactCount = false,
  className = ""
}: ProductStockIndicatorProps) => {
  const getStockStatus = () => {
    if (!available || inventory <= 0) {
      return {
        status: 'out-of-stock',
        message: 'Rupture de stock',
        icon: XCircle,
        className: 'product-stock-out',
        badgeVariant: 'destructive' as const
      };
    }

    if (inventory <= lowStockThreshold) {
      return {
        status: 'low-stock',
        message: showExactCount 
          ? `Plus que ${inventory} en stock` 
          : 'Stock limité',
        icon: AlertTriangle,
        className: 'product-stock-low',
        badgeVariant: 'outline' as const
      };
    }

    return {
      status: 'in-stock',
      message: showExactCount && inventory < 50
        ? `${inventory} en stock`
        : 'En stock',
      icon: CheckCircle,
      className: 'text-green-600',
      badgeVariant: 'secondary' as const
    };
  };

  const stockInfo = getStockStatus();
  const Icon = stockInfo.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={stockInfo.badgeVariant} className="gap-1">
        <Icon className="w-3 h-3" />
        <span className={cn('product-stock-indicator', stockInfo.className)}>
          {stockInfo.message}
        </span>
      </Badge>
      
      {stockInfo.status === 'low-stock' && (
        <span className="text-xs text-muted-foreground">
          Commandez vite !
        </span>
      )}
      
      {stockInfo.status === 'out-of-stock' && (
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          Bientôt disponible
        </Badge>
      )}
    </div>
  );
};

export default ProductStockIndicator;