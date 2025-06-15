import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
import ProductComparison from '../components/ProductComparison';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  Menu } from
'lucide-react';

interface ProductVariant {
  id: number;
  weight: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('250 Grams');
  const [showComparison, setShowComparison] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default product variants for weight/size selection
  const defaultVariants = [
  { value: '250 Grams', label: '250 Grams', priceMultiplier: 1, price: 199 },
  { value: '500 Grams', label: '500 Grams', priceMultiplier: 1.8, price: 359 },
  { value: '750 Grams', label: '750 Grams', priceMultiplier: 2.5, price: 499 },
  { value: '1000 Grams', label: '1000 Grams', priceMultiplier: 3.2, price: 639 }];


  const product = mockProducts().find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      loadProductVariants();
    }
  }, [product]);

  const loadProductVariants = async () => {
    try {
      setIsLoading(true);
      // Try to load variants from database
      const { data, error } = await window.ezsite.apis.tablePage(12221, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: 'id',
        IsAsc: true,
        Filters: [
        { name: 'product_id', op: 'Equal', value: id || '' }]

      });

      if (error) {
        console.warn('Error loading variants:', error);
        return;
      }

      if (data?.List?.length > 0) {
        setProductVariants(data.List);
      }
    } catch (error) {
      console.error('Error loading product variants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="2fj2toeme" data-path="src/pages/ProductDetailPage.tsx">
        <Card className="p-8 text-center" data-id="lrqiqkl5c" data-path="src/pages/ProductDetailPage.tsx">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" data-id="54c5seull" data-path="src/pages/ProductDetailPage.tsx">Product Not Found</h2>
          <p className="text-gray-600 mb-4" data-id="hidjsgs3o" data-path="src/pages/ProductDetailPage.tsx">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')} data-id="98llsh0ce" data-path="src/pages/ProductDetailPage.tsx">
            <ArrowLeft className="w-4 h-4 mr-2" data-id="g1hke4imo" data-path="src/pages/ProductDetailPage.tsx" />
            Back to Products
          </Button>
        </Card>
      </div>);
  }

  // Get current variant price
  const getCurrentVariantPrice = () => {
    const dbVariant = productVariants.find((v) => v.weight === selectedVariant);
    if (dbVariant) {
      return dbVariant.price;
    }

    const defaultVariant = defaultVariants.find((v) => v.value === selectedVariant);
    return defaultVariant?.price || product.price;
  };

  const currentPrice = getCurrentVariantPrice();

  const relatedProducts = mockProducts().
  filter((p) => p.category === product.category && p.id !== product.id).
  slice(0, 4);

  // Use a tomato pickle image as default
  const productImages = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
  product.image,
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'];


  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: `${product.name} (${selectedVariant})`,
        price: currentPrice,
        image: productImages[0],
        category: product.category
      });
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x Tomato Pickle (${selectedVariant}) added to your cart.`,
      duration: 3000
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock_quantity || 100)) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistClick = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const getAvailableVariants = () => {
    if (productVariants.length > 0) {
      return productVariants.filter((v) => v.is_active);
    }
    return defaultVariants;
  };

  return (
    <div className="min-h-screen bg-gray-50" data-id="qzppw49uy" data-path="src/pages/ProductDetailPage.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-id="e3mcqih8c" data-path="src/pages/ProductDetailPage.tsx">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8" data-id="12cpu0xpd" data-path="src/pages/ProductDetailPage.tsx">
          <button onClick={() => navigate('/')} className="hover:text-gray-700" data-id="uib96ijs9" data-path="src/pages/ProductDetailPage.tsx">
            Home
          </button>
          <span data-id="jrz6s6wiu" data-path="src/pages/ProductDetailPage.tsx">/</span>
          <button onClick={() => navigate('/products')} className="hover:text-gray-700" data-id="emg5rkb09" data-path="src/pages/ProductDetailPage.tsx">
            Products
          </button>
          <span data-id="3njho0xf7" data-path="src/pages/ProductDetailPage.tsx">/</span>
          <button onClick={() => navigate(`/products?category=${product.category}`)} className="hover:text-gray-700" data-id="2aq5lyh5w" data-path="src/pages/ProductDetailPage.tsx">
            {product.category}
          </button>
          <span data-id="0cyykhd31" data-path="src/pages/ProductDetailPage.tsx">/</span>
          <span className="text-gray-900" data-id="2ijuypygp" data-path="src/pages/ProductDetailPage.tsx">Tomato Pickle</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16" data-id="jmf3ighaw" data-path="src/pages/ProductDetailPage.tsx">
          {/* Product Images */}
          <div className="relative" data-id="hpb2julvp" data-path="src/pages/ProductDetailPage.tsx">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border shadow-2xl p-8" data-id="uvn4cs1d6" data-path="src/pages/ProductDetailPage.tsx">
              <div className="relative w-full h-full flex items-center justify-center" data-id="cjjrfw061" data-path="src/pages/ProductDetailPage.tsx">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-yellow-100/20 rounded-xl" data-id="p3yedi53o" data-path="src/pages/ProductDetailPage.tsx"></div>
                
                {/* Product arrangement matching the image */}
                <div className="relative w-full h-full flex items-center justify-center" data-id="o8zy556we" data-path="src/pages/ProductDetailPage.tsx">
                  {/* Main product composition */}
                  <div className="relative w-4/5 h-4/5 flex items-center justify-center" data-id="fcjom9hdi" data-path="src/pages/ProductDetailPage.tsx">
                    {/* Wicker mat background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full opacity-60 transform rotate-12" data-id="f8m197d0z" data-path="src/pages/ProductDetailPage.tsx"></div>
                    
                    {/* Main pickle bowl */}
                    <div className="relative z-10" data-id="ntjxn40u0" data-path="src/pages/ProductDetailPage.tsx">
                      <img
                        src={productImages[selectedImage]}
                        alt="Tomato Pickle"
                        className="w-48 h-48 object-cover rounded-full drop-shadow-2xl" data-id="p5yay82g6" data-path="src/pages/ProductDetailPage.tsx" />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-8 right-8 w-16 h-20 bg-gradient-to-b from-green-200 to-green-300 rounded-lg shadow-lg opacity-90 transform rotate-12" data-id="pbetknbx1" data-path="src/pages/ProductDetailPage.tsx">
                      <div className="w-full h-full bg-gradient-to-b from-yellow-200 to-orange-300 rounded-lg flex items-center justify-center" data-id="hai2841ly" data-path="src/pages/ProductDetailPage.tsx">
                        <span className="text-xs font-bold text-green-800 transform -rotate-12" data-id="bsgxzeqsj" data-path="src/pages/ProductDetailPage.tsx">Tomato<br data-id="8olscyjq8" data-path="src/pages/ProductDetailPage.tsx" />Pickle</span>
                      </div>
                    </div>
                    
                    {/* Tomatoes */}
                    <div className="absolute bottom-12 left-8 w-8 h-8 bg-red-500 rounded-full shadow-lg opacity-90" data-id="ek54ymtop" data-path="src/pages/ProductDetailPage.tsx"></div>
                    <div className="absolute bottom-16 left-16 w-6 h-6 bg-red-600 rounded-full shadow-lg opacity-80" data-id="qhdxrtxme" data-path="src/pages/ProductDetailPage.tsx"></div>
                    
                    {/* Spice jar */}
                    <div className="absolute bottom-8 right-12 w-6 h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm shadow-lg opacity-80" data-id="jkb4yzw3x" data-path="src/pages/ProductDetailPage.tsx"></div>
                    
                    {/* Wooden spoon */}
                    <div className="absolute top-16 left-12 w-12 h-2 bg-amber-600 rounded-full shadow-lg opacity-70 transform rotate-45" data-id="eiwn7kgwh" data-path="src/pages/ProductDetailPage.tsx"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col space-y-3" data-id="3w8ckor9o" data-path="src/pages/ProductDetailPage.tsx">
              <Button
                variant={isInWishlist(product.id) ? "default" : "outline"}
                size="sm"
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white"
                onClick={handleWishlistClick} data-id="50bkut4iv" data-path="src/pages/ProductDetailPage.tsx">
                <Heart className={`w-5 h-5 ${
                isInWishlist(product.id) ? 'fill-current text-red-500' : 'text-gray-600'}`
                } data-id="l4x16vn4f" data-path="src/pages/ProductDetailPage.tsx" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white" data-id="1hvmazcar" data-path="src/pages/ProductDetailPage.tsx">
                <Eye className="w-5 h-5 text-gray-600" data-id="40ux8tc3n" data-path="src/pages/ProductDetailPage.tsx" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const stored = localStorage.getItem('comparedProducts');
                  const comparedProducts = stored ? JSON.parse(stored) : [];

                  if (comparedProducts.find((p: any) => p.id === product.id)) {
                    toast({
                      title: "Already in comparison",
                      description: "This product is already in your comparison list.",
                      duration: 2000
                    });
                    setShowComparison(true);
                    return;
                  }

                  if (comparedProducts.length >= 4) {
                    toast({
                      title: "Comparison limit reached",
                      description: "You can compare up to 4 products at a time.",
                      variant: "destructive",
                      duration: 3000
                    });
                    return;
                  }

                  comparedProducts.push(product);
                  localStorage.setItem('comparedProducts', JSON.stringify(comparedProducts));

                  toast({
                    title: "Added to comparison",
                    description: `${product.name} added to comparison list.`,
                    duration: 2000
                  });

                  setShowComparison(true);
                }}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border shadow-lg hover:bg-white" data-id="wsnhsjd4i" data-path="src/pages/ProductDetailPage.tsx">
                <Menu className="w-5 h-5 text-gray-600" data-id="u9ktalh3r" data-path="src/pages/ProductDetailPage.tsx" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6" data-id="svixp0fs3" data-path="src/pages/ProductDetailPage.tsx">
            <div data-id="dtuh0d93f" data-path="src/pages/ProductDetailPage.tsx">
              <Badge variant="secondary" className="mb-3 bg-orange-100 text-orange-800 px-3 py-1" data-id="fh8hh7m77" data-path="src/pages/ProductDetailPage.tsx">
                Veg Pickle
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" data-id="pgihmzt3q" data-path="src/pages/ProductDetailPage.tsx">
                Tomato Pickle
              </h1>
              <p className="text-lg text-gray-600 mb-6" data-id="efsgc9dvc" data-path="src/pages/ProductDetailPage.tsx">
                Premium quality homemade tomato pickle with traditional spices and authentic flavors. Made with fresh tomatoes and aromatic spices.
              </p>
              
              {/* Price Display */}
              <div className="mb-6" data-id="18nifx2gy" data-path="src/pages/ProductDetailPage.tsx">
                <span className="text-3xl font-bold text-green-600" data-id="lzjzfedrk" data-path="src/pages/ProductDetailPage.tsx">
                  ₹{currentPrice}
                </span>
                <span className="ml-3 text-lg text-gray-500 line-through" data-id="w5a64btzj" data-path="src/pages/ProductDetailPage.tsx">
                  ₹{Math.round(currentPrice * 1.2)}
                </span>
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded" data-id="ozac2jrh8" data-path="src/pages/ProductDetailPage.tsx">
                  Save ₹{Math.round(currentPrice * 0.2)}
                </span>
              </div>
            </div>

            {/* Weight/Size Selector */}
            <div className="space-y-3" data-id="7e3kuaf17" data-path="src/pages/ProductDetailPage.tsx">
              <Select value={selectedVariant} onValueChange={setSelectedVariant} data-id="b5r77rhif" data-path="src/pages/ProductDetailPage.tsx">
                <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-lg bg-gray-50" data-id="atevgjb68" data-path="src/pages/ProductDetailPage.tsx">
                  <SelectValue placeholder="Select weight" data-id="itu1ijagc" data-path="src/pages/ProductDetailPage.tsx" />
                </SelectTrigger>
                <SelectContent data-id="vl9qta6hq" data-path="src/pages/ProductDetailPage.tsx">
                  {getAvailableVariants().map((variant) => (
                    <SelectItem
                      key={variant.weight || variant.value}
                      value={variant.weight || variant.value}
                      data-id="g8u6oxwym"
                      data-path="src/pages/ProductDetailPage.tsx"
                    >
                      {variant.weight || variant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4" data-id="rir3h2odt" data-path="src/pages/ProductDetailPage.tsx">
              <div className="flex items-center justify-between" data-id="m2stm8h7a" data-path="src/pages/ProductDetailPage.tsx">
                <div className="flex items-center space-x-3" data-id="2gxqv3n16" data-path="src/pages/ProductDetailPage.tsx">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border-2" data-id="vhv4o04u0" data-path="src/pages/ProductDetailPage.tsx">
                    <Minus className="w-4 h-4" data-id="6bxk5hv3y" data-path="src/pages/ProductDetailPage.tsx" />
                  </Button>
                  <span className="w-12 text-center font-bold text-xl" data-id="tfizda95t" data-path="src/pages/ProductDetailPage.tsx">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock_quantity || 100)}
                    className="w-10 h-10 rounded-lg border-2" data-id="8o98sar0g" data-path="src/pages/ProductDetailPage.tsx">
                    <Plus className="w-4 h-4" data-id="kuur8maty" data-path="src/pages/ProductDetailPage.tsx" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={(product.stock_quantity || 100) === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold" data-id="uy6gbi6gy" data-path="src/pages/ProductDetailPage.tsx">
                  <ShoppingCart className="w-5 h-5 mr-2" data-id="yzy08gckk" data-path="src/pages/ProductDetailPage.tsx" />
                  ADD
                </Button>
              </div>
            </div>

            <Separator data-id="07nxfl43o" data-path="src/pages/ProductDetailPage.tsx" />

            {/* Product Features */}
            <div className="space-y-3" data-id="fpwb3thvw" data-path="src/pages/ProductDetailPage.tsx">
              <h3 className="font-semibold text-lg" data-id="3l22jg22d" data-path="src/pages/ProductDetailPage.tsx">Product Features</h3>
              <ul className="space-y-2 text-gray-600" data-id="cm0yi0ilj" data-path="src/pages/ProductDetailPage.tsx">
                <li className="flex items-center space-x-2" data-id="1wnlte4zm" data-path="src/pages/ProductDetailPage.tsx">
                  <div className="w-2 h-2 bg-green-500 rounded-full" data-id="xggojkcma" data-path="src/pages/ProductDetailPage.tsx"></div>
                  <span data-id="41ybcadoc" data-path="src/pages/ProductDetailPage.tsx">Made with fresh, ripe tomatoes</span>
                </li>
                <li className="flex items-center space-x-2" data-id="v0q3zg8hq" data-path="src/pages/ProductDetailPage.tsx">
                  <div className="w-2 h-2 bg-green-500 rounded-full" data-id="zkqry3bwf" data-path="src/pages/ProductDetailPage.tsx"></div>
                  <span data-id="m6t2zkt7m" data-path="src/pages/ProductDetailPage.tsx">Traditional family recipe</span>
                </li>
                <li className="flex items-center space-x-2" data-id="n5eajyo7a" data-path="src/pages/ProductDetailPage.tsx">
                  <div className="w-2 h-2 bg-green-500 rounded-full" data-id="zts32b5qo" data-path="src/pages/ProductDetailPage.tsx"></div>
                  <span data-id="g1oh1j0ug" data-path="src/pages/ProductDetailPage.tsx">No artificial preservatives</span>
                </li>
                <li className="flex items-center space-x-2" data-id="2yd5lig9x" data-path="src/pages/ProductDetailPage.tsx">
                  <div className="w-2 h-2 bg-green-500 rounded-full" data-id="1o8qqs055" data-path="src/pages/ProductDetailPage.tsx"></div>
                  <span data-id="xrgqnzo7o" data-path="src/pages/ProductDetailPage.tsx">Rich in antioxidants and vitamins</span>
                </li>
              </ul>
            </div>

            <Separator data-id="0she8ehcy" data-path="src/pages/ProductDetailPage.tsx" />

            {/* Shipping & Returns */}
            <div className="space-y-4" data-id="kztxw9sbb" data-path="src/pages/ProductDetailPage.tsx">
              <div className="flex items-center space-x-3" data-id="9o714s169" data-path="src/pages/ProductDetailPage.tsx">
                <Truck className="w-5 h-5 text-green-600" data-id="sf8g4226m" data-path="src/pages/ProductDetailPage.tsx" />
                <div data-id="7da2uaexy" data-path="src/pages/ProductDetailPage.tsx">
                  <p className="font-medium" data-id="rpwwt2f71" data-path="src/pages/ProductDetailPage.tsx">Free Shipping</p>
                  <p className="text-sm text-gray-600" data-id="bi9uhb8hy" data-path="src/pages/ProductDetailPage.tsx">On orders over ₹499</p>
                </div>
              </div>
              <div className="flex items-center space-x-3" data-id="np3b8hqd0" data-path="src/pages/ProductDetailPage.tsx">
                <Shield className="w-5 h-5 text-blue-600" data-id="3s02kq5ga" data-path="src/pages/ProductDetailPage.tsx" />
                <div data-id="cr9ehw7r1" data-path="src/pages/ProductDetailPage.tsx">
                  <p className="font-medium" data-id="lzis5tptz" data-path="src/pages/ProductDetailPage.tsx">Secure Payment</p>
                  <p className="text-sm text-gray-600" data-id="g1yccpga5" data-path="src/pages/ProductDetailPage.tsx">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center space-x-3" data-id="vips232rj" data-path="src/pages/ProductDetailPage.tsx">
                <RotateCcw className="w-5 h-5 text-purple-600" data-id="gn208gsi8" data-path="src/pages/ProductDetailPage.tsx" />
                <div data-id="8tb65itax" data-path="src/pages/ProductDetailPage.tsx">
                  <p className="font-medium" data-id="3xe6ce3q4" data-path="src/pages/ProductDetailPage.tsx">Easy Returns</p>
                  <p className="text-sm text-gray-600" data-id="ljngxtw6y" data-path="src/pages/ProductDetailPage.tsx">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mb-16" data-id="7ocyi595h" data-path="src/pages/ProductDetailPage.tsx">
          <ProductReviews productId={product.id} data-id="2wu26pold" data-path="src/pages/ProductDetailPage.tsx" />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 &&
        <div data-id="up090ia3t" data-path="src/pages/ProductDetailPage.tsx">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" data-id="3a78y50qg" data-path="src/pages/ProductDetailPage.tsx">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-id="xtqau7zan" data-path="src/pages/ProductDetailPage.tsx">
              {relatedProducts.map((relatedProduct) =>
            <ProductCard key={relatedProduct.id} product={relatedProduct} data-id="gcl9viiei" data-path="src/pages/ProductDetailPage.tsx" />
            )}
            </div>
          </div>
        }
        
        {/* Comparison Modal */}
        <ProductComparison
          isOpen={showComparison}
          onClose={() => setShowComparison(false)} data-id="lqwjtevqh" data-path="src/pages/ProductDetailPage.tsx" />

      </div>
    </div>);

};

export default ProductDetailPage;
