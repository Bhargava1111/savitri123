import { Product } from '../types';

const PRODUCTS_TABLE_ID = '10403';

export class ProductService {
  // Get all products with pagination and filtering
  static async getProducts(params: {
    pageNo?: number;
    pageSize?: number;
    category?: string;
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const {
        pageNo = 1,
        pageSize = 20,
        category,
        searchTerm,
        minPrice,
        maxPrice,
        sortBy = 'ID',
        sortOrder = 'desc'
      } = params;

      const filters: any[] = [
      {
        name: 'is_active',
        op: 'Equal',
        value: true
      }];


      // Add category filter
      if (category && category !== 'All') {
        filters.push({
          name: 'category',
          op: 'Equal',
          value: category
        });
      }

      // Add search filter
      if (searchTerm) {
        filters.push({
          name: 'name',
          op: 'StringContains',
          value: searchTerm
        });
      }

      // Add price range filters
      if (minPrice !== undefined) {
        filters.push({
          name: 'price',
          op: 'GreaterThanOrEqual',
          value: minPrice
        });
      }

      if (maxPrice !== undefined) {
        filters.push({
          name: 'price',
          op: 'LessThanOrEqual',
          value: maxPrice
        });
      }

      const { data, error } = await window.ezsite.apis.tablePage(PRODUCTS_TABLE_ID, {
        PageNo: pageNo,
        PageSize: pageSize,
        OrderByField: sortBy,
        IsAsc: sortOrder === 'asc',
        Filters: filters
      });

      if (error) {
        throw new Error(error);
      }

      return {
        products: data?.List || [],
        totalCount: data?.VirtualCount || 0,
        currentPage: pageNo,
        totalPages: Math.ceil((data?.VirtualCount || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get a single product by ID
  static async getProductById(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(PRODUCTS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        Filters: [
        {
          name: 'id',
          op: 'Equal',
          value: productId
        },
        {
          name: 'is_active',
          op: 'Equal',
          value: true
        }]

      });

      if (error) {
        throw new Error(error);
      }

      return data?.List?.[0] || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 8) {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(PRODUCTS_TABLE_ID, {
        PageNo: 1,
        PageSize: limit,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [
        {
          name: 'is_active',
          op: 'Equal',
          value: true
        }]

      });

      if (error) {
        throw new Error(error);
      }

      return data?.List || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string, limit: number = 12) {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(PRODUCTS_TABLE_ID, {
        PageNo: 1,
        PageSize: limit,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [
        {
          name: 'category',
          op: 'Equal',
          value: category
        },
        {
          name: 'is_active',
          op: 'Equal',
          value: true
        }]

      });

      if (error) {
        throw new Error(error);
      }

      return data?.List || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get available categories
  static async getCategories() {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(PRODUCTS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1000,
        Filters: [
        {
          name: 'is_active',
          op: 'Equal',
          value: true
        }]

      });

      if (error) {
        throw new Error(error);
      }

      // Extract unique categories
      const categories = [...new Set(data?.List?.map((product: any) => product.category) || [])];
      return categories.filter(Boolean);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Admin: Create new product
  static async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock_quantity: number;
    features?: string[];
  }) {
    try {
      const product = {
        ...productData,
        features: JSON.stringify(productData.features || []),
        is_active: true
      };

      const { error } = await window.ezsite.apis.tableCreate(PRODUCTS_TABLE_ID, product);

      if (error) {
        throw new Error(error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Admin: Update product
  static async updateProduct(productId: number, productData: Partial<{
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock_quantity: number;
    features: string[];
    is_active: boolean;
  }>) {
    try {
      const updateData: any = {
        id: productId,
        ...productData
      };

      if (productData.features) {
        updateData.features = JSON.stringify(productData.features);
      }

      const { error } = await window.ezsite.apis.tableUpdate(PRODUCTS_TABLE_ID, updateData);

      if (error) {
        throw new Error(error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Admin: Delete product (soft delete by setting is_active to false)
  static async deleteProduct(productId: number) {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(PRODUCTS_TABLE_ID, {
        id: productId,
        is_active: false
      });

      if (error) {
        throw new Error(error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Update stock quantity
  static async updateStock(productId: number, quantity: number) {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(PRODUCTS_TABLE_ID, {
        id: productId,
        stock_quantity: quantity
      });

      if (error) {
        throw new Error(error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Check if product is in stock
  static async checkStock(productId: string, requestedQuantity: number = 1): Promise<boolean> {
    try {
      const product = await this.getProductById(productId);
      return product ? product.stock_quantity >= requestedQuantity : false;
    } catch (error) {
      console.error('Error checking stock:', error);
      return false;
    }
  }
}
