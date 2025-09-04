import { useState, useCallback, useMemo } from 'react';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  inventory: number;
  options: Record<string, string>;
  image?: string;
  sku?: string;
  weight?: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

interface UseProductVariantsProps {
  variants: ProductVariant[];
  options: ProductOption[];
  defaultVariantId?: string;
}

export const useProductVariants = ({
  variants,
  options,
  defaultVariantId
}: UseProductVariantsProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (defaultVariantId) {
      const defaultVariant = variants.find(v => v.id === defaultVariantId);
      return defaultVariant?.options || {};
    }
    // Initialize with first available option for each
    return options.reduce((acc, option) => {
      acc[option.name] = option.values[0];
      return acc;
    }, {} as Record<string, string>);
  });

  const currentVariant = useMemo(() => {
    return variants.find(variant => {
      return Object.entries(selectedOptions).every(([optionName, value]) => {
        return variant.options[optionName] === value;
      });
    });
  }, [variants, selectedOptions]);

  const availableOptions = useMemo(() => {
    return options.map(option => ({
      ...option,
      values: option.values.filter(value => {
        // Check if there's any variant with this option value that's available
        return variants.some(variant => {
          const hasThisOption = variant.options[option.name] === value;
          const hasOtherSelectedOptions = Object.entries(selectedOptions)
            .filter(([name]) => name !== option.name)
            .every(([name, selectedValue]) => variant.options[name] === selectedValue);
          
          return hasThisOption && hasOtherSelectedOptions && variant.available;
        });
      })
    }));
  }, [options, variants, selectedOptions]);

  const updateOption = useCallback((optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  }, []);

  const isOptionValueAvailable = useCallback((optionName: string, value: string) => {
    return variants.some(variant => {
      const hasThisOption = variant.options[optionName] === value;
      const hasOtherSelectedOptions = Object.entries(selectedOptions)
        .filter(([name]) => name !== optionName)
        .every(([name, selectedValue]) => variant.options[name] === selectedValue);
      
      return hasThisOption && hasOtherSelectedOptions && variant.available;
    });
  }, [variants, selectedOptions]);

  return {
    selectedOptions,
    currentVariant,
    availableOptions,
    updateOption,
    isOptionValueAvailable,
    hasVariants: variants.length > 1
  };
};