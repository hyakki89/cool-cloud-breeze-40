import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useProductGallery, ProductImage } from '@/hooks/useProductGallery';

interface ProductGalleryProps {
  images: ProductImage[];
  productTitle: string;
  badges?: { text: string; variant?: 'default' | 'destructive' | 'outline' | 'secondary' }[];
  className?: string;
}

const ProductGallery = ({ images, productTitle, badges = [], className = "" }: ProductGalleryProps) => {
  const {
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
    hasMultipleImages
  } = useProductGallery({ images });

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentImage) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative card-cloud rounded-3xl p-6 overflow-hidden group">
        <div
          className={`relative overflow-hidden rounded-2xl ${
            isZoomed ? 'cursor-zoom-out' : 'product-image-zoom'
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetZoom}
          onClick={toggleZoom}
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt || productTitle}
            className={`w-full h-96 object-cover transition-all duration-300 ${
              isZoomed 
                ? 'scale-200 cursor-zoom-out' 
                : 'scale-100 hover:scale-105 cursor-zoom-in'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
          />
          
          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-4 left-4 space-y-2">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant={badge.variant || 'default'}
                  className="shadow-lg backdrop-blur-sm"
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {/* Zoom Icon */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="card-cloud"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </Button>
          </div>

          {/* Fullscreen Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="card-cloud"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
                <div className="relative w-full h-full flex items-center justify-center bg-black/95">
                  <img
                    src={currentImage.url}
                    alt={currentImage.alt || productTitle}
                    className="max-w-full max-h-full object-contain"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 card-cloud"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 card-cloud"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`product-gallery-thumbnail aspect-square ${
                currentImageIndex === index ? 'product-gallery-thumbnail-active' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${productTitle} vue ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="text-center text-sm text-muted-foreground">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;