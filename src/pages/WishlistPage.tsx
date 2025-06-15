import React, { useState, useEffect } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    // Get product details for wishlist items
    const products = wishlistItems.map((item) => {
      return mockProducts.find((product) => product.id === item.product_id);
    }).filter(Boolean);
    setWishlistProducts(products);
  }, [wishlistItems]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="7xnifktzm" data-path="src/pages/WishlistPage.tsx">
        <Card className="max-w-md w-full mx-4" data-id="92fmt2wee" data-path="src/pages/WishlistPage.tsx">
          <CardContent className="p-8 text-center" data-id="dd6akse43" data-path="src/pages/WishlistPage.tsx">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" data-id="sokvbez9k" data-path="src/pages/WishlistPage.tsx" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-id="2rvsb2exv" data-path="src/pages/WishlistPage.tsx">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6" data-id="kq8d8x8yq" data-path="src/pages/WishlistPage.tsx">
              Please login to view your wishlist
            </p>
            <Button asChild data-id="w6e8jcw14" data-path="src/pages/WishlistPage.tsx">
              <Link to="/login" data-id="mqb0wpq0n" data-path="src/pages/WishlistPage.tsx">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="kprlobsfr" data-path="src/pages/WishlistPage.tsx">
        <div className="text-center" data-id="5wl2rhbv4" data-path="src/pages/WishlistPage.tsx">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" data-id="dd6lqlq1k" data-path="src/pages/WishlistPage.tsx"></div>
          <p className="mt-4 text-gray-600" data-id="iyivgapro" data-path="src/pages/WishlistPage.tsx">Loading your wishlist...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-id="09iyhsk63" data-path="src/pages/WishlistPage.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="mrn8j23vq" data-path="src/pages/WishlistPage.tsx">
        <div className="mb-8" data-id="xt8cxbqp1" data-path="src/pages/WishlistPage.tsx">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center" data-id="gdgov5jrr" data-path="src/pages/WishlistPage.tsx">
            <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" data-id="co1qlbiam" data-path="src/pages/WishlistPage.tsx" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2" data-id="7l6sqz8yd" data-path="src/pages/WishlistPage.tsx">
            {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        {wishlistProducts.length === 0 ?
        <Card className="max-w-2xl mx-auto" data-id="2kew6jrbx" data-path="src/pages/WishlistPage.tsx">
            <CardContent className="p-12 text-center" data-id="bfbs536z4" data-path="src/pages/WishlistPage.tsx">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" data-id="ryorlx05y" data-path="src/pages/WishlistPage.tsx" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4" data-id="34o6e9y16" data-path="src/pages/WishlistPage.tsx">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8" data-id="5531c0jqd" data-path="src/pages/WishlistPage.tsx">
                Start adding products you love to your wishlist and never lose track of them!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center" data-id="67i3xams7" data-path="src/pages/WishlistPage.tsx">
                <Button asChild data-id="sp2h7wsqe" data-path="src/pages/WishlistPage.tsx">
                  <Link to="/products" data-id="yhy7gvmto" data-path="src/pages/WishlistPage.tsx">
                    <ShoppingBag className="w-4 h-4 mr-2" data-id="1v3zcimej" data-path="src/pages/WishlistPage.tsx" />
                    Browse Products
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card> :

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-id="jvo97n5zy" data-path="src/pages/WishlistPage.tsx">
            {wishlistProducts.map((product) =>
          <div key={product.id} className="relative group" data-id="0xi4of0yo" data-path="src/pages/WishlistPage.tsx">
                <ProductCard product={product} data-id="tqmzg9r2p" data-path="src/pages/WishlistPage.tsx" />
                <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={() => removeFromWishlist(product.id)} data-id="tjq4a84gi" data-path="src/pages/WishlistPage.tsx">

                  <Trash2 className="w-4 h-4" data-id="0wy8kkw14" data-path="src/pages/WishlistPage.tsx" />
                </Button>
              </div>
          )}
          </div>
        }

        {wishlistProducts.length > 0 &&
        <div className="mt-12 text-center" data-id="wh080bll2" data-path="src/pages/WishlistPage.tsx">
            <Card className="max-w-2xl mx-auto" data-id="15rcf7szx" data-path="src/pages/WishlistPage.tsx">
              <CardContent className="p-8" data-id="rtjfeuotm" data-path="src/pages/WishlistPage.tsx">
                <h3 className="text-xl font-semibold text-gray-900 mb-4" data-id="jxhnmjuf7" data-path="src/pages/WishlistPage.tsx">
                  Ready to purchase?
                </h3>
                <p className="text-gray-600 mb-6" data-id="8n1d577lw" data-path="src/pages/WishlistPage.tsx">
                  Add your favorite items to cart and complete your purchase today!
                </p>
                <Button asChild size="lg" data-id="vq7gnrv0w" data-path="src/pages/WishlistPage.tsx">
                  <Link to="/products" data-id="29bwn64c4" data-path="src/pages/WishlistPage.tsx">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        }
      </div>
    </div>);

};

export default WishlistPage;