import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  Shield,
  RotateCcw } from
'lucide-react';
import { Product } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('250 Grams');

  if (!product) return null;

  const productVariants = [
  { value: '250 Grams', label: '250 Grams', priceMultiplier: 1 },
  { value: '500 Grams', label: '500 Grams', priceMultiplier: 1.8 },
  { value: '750 Grams', label: '750 Grams', priceMultiplier: 2.5 },
  { value: '1000 Grams', label: '1000 Grams', priceMultiplier: 3.2 }];


  const currentVariant = productVariants.find((v) => v.value === selectedVariant);
  const currentPrice = product.price * (currentVariant?.priceMultiplier || 1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: `${product.name} (${selectedVariant})`,
        price: currentPrice,
        image: product.image,
        category: product.category
      });
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedVariant}) added to your cart.`,
      duration: 3000
    });
    onClose();
  };

  const handleWishlistClick = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="sspzv5p8z" data-path="src/components/ProductQuickView.tsx">
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-id="yfv9evl1q" data-path="src/components/ProductQuickView.tsx">
        <DialogHeader data-id="25xk5pynw" data-path="src/components/ProductQuickView.tsx">
          <DialogTitle data-id="lnfp00sg8" data-path="src/components/ProductQuickView.tsx">Quick View</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-id="1nube8xyw" data-path="src/components/ProductQuickView.tsx">
          {/* Product Image */}
          <div className="relative" data-id="rjjw8t5fi" data-path="src/components/ProductQuickView.tsx">
            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border shadow-lg" data-id="b99nwsv4x" data-path="src/components/ProductQuickView.tsx">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover" data-id="34ujghl66" data-path="src/components/ProductQuickView.tsx" />

            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6" data-id="ibkwoiq1i" data-path="src/components/ProductQuickView.tsx">
            <div data-id="nj3qvjj8b" data-path="src/components/ProductQuickView.tsx">
              <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-800" data-id="zvm35pom7" data-path="src/components/ProductQuickView.tsx">
                {product.category}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-id="kt78ac5qn" data-path="src/components/ProductQuickView.tsx">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4" data-id="plv4omevo" data-path="src/components/ProductQuickView.tsx">
                {product.description || 'Delicious traditional product made with authentic ingredients and time-tested recipes.'}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4" data-id="x2eif0a7q" data-path="src/components/ProductQuickView.tsx">
                <div className="flex space-x-1" data-id="2odmjg80x" data-path="src/components/ProductQuickView.tsx">
                  {[1, 2, 3, 4, 5].map((star) =>
                  <Star key={star} className="w-4 h-4 fill-current text-yellow-400" data-id="x6l9drois" data-path="src/components/ProductQuickView.tsx" />
                  )}
                </div>
                <span className="text-sm text-gray-600" data-id="uy5909niz" data-path="src/components/ProductQuickView.tsx">(4.5) • 24 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6" data-id="dm5t5fls9" data-path="src/components/ProductQuickView.tsx">
              <span className="text-3xl font-bold text-green-600" data-id="bse14nmds" data-path="src/components/ProductQuickView.tsx">
                Rs. {currentPrice.toFixed(2)}
              </span>
              {currentVariant?.priceMultiplier !== 1 &&
              <span className="text-lg text-gray-500 line-through ml-2" data-id="evhj7gxuk" data-path="src/components/ProductQuickView.tsx">
                  Rs. {product.price.toFixed(2)}
                </span>
              }
            </div>

            {/* Variant Selector */}
            <div className="space-y-3" data-id="vbjcby6aw" data-path="src/components/ProductQuickView.tsx">
              <Select value={selectedVariant} onValueChange={setSelectedVariant} data-id="qtndq3g9r" data-path="src/components/ProductQuickView.tsx">
                <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-lg bg-gray-50" data-id="0ivyoq6bp" data-path="src/components/ProductQuickView.tsx">
                  <SelectValue placeholder="Select weight" data-id="afjd4l9rv" data-path="src/components/ProductQuickView.tsx" />
                </SelectTrigger>
                <SelectContent data-id="b2s6in5ls" data-path="src/components/ProductQuickView.tsx">
                  {productVariants.map((variant) =>
                  <SelectItem key={variant.value} value={variant.value} data-id="ys4vo7kqm" data-path="src/components/ProductQuickView.tsx">
                      {variant.label}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4" data-id="ncrxery4j" data-path="src/components/ProductQuickView.tsx">
              <div className="flex items-center justify-between" data-id="8ryij6e7l" data-path="src/components/ProductQuickView.tsx">
                <div className="flex items-center space-x-3" data-id="9xhmiyrmm" data-path="src/components/ProductQuickView.tsx">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border-2" data-id="fxs5pyqpm" data-path="src/components/ProductQuickView.tsx">

                    <Minus className="w-4 h-4" data-id="n8hv1mbyx" data-path="src/components/ProductQuickView.tsx" />
                  </Button>
                  <span className="w-12 text-center font-bold text-xl" data-id="xnjtsykdx" data-path="src/components/ProductQuickView.tsx">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-lg border-2" data-id="lpemrlkxq" data-path="src/components/ProductQuickView.tsx">

                    <Plus className="w-4 h-4" data-id="flvgj1d5z" data-path="src/components/ProductQuickView.tsx" />
                  </Button>
                </div>

                <div className="flex space-x-2" data-id="666q5g0qa" data-path="src/components/ProductQuickView.tsx">
                  <Button
                    variant={isInWishlist(product.id) ? "default" : "outline"}
                    size="sm"
                    onClick={handleWishlistClick}
                    className="w-12 h-12 rounded-lg" data-id="jppkczf3a" data-path="src/components/ProductQuickView.tsx">

                    <Heart className={`w-5 h-5 ${
                    isInWishlist(product.id) ? 'fill-current text-red-500' : 'text-gray-600'}`
                    } data-id="8ighvolag" data-path="src/components/ProductQuickView.tsx" />
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold" data-id="54451j0r2" data-path="src/components/ProductQuickView.tsx">

                    <ShoppingCart className="w-5 h-5 mr-2" data-id="yhjusox3p" data-path="src/components/ProductQuickView.tsx" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4" data-id="av47fffgz" data-path="src/components/ProductQuickView.tsx">
              <div className="flex items-center space-x-3 text-sm" data-id="2udhs1b79" data-path="src/components/ProductQuickView.tsx">
                <Truck className="w-5 h-5 text-green-600" data-id="e28o15ri8" data-path="src/components/ProductQuickView.tsx" />
                <span data-id="v1dhfjy84" data-path="src/components/ProductQuickView.tsx">Free Shipping on orders over Rs. 999</span>
              </div>
              <div className="flex items-center space-x-3 text-sm" data-id="yjo8dcl36" data-path="src/components/ProductQuickView.tsx">
                <Shield className="w-5 h-5 text-blue-600" data-id="ev53a5dr8" data-path="src/components/ProductQuickView.tsx" />
                <span data-id="u14yzk4lt" data-path="src/components/ProductQuickView.tsx">100% Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3 text-sm" data-id="hzfgiokrm" data-path="src/components/ProductQuickView.tsx">
                <RotateCcw className="w-5 h-5 text-purple-600" data-id="t4wmhttpa" data-path="src/components/ProductQuickView.tsx" />
                <span data-id="p1rcbvesy" data-path="src/components/ProductQuickView.tsx">Easy 30-day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

};

export default ProductQuickView;