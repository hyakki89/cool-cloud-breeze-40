
import { useState } from "react";
import { Toaster } from 'sonner';
import ProductGallery from "../components/ProductGallery";
import ProductForm from "../components/ProductForm";
import ProductTabs from "../components/ProductTabs";
import ProductRecommendations from "../components/ProductRecommendations";
import CartDrawer from "../components/CartDrawer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const Product = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mock product data with Dawn-like structure
  const productData = {
    id: "zen-ring-001",
    title: "Zen Ring - Bague Connectée Bluetooth",
    description: "La bague connectée qui révolutionne ton quotidien ! Contrôle tes réseaux sociaux, ta musique et tes photos d'un simple geste. Design minimaliste et discret pour une technologie innovante à portée de main.",
    variants: [
      {
        id: "zen-ring-white",
        title: "Zen Ring Blanc",
        price: 19.00,
        compareAtPrice: 29.00,
        available: true,
        inventory: 15,
        options: { "Couleur": "Blanc", "Taille": "Unique" },
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
        sku: "ZR-WH-001"
      },
      {
        id: "zen-ring-black",
        title: "Zen Ring Noir",
        price: 19.00,
        compareAtPrice: 29.00,
        available: true,
        inventory: 8,
        options: { "Couleur": "Noir", "Taille": "Unique" },
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80",
        sku: "ZR-BL-001"
      },
      {
        id: "zen-ring-rose",
        title: "Zen Ring Rose",
        price: 19.00,
        compareAtPrice: 29.00,
        available: true,
        inventory: 3,
        options: { "Couleur": "Rose", "Taille": "Unique" },
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80",
        sku: "ZR-RO-001"
      },
      {
        id: "zen-ring-blue",
        title: "Zen Ring Bleu",
        price: 19.00,
        compareAtPrice: 29.00,
        available: false,
        inventory: 0,
        options: { "Couleur": "Bleu", "Taille": "Unique" },
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=400&q=80",
        sku: "ZR-BL-001"
      }
    ],
    options: [
      {
        name: "Couleur",
        values: ["Blanc", "Noir", "Rose", "Bleu"]
      },
      {
        name: "Taille",
        values: ["Unique"]
      }
    ],
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
        alt: "Zen Ring - Vue principale"
      },
      {
        id: "img-2", 
        url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
        alt: "Zen Ring - Vue détaillée"
      },
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80", 
        alt: "Zen Ring - Vue lifestyle"
      },
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
        alt: "Zen Ring - Vue packaging"
      }
    ]
  };

  // Mock recommended products
  const recommendedProducts = [
    {
      id: "rec-1",
      title: "Montre Connectée Smart",
      price: 89.00,
      compareAtPrice: 129.00,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      reviewCount: 89,
      available: true,
      badge: "-31%"
    },
    {
      id: "rec-2", 
      title: "Écouteurs Bluetooth Pro",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviewCount: 156,
      available: true
    },
    {
      id: "rec-3",
      title: "Chargeur Sans Fil Design",
      price: 25.00,
      compareAtPrice: 35.00,
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80",
      rating: 4.3,
      reviewCount: 67,
      available: true,
      badge: "-29%"
    },
    {
      id: "rec-4",
      title: "Support Téléphone Magnétique",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=400&q=80",
      rating: 4.1,
      reviewCount: 34,
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 card-cloud border-b border-white/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Button>
            
            <CartDrawer 
              isOpen={isCartOpen}
              onOpenChange={setIsCartOpen}
              trigger={
                <Button variant="outline" className="relative gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Panier
                </Button>
              }
            />
          </div>
        </div>
      </nav>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <ProductGallery
            images={productData.images}
            productTitle={productData.title}
            badges={[
              { text: "Nouveau", variant: "secondary" },
              { text: "-34%", variant: "destructive" }
            ]}
          />
          <ProductForm product={productData} />
        </div>
      </div>

      {/* Product Details Tabs */}
      <ProductTabs />

      {/* Product Recommendations */}
      <div className="container mx-auto px-4 py-16">
        <ProductRecommendations
          products={recommendedProducts}
          title="Vous aimerez aussi"
          onProductClick={(productId) => console.log('Navigate to product:', productId)}
          onAddToCart={(productId) => console.log('Add to cart:', productId)}
        />
      </div>
      
      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-blue via-lavender to-pastel-pink opacity-10"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="border-t border-gray-200 pt-8">
            <p>&copy; 2024 Zen Ring - Contrôle ton monde ⚡</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" className="hover:text-sky-blue transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-sky-blue transition-colors">CGV</a>
              <a href="#" className="hover:text-sky-blue transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
    </div>
  );
};

export default Product;
