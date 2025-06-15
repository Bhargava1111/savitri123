import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import {
  X,
  Heart,
  ShoppingCart,
  Star,
  Check,
  Minus } from
'lucide-react';
import { Product } from '../types';

interface ProductComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ isOpen, onClose }) => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    // Load compared products from localStorage
    const stored = localStorage.getItem('comparedProducts');
    if (stored) {
      setComparedProducts(JSON.parse(stored));
    }
  }, [isOpen]);

  const removeFromComparison = (productId: string) => {
    const updated = comparedProducts.filter((p) => p.id !== productId);
    setComparedProducts(updated);
    localStorage.setItem('comparedProducts', JSON.stringify(updated));

    toast({
      title: "Removed from comparison",
      description: "Product removed from comparison list.",
      duration: 2000
    });
  };

  const clearAll = () => {
    setComparedProducts([]);
    localStorage.removeItem('comparedProducts');
    toast({
      title: "Comparison cleared",
      description: "All products removed from comparison.",
      duration: 2000
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
      duration: 3000
    });
  };

  const handleWishlistClick = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const getFeaturesList = (product: Product) => {
    // Mock features for comparison
    return [
    'Traditional Recipe',
    'No Preservatives',
    'Authentic Taste',
    'Home-made Style',
    'Long Shelf Life'];

  };

  if (comparedProducts.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose} data-id="oet95c5h7" data-path="src/components/ProductComparison.tsx">
        <DialogContent className="max-w-md" data-id="j922s3bic" data-path="src/components/ProductComparison.tsx">
          <DialogHeader data-id="ah444ijzd" data-path="src/components/ProductComparison.tsx">
            <DialogTitle data-id="qc169ertw" data-path="src/components/ProductComparison.tsx">Product Comparison</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8" data-id="av6j5c5z0" data-path="src/components/ProductComparison.tsx">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" data-id="wgiwogskp" data-path="src/components/ProductComparison.tsx">
              <ShoppingCart className="w-8 h-8 text-gray-400" data-id="w8zuisj7m" data-path="src/components/ProductComparison.tsx" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-id="x7ucs9nhx" data-path="src/components/ProductComparison.tsx">No Products to Compare</h3>
            <p className="text-gray-600 mb-4" data-id="vgleihf60" data-path="src/components/ProductComparison.tsx">
              Add products to comparison from product pages to see them here.
            </p>
            <Button onClick={onClose} data-id="1f1yo80y2" data-path="src/components/ProductComparison.tsx">Continue Shopping</Button>
          </div>
        </DialogContent>
      </Dialog>);

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="b3nqpqnyu" data-path="src/components/ProductComparison.tsx">
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-id="n23qd77jm" data-path="src/components/ProductComparison.tsx">
        <DialogHeader data-id="okf7mzh1z" data-path="src/components/ProductComparison.tsx">
          <div className="flex justify-between items-center" data-id="cn87op3g6" data-path="src/components/ProductComparison.tsx">
            <DialogTitle data-id="k8hv5orx7" data-path="src/components/ProductComparison.tsx">Compare Products ({comparedProducts.length})</DialogTitle>
            <Button variant="outline" size="sm" onClick={clearAll} data-id="nzyrkwh6f" data-path="src/components/ProductComparison.tsx">
              Clear All
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-x-auto" data-id="ary8d0mz7" data-path="src/components/ProductComparison.tsx">
          <table className="w-full border-collapse" data-id="zv7ct57it" data-path="src/components/ProductComparison.tsx">
            <thead data-id="gh9gqsrry" data-path="src/components/ProductComparison.tsx">
              <tr data-id="ghp4tpa6t" data-path="src/components/ProductComparison.tsx">
                <td className="p-4 border-b border-gray-200 font-medium w-32" data-id="e6di3wgta" data-path="src/components/ProductComparison.tsx">Products</td>
                {comparedProducts.map((product) =>
                <td key={product.id} className="p-4 border-b border-gray-200 text-center relative" data-id="82spwdhug" data-path="src/components/ProductComparison.tsx">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromComparison(product.id)}
                    className="absolute top-2 right-2 w-6 h-6 p-0" data-id="oqxc2x6tk" data-path="src/components/ProductComparison.tsx">

                      <X className="w-4 h-4" data-id="xkxam3eon" data-path="src/components/ProductComparison.tsx" />
                    </Button>
                    <div className="space-y-2" data-id="1kar5g7uq" data-path="src/components/ProductComparison.tsx">
                      <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-gray-100" data-id="a7hlpcxvi" data-path="src/components/ProductComparison.tsx">
                        <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover" data-id="dpt08ifez" data-path="src/components/ProductComparison.tsx" />

                      </div>
                      <h3 className="font-semibold text-sm" data-id="kp80156p0" data-path="src/components/ProductComparison.tsx">{product.name}</h3>
                      <Badge variant="outline" className="text-xs" data-id="79dzlg9in" data-path="src/components/ProductComparison.tsx">
                        {product.category}
                      </Badge>
                    </div>
                  </td>
                )}
              </tr>
            </thead>
            <tbody data-id="9f5xxzkr0" data-path="src/components/ProductComparison.tsx">
              {/* Price Row */}
              <tr data-id="vqp384lbc" data-path="src/components/ProductComparison.tsx">
                <td className="p-4 border-b border-gray-200 font-medium" data-id="r2dtyniqs" data-path="src/components/ProductComparison.tsx">Price</td>
                {comparedProducts.map((product) =>
                <td key={`price-${product.id}`} className="p-4 border-b border-gray-200 text-center" data-id="toghzh8p5" data-path="src/components/ProductComparison.tsx">
                    <span className="text-xl font-bold text-green-600" data-id="chieq0m7w" data-path="src/components/ProductComparison.tsx">
                      Rs. {product.price.toFixed(2)}
                    </span>
                  </td>
                )}
              </tr>

              {/* Rating Row */}
              <tr data-id="v4rmxbn4j" data-path="src/components/ProductComparison.tsx">
                <td className="p-4 border-b border-gray-200 font-medium" data-id="4uakp8r2q" data-path="src/components/ProductComparison.tsx">Rating</td>
                {comparedProducts.map((product) =>
                <td key={`rating-${product.id}`} className="p-4 border-b border-gray-200 text-center" data-id="3h86fg67s" data-path="src/components/ProductComparison.tsx">
                    <div className="flex justify-center items-center space-x-1" data-id="k7g82rt09" data-path="src/components/ProductComparison.tsx">
                      <div className="flex" data-id="vwc4g5ai0" data-path="src/components/ProductComparison.tsx">
                        {[1, 2, 3, 4, 5].map((star) =>
                      <Star key={star} className="w-4 h-4 fill-current text-yellow-400" data-id="mh933hib3" data-path="src/components/ProductComparison.tsx" />
                      )}
                      </div>
                      <span className="text-sm text-gray-600" data-id="zub3dskl4" data-path="src/components/ProductComparison.tsx">(4.5)</span>
                    </div>
                  </td>
                )}
              </tr>

              {/* Stock Row */}
              <tr data-id="p72f1sr8s" data-path="src/components/ProductComparison.tsx">
                <td className="p-4 border-b border-gray-200 font-medium" data-id="9sav6c95w" data-path="src/components/ProductComparison.tsx">Stock</td>
                {comparedProducts.map((product) =>
                <td key={`stock-${product.id}`} className="p-4 border-b border-gray-200 text-center" data-id="wn0odrgab" data-path="src/components/ProductComparison.tsx">
                    <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"} data-id="g5wlrgejo" data-path="src/components/ProductComparison.tsx">
                      {product.stock_quantity > 0 ? `${product.stock_quantity} Available` : 'Out of Stock'}
                    </Badge>
                  </td>
                )}
              </tr>

              {/* Features Rows */}
              {getFeaturesList(comparedProducts[0]).map((feature, index) =>
              <tr key={`feature-${index}`} data-id="m3p1p3ig5" data-path="src/components/ProductComparison.tsx">
                  <td className="p-4 border-b border-gray-200 font-medium" data-id="nkpw1xdw7" data-path="src/components/ProductComparison.tsx">{feature}</td>
                  {comparedProducts.map((product) =>
                <td key={`${product.id}-feature-${index}`} className="p-4 border-b border-gray-200 text-center" data-id="nzndxm5ci" data-path="src/components/ProductComparison.tsx">
                      {Math.random() > 0.3 ?
                  <Check className="w-5 h-5 text-green-600 mx-auto" data-id="8sph6im12" data-path="src/components/ProductComparison.tsx" /> :

                  <Minus className="w-5 h-5 text-gray-400 mx-auto" data-id="fqbz0rdcz" data-path="src/components/ProductComparison.tsx" />
                  }
                    </td>
                )}
                </tr>
              )}

              {/* Actions Row */}
              <tr data-id="nh62lm9na" data-path="src/components/ProductComparison.tsx">
                <td className="p-4 font-medium" data-id="7oxyeyfgf" data-path="src/components/ProductComparison.tsx">Actions</td>
                {comparedProducts.map((product) =>
                <td key={`actions-${product.id}`} className="p-4 text-center" data-id="ebuq12842" data-path="src/components/ProductComparison.tsx">
                    <div className="space-y-2" data-id="it1o0xcqt" data-path="src/components/ProductComparison.tsx">
                      <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="sm" data-id="qo4ewtur1" data-path="src/components/ProductComparison.tsx">

                        <ShoppingCart className="w-4 h-4 mr-1" data-id="eiqe628d6" data-path="src/components/ProductComparison.tsx" />
                        Add to Cart
                      </Button>
                      <Button
                      variant={isInWishlist(product.id) ? "default" : "outline"}
                      onClick={() => handleWishlistClick(product)}
                      className="w-full"
                      size="sm" data-id="diixij40l" data-path="src/components/ProductComparison.tsx">

                        <Heart className={`w-4 h-4 mr-1 ${
                      isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`
                      } data-id="de73pkvl5" data-path="src/components/ProductComparison.tsx" />
                        {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>);

};

export default ProductComparison;