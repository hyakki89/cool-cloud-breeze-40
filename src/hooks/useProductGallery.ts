import { useState, useCallback } from 'react';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface UseProductGalleryProps {
  images: ProductImage[];
  defaultImageIndex?: number;
}

export const useProductGallery = ({ 
  images, 
  defaultImageIndex = 0 
}: UseProductGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(defaultImageIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentImageIndex];

  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
      setIsZoomed(false);
    }
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    goToImage(newIndex);
  }, [currentImageIndex, images.length, goToImage]);

  const goToNext = useCallback(() => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    goToImage(newIndex);
  }, [currentImageIndex, images.length, goToImage]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, [isZoomed]);

  const toggleZoom = useCallback((event?: React.MouseEvent) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    setZoomPosition({ x: 0, y: 0 });
  }, []);

  return {
    currentImageIndex,
    currentImage,
    isZoomed,
    zoomPosition,
    goToImage,
    goToPrevious,
    goToNext,
    handleMouseMove,
    toggleZoom,
    resetZoom,
    hasMultipleImages: images.length > 1
  };
};