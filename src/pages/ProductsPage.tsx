import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductCard from '../components/ProductCard';
import ProductSearch from '../components/ProductSearch';
import { mockProducts, fetchProducts } from '../data/products';
import { Search, Grid, List } from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
  inStock: boolean;
}

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allProducts, setAllProducts] = useState(mockProducts());
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    priceRange: [0, 2000],
    minRating: 0,
    sortBy: 'name',
    inStock: false
  });

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesSearch = !searchFilters.query ||
      product.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      product.description.toLowerCase().includes(searchFilters.query.toLowerCase());

      const matchesCategory = searchFilters.category === 'All' || product.category === searchFilters.category;

      const matchesPrice = product.price >= searchFilters.priceRange[0] &&
      product.price <= searchFilters.priceRange[1];

      const matchesRating = (product.rating || 0) >= searchFilters.minRating;

      const matchesStock = !searchFilters.inStock || (product.stock_quantity || 0) > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [allProducts, searchFilters]);

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);

    // Update URL parameters
    const params = new URLSearchParams();
    if (filters.query) params.set('search', filters.query);
    if (filters.category !== 'All') params.set('category', filters.category);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50" data-id="0rv31v6k8" data-path="src/pages/ProductsPage.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-id="datdt0hbv" data-path="src/pages/ProductsPage.tsx">
        {/* Header */}
        <div className="mb-8" data-id="amekzh093" data-path="src/pages/ProductsPage.tsx">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-id="jwmnmx4fu" data-path="src/pages/ProductsPage.tsx">Products</h1>
          <p className="text-lg text-gray-600" data-id="bazs8cwxj" data-path="src/pages/ProductsPage.tsx">
            Discover our complete collection of amazing products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8" data-id="mu5xvql2t" data-path="src/pages/ProductsPage.tsx">
          <ProductSearch
            onFiltersChange={handleFiltersChange}
            totalResults={filteredAndSortedProducts.length} data-id="vfw8rcgyv" data-path="src/pages/ProductsPage.tsx" />

        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6" data-id="6ibpsa46v" data-path="src/pages/ProductsPage.tsx">
          <div className="flex items-center space-x-4" data-id="g6qwpxzst" data-path="src/pages/ProductsPage.tsx">
            <p className="text-gray-600" data-id="qfnon8p8r" data-path="src/pages/ProductsPage.tsx">
              Showing {filteredAndSortedProducts.length} of {allProducts.length} products
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex space-x-2" data-id="oiomivvkq" data-path="src/pages/ProductsPage.tsx">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')} data-id="frdsftfjp" data-path="src/pages/ProductsPage.tsx">

              <Grid className="w-4 h-4" data-id="v7zzkywc6" data-path="src/pages/ProductsPage.tsx" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')} data-id="et5lomyys" data-path="src/pages/ProductsPage.tsx">

              <List className="w-4 h-4" data-id="2m34uxlrl" data-path="src/pages/ProductsPage.tsx" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ?
        <div className="flex justify-center items-center py-12" data-id="lo9v4i7tq" data-path="src/pages/ProductsPage.tsx">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" data-id="nw09bmku4" data-path="src/pages/ProductsPage.tsx"></div>
          </div> :

        /* Products Grid */
        filteredAndSortedProducts.length > 0 ?
        <div className={`grid gap-4 sm:gap-6 ${
        viewMode === 'grid' ?
        'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
        'grid-cols-1'}`}>
            {filteredAndSortedProducts.map((product) =>
              <div key={product.id} className="h-full">
                <ProductCard key={product.id} product={product} />
              </div>
            )}
        </div> :

        <Card className="p-12 text-center" data-id="g5w69z3ac" data-path="src/pages/ProductsPage.tsx">
            <div className="text-gray-500" data-id="suy1pfc4n" data-path="src/pages/ProductsPage.tsx">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" data-id="gbprn1kvz" data-path="src/pages/ProductsPage.tsx" />
              <h3 className="text-lg font-medium mb-2" data-id="d0wtsufq9" data-path="src/pages/ProductsPage.tsx">No products found</h3>
              <p className="text-sm" data-id="5nrk90skr" data-path="src/pages/ProductsPage.tsx">
                Try adjusting your search criteria to see more products.
              </p>
            </div>
          </Card>
        }
      </div>
    </div>);

};

export default ProductsPage;