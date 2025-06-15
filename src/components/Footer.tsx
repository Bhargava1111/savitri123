import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  Shield,
  Truck } from
'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white" data-id="gf30pqb30" data-path="src/components/Footer.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-id="013mhmv20" data-path="src/components/Footer.tsx">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-id="qwmktubgg" data-path="src/components/Footer.tsx">
          {/* Company Info */}
          <div className="space-y-4" data-id="a43merv8d" data-path="src/components/Footer.tsx">
            <div className="flex items-center" data-id="ogu9m71ha" data-path="src/components/Footer.tsx">
              <ShoppingBag className="w-8 h-8 text-blue-500" data-id="0ppldadwj" data-path="src/components/Footer.tsx" />
              <span className="ml-2 text-xl font-bold" data-id="zpigc4dem" data-path="src/components/Footer.tsx">MANAfoods</span>
            </div>
            <p className="text-gray-300 text-sm" data-id="deix1vo72" data-path="src/components/Footer.tsx">
              Your trusted partner for online shopping. We offer high-quality products 
              with fast delivery and excellent customer service.
            </p>
            <div className="flex space-x-4" data-id="9h7oqkeb1" data-path="src/components/Footer.tsx">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-id="1s1a0k15e" data-path="src/components/Footer.tsx">
                <Facebook className="w-5 h-5" data-id="ujaidtvgk" data-path="src/components/Footer.tsx" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-id="a9mupgs23" data-path="src/components/Footer.tsx">
                <Twitter className="w-5 h-5" data-id="i4nljm8gr" data-path="src/components/Footer.tsx" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-id="loitdld0s" data-path="src/components/Footer.tsx">
                <Instagram className="w-5 h-5" data-id="3lf7zes7c" data-path="src/components/Footer.tsx" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4" data-id="iyn81nk00" data-path="src/components/Footer.tsx">
            <h3 className="text-lg font-semibold" data-id="j51mm5bzw" data-path="src/components/Footer.tsx">Quick Links</h3>
            <ul className="space-y-2 text-sm" data-id="zv3x1ey9y" data-path="src/components/Footer.tsx">
              <li data-id="63daxiakr" data-path="src/components/Footer.tsx">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors" data-id="9xclgo9qe" data-path="src/components/Footer.tsx">
                  Home
                </Link>
              </li>
              <li data-id="rzsig9co6" data-path="src/components/Footer.tsx">
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors" data-id="edmwmhlc1" data-path="src/components/Footer.tsx">
                  Products
                </Link>
              </li>
              <li data-id="vruc1d5bl" data-path="src/components/Footer.tsx">
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors" data-id="mchudgg0t" data-path="src/components/Footer.tsx">
                  Blog
                </Link>
              </li>
              <li data-id="dladtxs3y" data-path="src/components/Footer.tsx">
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors" data-id="cyo7viurw" data-path="src/components/Footer.tsx">
                  Contact
                </Link>
              </li>
              <li data-id="jv9d1z27v" data-path="src/components/Footer.tsx">
                <Link to="/auth" className="text-gray-300 hover:text-white transition-colors" data-id="deph3jrr8" data-path="src/components/Footer.tsx">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4" data-id="o2m91zafn" data-path="src/components/Footer.tsx">
            <h3 className="text-lg font-semibold" data-id="1zu2lko43" data-path="src/components/Footer.tsx">Customer Service</h3>
            <ul className="space-y-2 text-sm" data-id="06im964e0" data-path="src/components/Footer.tsx">
              <li data-id="069dd16jo" data-path="src/components/Footer.tsx">
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors" data-id="n88m30om5" data-path="src/components/Footer.tsx">
                  Track Orders
                </Link>
              </li>
              <li data-id="lgrbt7jdd" data-path="src/components/Footer.tsx">
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-id="q304veiz6" data-path="src/components/Footer.tsx">
                  Returns & Exchanges
                </a>
              </li>
              <li data-id="0ax5si7tx" data-path="src/components/Footer.tsx">
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-id="m4rl333cd" data-path="src/components/Footer.tsx">
                  Shipping Info
                </a>
              </li>
              <li data-id="0zw3drx4q" data-path="src/components/Footer.tsx">
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-id="113ok0unq" data-path="src/components/Footer.tsx">
                  Size Guide
                </a>
              </li>
              <li data-id="atea92wu1" data-path="src/components/Footer.tsx">
                <a href="#" className="text-gray-300 hover:text-white transition-colors" data-id="uie29hy6g" data-path="src/components/Footer.tsx">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4" data-id="pz5zslfm0" data-path="src/components/Footer.tsx">
            <h3 className="text-lg font-semibold" data-id="shmkpzd52" data-path="src/components/Footer.tsx">Contact Info</h3>
            <div className="space-y-3 text-sm" data-id="b65xpc41a" data-path="src/components/Footer.tsx">
              <div className="flex items-center" data-id="kywqa9x1x" data-path="src/components/Footer.tsx">
                <Phone className="w-4 h-4 text-blue-500 mr-2" data-id="avahvol6r" data-path="src/components/Footer.tsx" />
                <span className="text-gray-300" data-id="vkqkg2uhy" data-path="src/components/Footer.tsx">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center" data-id="avsuhdfh8" data-path="src/components/Footer.tsx">
                <Mail className="w-4 h-4 text-blue-500 mr-2" data-id="0tdc29k8d" data-path="src/components/Footer.tsx" />
                <span className="text-gray-300" data-id="nsapg7sjg" data-path="src/components/Footer.tsx">support@manafoods.com</span>
              </div>
              <div className="flex items-start" data-id="g0lfec6uz" data-path="src/components/Footer.tsx">
                <MapPin className="w-4 h-4 text-blue-500 mr-2 mt-0.5" data-id="2idmnz8io" data-path="src/components/Footer.tsx" />
                <span className="text-gray-300" data-id="fopsoa62e" data-path="src/components/Footer.tsx">
                  123 Commerce Street<br data-id="rt433oyhc" data-path="src/components/Footer.tsx" />
                  Business District, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-center py-2">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
              <span className="text-xs sm:text-sm text-gray-300">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2" />
              <span className="text-xs sm:text-sm text-gray-300">Privacy Protected</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mr-2" />
              <span className="text-xs sm:text-sm text-gray-300">Fast Delivery</span>
            </div>
            <div className="flex items-center justify-center py-2">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mr-2" />
              <span className="text-xs sm:text-sm text-gray-300">Quality Products</span>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-800 text-center md:text-left">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 MANAfoods. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;
