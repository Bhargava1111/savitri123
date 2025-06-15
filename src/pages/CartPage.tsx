import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="7rvev8mjf" data-path="src/pages/CartPage.tsx">
        <Card className="max-w-md w-full mx-4" data-id="w7ntrmx88" data-path="src/pages/CartPage.tsx">
          <CardContent className="p-8 text-center" data-id="ithrs30ol" data-path="src/pages/CartPage.tsx">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" data-id="ub0o46e5y" data-path="src/pages/CartPage.tsx" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-id="8h5axfcps" data-path="src/pages/CartPage.tsx">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6" data-id="7aekj73c8" data-path="src/pages/CartPage.tsx">
              Please login to view your cart
            </p>
            <Button asChild data-id="l4yd11l0l" data-path="src/pages/CartPage.tsx">
              <Link to="/auth" data-id="7daip6655" data-path="src/pages/CartPage.tsx">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" data-id="883qjiwi2" data-path="src/pages/CartPage.tsx">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-id="pjq6qkvy7" data-path="src/pages/CartPage.tsx">
          <div className="text-center py-16" data-id="uejgzn90y" data-path="src/pages/CartPage.tsx">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" data-id="5bapa4edz" data-path="src/pages/CartPage.tsx" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-id="sdqfqlmei" data-path="src/pages/CartPage.tsx">Your cart is empty</h2>
            <p className="text-gray-600 mb-6" data-id="i7hgfcjbl" data-path="src/pages/CartPage.tsx">Start shopping to add items to your cart</p>
            <Button asChild data-id="agxgdc5p6" data-path="src/pages/CartPage.tsx">
              <Link to="/products" data-id="7czbqa9i1" data-path="src/pages/CartPage.tsx">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-id="h239ftl7d" data-path="src/pages/CartPage.tsx">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-id="uxkr2b7xv" data-path="src/pages/CartPage.tsx">
        <div className="mb-8" data-id="cox4hjzj8" data-path="src/pages/CartPage.tsx">
          <h1 className="text-3xl font-bold text-gray-900" data-id="lpd9yy558" data-path="src/pages/CartPage.tsx">Shopping Cart</h1>
          <p className="text-gray-600 mt-2" data-id="ma06dxrih" data-path="src/pages/CartPage.tsx">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-id="0jqm9cnc4" data-path="src/pages/CartPage.tsx">
          {/* Cart Items */}
          <div className="lg:col-span-2" data-id="3khtxg3zv" data-path="src/pages/CartPage.tsx">
            <Card data-id="gcyoshlgr" data-path="src/pages/CartPage.tsx">
              <CardHeader data-id="13bmrh7ec" data-path="src/pages/CartPage.tsx">
                <CardTitle data-id="shbah35ga" data-path="src/pages/CartPage.tsx">Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent data-id="1ca7qbz2m" data-path="src/pages/CartPage.tsx">
                <div className="space-y-4" data-id="3fkxm3q3o" data-path="src/pages/CartPage.tsx">
                  {items.map((item) =>
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg" data-id="fzt4cnkpt" data-path="src/pages/CartPage.tsx">
                      <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg" data-id="wdi0cv1of" data-path="src/pages/CartPage.tsx" />

                      <div className="flex-1" data-id="8voh7t8fb" data-path="src/pages/CartPage.tsx">
                        <h3 className="font-medium text-gray-900" data-id="0nobdotsm" data-path="src/pages/CartPage.tsx">{item.name}</h3>
                        <p className="text-sm text-gray-600" data-id="8fxpof9ot" data-path="src/pages/CartPage.tsx">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2" data-id="6lidskch4" data-path="src/pages/CartPage.tsx">
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1} data-id="cp0hhibap" data-path="src/pages/CartPage.tsx">

                          <Minus className="h-4 w-4" data-id="sjqk81f1w" data-path="src/pages/CartPage.tsx" />
                        </Button>
                        <span className="w-8 text-center" data-id="esjm8aa3w" data-path="src/pages/CartPage.tsx">{item.quantity}</span>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} data-id="phb2vf4vu" data-path="src/pages/CartPage.tsx">

                          <Plus className="h-4 w-4" data-id="qghy63h4c" data-path="src/pages/CartPage.tsx" />
                        </Button>
                      </div>
                      <div className="text-right" data-id="leice09lc" data-path="src/pages/CartPage.tsx">
                        <p className="font-medium" data-id="tgpjv0fjo" data-path="src/pages/CartPage.tsx">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800" data-id="xbmqgq37n" data-path="src/pages/CartPage.tsx">

                          <Trash2 className="h-4 w-4" data-id="hu3b0lnxi" data-path="src/pages/CartPage.tsx" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1" data-id="nxl5un70x" data-path="src/pages/CartPage.tsx">
            <Card data-id="mddqiddm0" data-path="src/pages/CartPage.tsx">
              <CardHeader data-id="b7ag1xdoq" data-path="src/pages/CartPage.tsx">
                <CardTitle data-id="6ad1vl7wr" data-path="src/pages/CartPage.tsx">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="dquf4pucv" data-path="src/pages/CartPage.tsx">
                <div className="flex justify-between" data-id="21dmb87n9" data-path="src/pages/CartPage.tsx">
                  <span data-id="myofc7ni8" data-path="src/pages/CartPage.tsx">Subtotal</span>
                  <span data-id="2l0nils5z" data-path="src/pages/CartPage.tsx">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between" data-id="0suu4dlxx" data-path="src/pages/CartPage.tsx">
                  <span data-id="fha8w6ptb" data-path="src/pages/CartPage.tsx">Shipping</span>
                  <span data-id="gxjnltj02" data-path="src/pages/CartPage.tsx">Free</span>
                </div>
                <div className="flex justify-between" data-id="b5zjv6lye" data-path="src/pages/CartPage.tsx">
                  <span data-id="a0baro5th" data-path="src/pages/CartPage.tsx">Tax</span>
                  <span data-id="ohjyitz84" data-path="src/pages/CartPage.tsx">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <Separator data-id="qgc74ktpf" data-path="src/pages/CartPage.tsx" />
                <div className="flex justify-between font-bold" data-id="kxqsoan2r" data-path="src/pages/CartPage.tsx">
                  <span data-id="0idnp6ncc" data-path="src/pages/CartPage.tsx">Total</span>
                  <span data-id="1rawuqctf" data-path="src/pages/CartPage.tsx">${(getTotalPrice() * 1.08).toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={() => navigate('/checkout')} data-id="p1yike3j6" data-path="src/pages/CartPage.tsx">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" asChild data-id="0kwiat4t1" data-path="src/pages/CartPage.tsx">
                  <Link to="/products" data-id="ymc497ivc" data-path="src/pages/CartPage.tsx">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}