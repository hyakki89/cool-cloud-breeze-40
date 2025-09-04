import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface VariantOption {
  name: string;
  value: string;
  available: boolean;
  color?: string;
  image?: string;
}

interface ProductVariantPickerProps {
  optionName: string;
  options: VariantOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  displayType?: 'swatch' | 'button' | 'dropdown';
  className?: string;
}

const ProductVariantPicker = ({
  optionName,
  options,
  selectedValue,
  onChange,
  displayType = 'button',
  className = ""
}: ProductVariantPickerProps) => {
  const renderSwatchOption = (option: VariantOption) => (
    <button
      key={option.value}
      onClick={() => option.available && onChange(option.value)}
      disabled={!option.available}
      className={cn(
        'product-variant-swatch relative',
        selectedValue === option.value && 'product-variant-selected',
        !option.available && 'opacity-50 cursor-not-allowed',
        option.color && 'border-2'
      )}
      style={{
        backgroundColor: option.color || '#f3f4f6'
      }}
      title={`${option.name} ${!option.available ? '(Non disponible)' : ''}`}
    >
      {selectedValue === option.value && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="w-4 h-4 text-white drop-shadow-lg" />
        </div>
      )}
      {option.image && (
        <img
          src={option.image}
          alt={option.name}
          className="w-full h-full object-cover rounded-full"
        />
      )}
      {!option.available && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-gray-400 rotate-45" />
        </div>
      )}
    </button>
  );

  const renderButtonOption = (option: VariantOption) => (
    <Button
      key={option.value}
      variant={selectedValue === option.value ? 'default' : 'outline'}
      size="sm"
      onClick={() => option.available && onChange(option.value)}
      disabled={!option.available}
      className={cn(
        'transition-all duration-200',
        selectedValue === option.value && 'ring-2 ring-primary/20',
        !option.available && 'opacity-50'
      )}
    >
      {option.name}
      {!option.available && (
        <Badge variant="secondary" className="ml-2 text-xs">
          Indisponible
        </Badge>
      )}
    </Button>
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">
          {optionName} :
        </label>
        <span className="text-sm text-muted-foreground">
          {options.find(opt => opt.value === selectedValue)?.name}
        </span>
      </div>

      <div className={cn(
        'flex gap-2',
        displayType === 'swatch' ? 'flex-wrap' : 'flex-wrap'
      )}>
        {options.map((option) => {
          if (displayType === 'swatch') {
            return renderSwatchOption(option);
          }
          return renderButtonOption(option);
        })}
      </div>

      {/* Availability hint */}
      {options.some(opt => !opt.available) && (
        <p className="text-xs text-muted-foreground">
          Certaines options ne sont pas disponibles pour la sélection actuelle
        </p>
      )}
    </div>
  );
};

export default ProductVariantPicker;