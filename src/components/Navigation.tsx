import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  Package,
  Heart } from
'lucide-react';
import NotificationCenter from './NotificationCenter';

const Navigation: React.FC = () => {
  const { user, logout, isAdmin, userProfile } = useAuth();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    return user?.Name || user?.Email || 'User';
  };

  const getAuthMethod = () => {
    if (userProfile?.auth_method === 'phone') {
      return `📱 ${userProfile.phone_number}`;
    }
    return `📧 ${user?.Email}`;
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50" data-id="8eunq3xml" data-path="src/components/Navigation.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="xd0d8s3eu" data-path="src/components/Navigation.tsx">
        <div className="flex justify-between items-center h-16" data-id="l45fzgvf5" data-path="src/components/Navigation.tsx">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-id="rhxer063i" data-path="src/components/Navigation.tsx">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center" data-id="nm0wam4gt" data-path="src/components/Navigation.tsx">
              <span className="text-white font-bold text-sm" data-id="r5k7ux1yy" data-path="src/components/Navigation.tsx">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900" data-id="ya4a29vsw" data-path="src/components/Navigation.tsx">MANAfoods</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8" data-id="k6zb72l06" data-path="src/components/Navigation.tsx">
            <div className="relative w-full" data-id="u62j2mwft" data-path="src/components/Navigation.tsx">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4" data-id="av5h69l8v" data-path="src/components/Navigation.tsx" />

              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="l1j5bezih" data-path="src/components/Navigation.tsx" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6" data-id="1ueun6z62" data-path="src/components/Navigation.tsx">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium" data-id="home-desktop-link" data-path="src/components/Navigation.tsx">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900 font-medium" data-id="z3ommzyv2" data-path="src/components/Navigation.tsx">
              Products
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900 font-medium" data-id="efuh6slcb" data-path="src/components/Navigation.tsx">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium" data-id="55610edyv" data-path="src/components/Navigation.tsx">
              Contact
            </Link>
            
            {user &&
            <>
                <NotificationCenter data-id="ija8xuv4b" data-path="src/components/Navigation.tsx" />
                
                {/* Wishlist */}
                <Link to="/wishlist" className="relative" data-id="aoviyu3z3" data-path="src/components/Navigation.tsx">
                  <Button variant="ghost" size="sm" className="relative" data-id="stygtaz28" data-path="src/components/Navigation.tsx">
                    <Heart className="w-5 h-5" data-id="xckwt2pg3" data-path="src/components/Navigation.tsx" />
                    {wishlistItems.length > 0 &&
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs" data-id="7a0g08bo8" data-path="src/components/Navigation.tsx">

                        {wishlistItems.length}
                      </Badge>
                  }
                  </Button>
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative" data-id="3pvz9fh2l" data-path="src/components/Navigation.tsx">
                  <Button variant="ghost" size="sm" className="relative" data-id="zf1e4hj6h" data-path="src/components/Navigation.tsx">
                    <ShoppingCart className="w-5 h-5" data-id="3bufknbci" data-path="src/components/Navigation.tsx" />
                    {totalItems > 0 &&
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs" data-id="p4fux4yhs" data-path="src/components/Navigation.tsx">

                        {totalItems}
                      </Badge>
                  }
                  </Button>
                </Link>
              </>
            }

            {/* User Menu */}
            {user ?
            <DropdownMenu data-id="7wc2qs684" data-path="src/components/Navigation.tsx">
                <DropdownMenuTrigger asChild data-id="z7e0v87ym" data-path="src/components/Navigation.tsx">
                  <Button variant="ghost" size="sm" data-id="xfv1k1wry" data-path="src/components/Navigation.tsx">
                    <User className="w-5 h-5 mr-1" data-id="nnwisueyn" data-path="src/components/Navigation.tsx" />
                    {getUserDisplayName()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64" data-id="gfin2rprm" data-path="src/components/Navigation.tsx">
                  <DropdownMenuLabel data-id="mqd8j1qf3" data-path="src/components/Navigation.tsx">
                    <div className="flex flex-col space-y-1" data-id="xmx8optar" data-path="src/components/Navigation.tsx">
                      <span data-id="7vq5f905i" data-path="src/components/Navigation.tsx">Welcome, {getUserDisplayName()}!</span>
                      <span className="text-xs text-gray-500 font-normal" data-id="kaqal2dbl" data-path="src/components/Navigation.tsx">
                        {getAuthMethod()}
                      </span>
                    </div>
                    {isAdmin &&
                  <Badge variant="secondary" className="mt-1 text-xs" data-id="x2t8wahel" data-path="src/components/Navigation.tsx">
                        Admin
                      </Badge>
                  }
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator data-id="jgwniv7yi" data-path="src/components/Navigation.tsx" />
                  <DropdownMenuItem asChild data-id="zhk1kak56" data-path="src/components/Navigation.tsx">
                    <Link to="/profile" className="cursor-pointer" data-id="dvnerorcl" data-path="src/components/Navigation.tsx">
                      <User className="w-4 h-4 mr-2" data-id="i2g807tab" data-path="src/components/Navigation.tsx" />
                      Profile & Preferences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-id="cj2fvvfc2" data-path="src/components/Navigation.tsx">
                    <Link to="/orders" className="cursor-pointer" data-id="g5r0w8llc" data-path="src/components/Navigation.tsx">
                      <Package className="w-4 h-4 mr-2" data-id="kxx1rtfaf" data-path="src/components/Navigation.tsx" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-id="fc516qgtl" data-path="src/components/Navigation.tsx">
                    <Link to="/wishlist" className="cursor-pointer" data-id="lpl9r1ses" data-path="src/components/Navigation.tsx">
                      <Heart className="w-4 h-4 mr-2" data-id="ql1x7klhd" data-path="src/components/Navigation.tsx" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin &&
                <>
                    <DropdownMenuSeparator data-id="0yliecif8" data-path="src/components/Navigation.tsx" />
                    <DropdownMenuItem asChild data-id="p80020p42" data-path="src/components/Navigation.tsx">
                      <Link to="/admin" className="cursor-pointer" data-id="1fhdsxlfp" data-path="src/components/Navigation.tsx">
                        <Settings className="w-4 h-4 mr-2" data-id="n09tj40yp" data-path="src/components/Navigation.tsx" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                }
                  <DropdownMenuSeparator data-id="3ew367wzc" data-path="src/components/Navigation.tsx" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-id="f5dlr99v7" data-path="src/components/Navigation.tsx">
                    <LogOut className="w-4 h-4 mr-2" data-id="ccejcarv6" data-path="src/components/Navigation.tsx" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> :

            <div className="flex space-x-2" data-id="f8hxpqs9p" data-path="src/components/Navigation.tsx">
                <Button variant="ghost" size="sm" asChild data-id="picpw7o8b" data-path="src/components/Navigation.tsx">
                  <Link to="/auth" data-id="lkfxec4s4" data-path="src/components/Navigation.tsx">Login</Link>
                </Button>
                <Button size="sm" asChild data-id="boua96cdl" data-path="src/components/Navigation.tsx">
                  <Link to="/auth" data-id="ui0xfhavq" data-path="src/components/Navigation.tsx">Sign Up</Link>
                </Button>
              </div>
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2" data-id="54dxv08qr" data-path="src/components/Navigation.tsx">
            {user && <NotificationCenter data-id="5cz48y3yf" data-path="src/components/Navigation.tsx" />}
            <Link to="/wishlist" className="relative" data-id="0yg1r5bs7" data-path="src/components/Navigation.tsx">
              <Button variant="ghost" size="sm" className="relative" data-id="a3eeh0nx3" data-path="src/components/Navigation.tsx">
                <Heart className="w-5 h-5" data-id="jytzp5rc1" data-path="src/components/Navigation.tsx" />
                {wishlistItems.length > 0 &&
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs" data-id="9ujey6v9p" data-path="src/components/Navigation.tsx">

                    {wishlistItems.length}
                  </Badge>
                }
              </Button>
            </Link>
            <Link to="/cart" className="relative" data-id="k5trey1hm" data-path="src/components/Navigation.tsx">
              <Button variant="ghost" size="sm" className="relative" data-id="mve4uzih7" data-path="src/components/Navigation.tsx">
                <ShoppingCart className="w-5 h-5" data-id="ur1akuim0" data-path="src/components/Navigation.tsx" />
                {totalItems > 0 &&
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs" data-id="hlbw5sldl" data-path="src/components/Navigation.tsx">

                    {totalItems}
                  </Badge>
                }
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-id="m331udmob" data-path="src/components/Navigation.tsx">

              {isMobileMenuOpen ? <X className="w-5 h-5" data-id="dbp954jlp" data-path="src/components/Navigation.tsx" /> : <Menu className="w-5 h-5" data-id="u1fodrkio" data-path="src/components/Navigation.tsx" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen &&
        <div className="md:hidden border-t bg-white" data-id="keao5ulz2" data-path="src/components/Navigation.tsx">
            <div className="px-2 pt-2 pb-3 space-y-1" data-id="r7v0e88kp" data-path="src/components/Navigation.tsx">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4" data-id="4dzhztku8" data-path="src/components/Navigation.tsx">
                <div className="relative" data-id="cp5jqlsam" data-path="src/components/Navigation.tsx">
                  <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4" data-id="ea47q3yao" data-path="src/components/Navigation.tsx" />

                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="8e3teex4l" data-path="src/components/Navigation.tsx" />
                </div>
              </form>

              <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)} data-id="home-mobile-link" data-path="src/components/Navigation.tsx">
                Home
              </Link>
              <Link
              to="/products"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)} data-id="494qabfmj" data-path="src/components/Navigation.tsx">

                Products
              </Link>
              
              <Link
              to="/blog"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)} data-id="vllm0lnq8" data-path="src/components/Navigation.tsx">

                Blog
              </Link>
              
              <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)} data-id="w3poykqog" data-path="src/components/Navigation.tsx">

                Contact
              </Link>

              {user ?
            <>
                  <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)} data-id="ejulsyi8a" data-path="src/components/Navigation.tsx">

                    Profile & Preferences
                  </Link>
                  <Link
                to="/orders"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)} data-id="wesnm8wfu" data-path="src/components/Navigation.tsx">

                    Orders
                  </Link>
                  <Link
                to="/wishlist"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)} data-id="u6rjf95ni" data-path="src/components/Navigation.tsx">

                    Wishlist
                  </Link>
                  {isAdmin &&
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)} data-id="64c73hism" data-path="src/components/Navigation.tsx">

                      Admin Panel
                    </Link>
              }
                  <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900" data-id="e88qh7zn3" data-path="src/components/Navigation.tsx">

                    Logout
                  </button>
                </> :

            <div className="flex space-x-2 px-3 py-2" data-id="1en8vtm1h" data-path="src/components/Navigation.tsx">
                  <Button variant="ghost" size="sm" asChild className="flex-1" data-id="trcqz50dc" data-path="src/components/Navigation.tsx">
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} data-id="25md11kpl" data-path="src/components/Navigation.tsx">
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1" data-id="yb9rgo0dh" data-path="src/components/Navigation.tsx">
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} data-id="og40y9wwb" data-path="src/components/Navigation.tsx">
                      Sign Up
                    </Link>
                  </Button>
                </div>
            }
            </div>
          </div>
        }
      </div>
    </nav>);

};

export default Navigation;
