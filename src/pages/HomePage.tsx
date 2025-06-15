import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from '../components/ProductCard';
import { mockProducts, categories, fetchProducts } from '../data/products';
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  ArrowRight,
  Star,
  Smartphone,
  Shirt,
  Home,
  Watch,
  Camera,
  Headphones as HeadphonesIcon } from
'lucide-react';

const HomePage: React.FC = () => {
console.log('HomePage component rendered');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState(mockProducts().slice(0, 6));
  const [topRatedProducts, setTopRatedProducts] = useState(mockProducts().slice(0, 6));

  useEffect(() => {
    // Load real products
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setFeaturedProducts(products.slice(0, 6));
        setTopRatedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error loading products:', error);
        // Keep fallback products
      }
    };
    loadProducts();
  }, []);

  const banners = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off Pickles',
    description: 'Limited time offer on premium Products',
    image: 'https://www.amaravathipickles.com/wp-content/uploads/2019/01/chicken-pickle-in-hyderabad.png',
    cta: ' Pickles Shop ',
    link: '/products?category=Electronics'
  },
  {
    id: 2,
    title: 'New Collection',
    subtitle: 'Nati Styles Pickles',
    description: 'Discover the latest trends in Pickles ',
    image: 'https://5.imimg.com/data5/SELLER/Default/2022/3/QY/IR/AM/33290846/south-indian-chicken-pickle-1000x1000.jpg',
    cta: ' Pickles Shop ',
    link: '/products?category=Fashion'
  },
  {
    id: 3,
    title: 'Smart Home',
    subtitle: 'Transform Your Living Space',
    description: 'Innovative solutions for modern homes',
    image: 'https://m.media-amazon.com/images/I/717cb77+qUL.jpg',
    cta: 'Shop Home & Kitchen',
    link: '/products?category=Home%20%26%20Kitchen'
  }];

  // Auto scroll functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) =>
        prevSlide === banners.length - 1 ? 0 : prevSlide + 1
        );
      }, 2500); // Change slide every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, banners.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    // Reset auto play timer when user manually changes slide
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) =>
        prevSlide === banners.length - 1 ? 0 : prevSlide + 1
        );
      }, 4000);
    }
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };


  const categoryCards = [
  {
    name: 'Spicy Chicken Pickles',
    icon: <Smartphone className="w-8 h-8" data-id="5iumcb13g" data-path="src/pages/HomePage.tsx" />,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwl1esg_izTyAaUnvffQsbU1OyDAKATsdQQ&sp',
    description: 'Latest gadgets and tech'
  },
  {
    name: 'Mutton Pickle',
    icon: <Shirt className="w-8 h-8" data-id="n344rr9lu" data-path="src/pages/HomePage.tsx" />,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf1cath5TicXh0LxvsFom6LI05oD3digYWiw&s',
    description: 'Trendy clothing and accessories'
  },
  {
    name: 'Boneless-Chicken-Pickles',
    icon: <Home className="w-8 h-8" data-id="0h1f7gn8o" data-path="src/pages/HomePage.tsx" />,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFUFhvtuwCWtbZfPeXQsjkWUiagI7c7pa2ug&s',
    description: 'Everything for your home'
  },
  {
    name: 'Non Veg Pickles  ',
    icon: <Watch className="w-8 h-8" data-id="8vnuku1bo" data-path="src/pages/HomePage.tsx" />,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR1n1sqCpsDLlMOG1CVnvKjP2ujiBYOtANeA&s',
    description: 'Complete your style'
  }];


  const features = [
  {
    icon: <Truck className='w-8 h-8 text-blue-500' data-id="7k7vpu6cz" data-path="src/pages/HomePage.tsx" />,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $99'
  },
  {
    icon: <Shield className='w-8 h-8 text-green-500' data-id="0v03bsf5f" data-path="src/pages/HomePage.tsx" />,
    title: 'Secure Payment',
    description: '100% secure payment processing'
  },
  {
    icon: <Headphones className='w-8 h-8 text-purple-500' data-id="wo4ncpau4" data-path="src/pages/HomePage.tsx" />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support'
  },
  {
    icon: <ShoppingBag className='w-8 h-8 text-orange-500' data-id="vw04a1ckf" data-path="src/pages/HomePage.tsx" />,
    title: 'Easy Returns',
    description: '30-day hassle-free returns'
  }];


  return (
    <div className='min-h-screen bg-gray-50' data-id="aahoermjo" data-path="src/pages/HomePage.tsx">
      {/* Banner Carousel */}
      <section className='relative' data-id="19qhs3w0d" data-path="src/pages/HomePage.tsx">
        <div
          className='w-full relative'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} data-id="oxfxlt9hf" data-path="src/pages/HomePage.tsx">

          <div className='relative h-96 md:h-[500px] overflow-hidden' data-id="s9zahz34z" data-path="src/pages/HomePage.tsx">
            <div
              className='flex transition-transform duration-500 ease-in-out h-full'
              style={{ transform: `translateX(-${currentSlide * 100}%)` }} data-id="k6e46ioqu" data-path="src/pages/HomePage.tsx">

              {banners.map((banner) =>
              <div key={banner.id} className='w-full h-full flex-shrink-0 relative' data-id="mhw6m52s8" data-path="src/pages/HomePage.tsx">
                  <img
                  src={banner.image}
                  alt={banner.title}
                  className='w-full h-full object-cover' data-id="mtys8bik9" data-path="src/pages/HomePage.tsx" />

                  <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center' data-id="d7a1syc6f" data-path="src/pages/HomePage.tsx">
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white' data-id="huuxsbq02" data-path="src/pages/HomePage.tsx">
                      <div className='max-w-2xl' data-id="fw8q4koc0" data-path="src/pages/HomePage.tsx">
                        <h1 className='text-4xl md:text-6xl font-bold mb-4' data-id="e7df66kba" data-path="src/pages/HomePage.tsx">
                          {banner.title}
                        </h1>
                        <h2 className='text-2xl md:text-3xl mb-4 text-blue-200' data-id="fp6y97186" data-path="src/pages/HomePage.tsx">
                          {banner.subtitle}
                        </h2>
                        <p className='text-lg md:text-xl mb-8 text-gray-200' data-id="wfm3io76w" data-path="src/pages/HomePage.tsx">
                          {banner.description}
                        </p>
                        <Button size='lg' asChild className='bg-blue-600 hover:bg-blue-700' data-id="j26u18riw" data-path="src/pages/HomePage.tsx">
                          <Link to={banner.link} data-id="sarmbv3gs" data-path="src/pages/HomePage.tsx">
                            {banner.cta}
                            <ArrowRight className='ml-2 w-5 h-5' data-id="vwz800hjo" data-path="src/pages/HomePage.tsx" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={() => handleSlideChange(currentSlide === 0 ? banners.length - 1 : currentSlide - 1)}
              className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200 z-10' data-id="idssi51kj" data-path="src/pages/HomePage.tsx">

              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' data-id="d3dmvit14" data-path="src/pages/HomePage.tsx">
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' data-id="7vn2dx4ly" data-path="src/pages/HomePage.tsx" />
              </svg>
            </button>
            <button
              onClick={() => handleSlideChange(currentSlide === banners.length - 1 ? 0 : currentSlide + 1)}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200 z-10' data-id="ehudlftnw" data-path="src/pages/HomePage.tsx">

              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' data-id="tlw5k1sqz" data-path="src/pages/HomePage.tsx">
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' data-id="aqh2ijyhr" data-path="src/pages/HomePage.tsx" />
              </svg>
            </button>
            
            {/* Slide indicators */}
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2' data-id="qzs8wstop" data-path="src/pages/HomePage.tsx">
              {banners.map((_, index) =>
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ?
                'bg-white' :
                'bg-white/50 hover:bg-white/75'}`
                } data-id="2qjn80m0t" data-path="src/pages/HomePage.tsx" />

              )}
            </div>
            
            {/* Auto-play indicator */}
            <div className='absolute top-4 right-4 z-10' data-id="d1m88o71a" data-path="src/pages/HomePage.tsx">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className='bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200'
                title={isAutoPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'} data-id="yw6fj9xc4" data-path="src/pages/HomePage.tsx">

                {isAutoPlaying ?
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24' data-id="of1vqqso2" data-path="src/pages/HomePage.tsx">
                    <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' data-id="7h90na1b4" data-path="src/pages/HomePage.tsx" />
                  </svg> :

                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24' data-id="wk9d0wfol" data-path="src/pages/HomePage.tsx">
                    <path d='M8 5v14l11-7z' data-id="iatqhjvnr" data-path="src/pages/HomePage.tsx" />
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-16 bg-white' data-id="zmejugmg3" data-path="src/pages/HomePage.tsx">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' data-id="c7jbikele" data-path="src/pages/HomePage.tsx">
          <div className='text-center mb-12' data-id="zwivdvrc6" data-path="src/pages/HomePage.tsx">
            <h2 className='text-3xl font-bold text-gray-900 mb-4' data-id="smmze1jaq" data-path="src/pages/HomePage.tsx">
              Shop by Category
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto' data-id="gjlqv1qkg" data-path="src/pages/HomePage.tsx">
              Explore our carefully curated categories to find exactly what you're looking for.
            </p>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' data-id="aeeoocg9r" data-path="src/pages/HomePage.tsx">
            {categoryCards.map((category) =>
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className='group' data-id="2da7wa2fx" data-path="src/pages/HomePage.tsx">

                <Card className='h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden' data-id="kmaz7gky3" data-path="src/pages/HomePage.tsx">
                  <div className='relative h-48 overflow-hidden' data-id="7wzyqiolt" data-path="src/pages/HomePage.tsx">
                    <img
                    src={category.image}
                    alt={category.name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' data-id="4qlgh28nn" data-path="src/pages/HomePage.tsx" />

                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' data-id="ychbzhnbv" data-path="src/pages/HomePage.tsx" />
                    <div className='absolute bottom-4 left-4 text-white' data-id="qjb0vp3ee" data-path="src/pages/HomePage.tsx">
                      {category.icon}
                    </div>
                  </div>
                  <CardContent className='p-6' data-id="dqpvz6f5p" data-path="src/pages/HomePage.tsx">
                    <h3 className='text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors' data-id="12asydvxp" data-path="src/pages/HomePage.tsx">
                      {category.name}
                    </h3>
                    <p className='text-gray-600 text-sm' data-id="4hzs33spv" data-path="src/pages/HomePage.tsx">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-gray-50' data-id="n1nyaibyb" data-path="src/pages/HomePage.tsx">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' data-id="so5d7r42g" data-path="src/pages/HomePage.tsx">
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' data-id="nysuxlwbx" data-path="src/pages/HomePage.tsx">
            {features.map((feature, index) =>
            <div key={index} className='text-center' data-id="rzgccr20w" data-path="src/pages/HomePage.tsx">
                <div className='flex justify-center mb-4' data-id="iidx29euc" data-path="src/pages/HomePage.tsx">
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2' data-id="uxndz7akr" data-path="src/pages/HomePage.tsx">
                  {feature.title}
                </h3>
                <p className='text-gray-600' data-id="uus9621zj" data-path="src/pages/HomePage.tsx">
                  {feature.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-16 bg-white' data-id="1ppgepxbs" data-path="src/pages/HomePage.tsx">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' data-id="3t52meljr" data-path="src/pages/HomePage.tsx">
          <div className='text-center mb-12' data-id="ydbw7vaif" data-path="src/pages/HomePage.tsx">
            <h2 className='text-3xl font-bold text-gray-900 mb-4' data-id="umlejbawx" data-path="src/pages/HomePage.tsx">
              Featured Products
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto' data-id="di2jd3ckv" data-path="src/pages/HomePage.tsx">
              Discover our handpicked selection of premium products at amazing prices.
            </p>
          </div>
          
          <Carousel className='w-full'>
            <CarouselContent className='-ml-1'>
              {featuredProducts.map((product) =>
              <CarouselItem key={product.id} className='pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'>
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
          
          <div className='text-center mt-8' data-id="2nnwh15uz" data-path="src/pages/HomePage.tsx">
            <Button size='lg' asChild data-id="l2qti5frd" data-path="src/pages/HomePage.tsx">
              <Link to='/products' data-id="vm2imor7s" data-path="src/pages/HomePage.tsx">
                View All Products
                <ArrowRight className='ml-2 w-5 h-5' data-id="10tn45a7t" data-path="src/pages/HomePage.tsx" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      <section className='py-16 bg-gray-50' data-id="g0dyu8t7i" data-path="src/pages/HomePage.tsx">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' data-id="rgjhbjnse" data-path="src/pages/HomePage.tsx">
          <div className='text-center mb-12' data-id="k9o4lug6j" data-path="src/pages/HomePage.tsx">
            <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center' data-id="1zzpwm6fg" data-path="src/pages/HomePage.tsx">
              <Star className='w-8 h-8 text-yellow-400 mr-3 fill-current' data-id="5erc89czo" data-path="src/pages/HomePage.tsx" />
              Top Rated Products
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto' data-id="v0svgaifs" data-path="src/pages/HomePage.tsx">
              See what our customers love most - products with the highest ratings and reviews.
            </p>
          </div>
          
          <Carousel className='w-full'>
            <CarouselContent className='-ml-1'>
              {topRatedProducts.map((product) =>
              <CarouselItem key={product.id} className='pl-1 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'>
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
          
          <div className='text-center mt-8' data-id="2nnwh15uz" data-path="src/pages/HomePage.tsx">
            <Button size='lg' asChild data-id="l2qti5frd" data-path="src/pages/HomePage.tsx">
              <Link to='/products' data-id="vm2imor7s" data-path="src/pages/HomePage.tsx">
                View All Products
                <ArrowRight className='ml-2 w-5 h-5' data-id="10tn45a7t" data-path="src/pages/HomePage.tsx" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white' data-id="ci83um3hh" data-path="src/pages/HomePage.tsx">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center' data-id="n2gfve82b" data-path="src/pages/HomePage.tsx">
          <h2 className='text-3xl font-bold mb-4' data-id="4f41ygj1r" data-path="src/pages/HomePage.tsx">
            Stay Updated with Our Latest Offers
          </h2>
          <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto' data-id="k4jsqi5m7" data-path="src/pages/HomePage.tsx">
            Subscribe to our newsletter and never miss out on exclusive deals and new product launches.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto' data-id="16bqdypam" data-path="src/pages/HomePage.tsx">
            <input
              type="email"
              placeholder="Enter your email"
              className='flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white' data-id="9xqth6sq7" data-path="src/pages/HomePage.tsx" />

            <Button className='bg-white text-blue-600 hover:bg-gray-100 px-8' data-id="vqopfmctb" data-path="src/pages/HomePage.tsx">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white' data-id="foajlkzoi" data-path="src/pages/HomePage.tsx">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center' data-id="e3fs4cd0l" data-path="src/pages/HomePage.tsx">
          <h2 className='text-3xl font-bold mb-4' data-id="y9tnicibv" data-path="src/pages/HomePage.tsx">
            Ready to Start Shopping?
          </h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto' data-id="3bqrj676p" data-path="src/pages/HomePage.tsx">
            Join thousands of satisfied customers and discover why we are the preferred choice for online shopping.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center' data-id="mqgz1ckw6" data-path="src/pages/HomePage.tsx">
            <Button size='lg' asChild className='bg-blue-600 hover:bg-blue-700' data-id="94inzx3lq" data-path="src/pages/HomePage.tsx">
              <Link to='/auth' data-id="46ti1yi3t" data-path="src/pages/HomePage.tsx">
                Create Account
                <ArrowRight className='ml-2 w-5 h-5' data-id="sbz7nacab" data-path="src/pages/HomePage.tsx" />
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild className='border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900' data-id="alvoxhlgy" data-path="src/pages/HomePage.tsx">
              <Link to='/products' data-id="tr7bgzov8" data-path="src/pages/HomePage.tsx">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>);

};

export default HomePage;