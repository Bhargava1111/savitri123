import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, X, ImageIcon } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, ProductVariant } from '@/types/index';
import { ProductService } from '@/services/ProductService';
import { FileUploadService } from '@/services/FileUploadService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Form schema for product validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  stock_quantity: z.coerce.number().int().min(0, 'Stock quantity must be a positive number'),
  image_urls: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
  brand: z.string().min(1, 'Brand is required'),
  tags: z.array(z.string()).optional(),
  expiry_date: z.string().optional(), // ISO date string
  barcode: z.string().optional(),
  variants: z.array(z.object({
    weight: z.string().optional(),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    stock: z.coerce.number().int().min(0, 'Stock must be a positive number'),
    color: z.string().optional(),
    size: z.string().optional()
  })).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterStockMin, setFilterStockMin] = useState('');
  const [filterStockMax, setFilterStockMax] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Form for adding/editing products
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    watch
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock_quantity: 0,
      image_urls: [],
      features: [],
      is_active: true,
      brand: '',
      tags: [],
      expiry_date: '',
      barcode: '',
      variants: []
    }
  });

  // Features field array
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features' as any,
  });

  // Variants field array
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants' as const,
  });

  // Load products and categories
  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      const result = await ProductService.getProducts({
        pageNo: page,
        pageSize: 10,
        sortBy: 'ID',
        sortOrder: 'desc',
        searchTerm: searchTerm,
        category: filterCategory,
        minPrice: filterPriceMin ? Number(filterPriceMin) : undefined,
        maxPrice: filterPriceMax ? Number(filterPriceMax) : undefined,
      });
      
      setProducts(result.products);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await ProductService.getCategories();
      if (Array.isArray(result) && result.length > 0) {
        setCategories(result as string[]);
      } else {
        // Fallback static categories
        setCategories(['Pickles', 'Spices', 'Condiments', 'Traditional Foods', 'Organic', 'Premium']);
      }
    } catch (error) {
      // Fallback static categories on error
      setCategories(['Pickles', 'Spices', 'Condiments', 'Traditional Foods', 'Organic', 'Premium']);
      console.error('Error loading categories:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    const reload = () => loadCategories();
    window.addEventListener('categoriesUpdated', reload);
    return () => window.removeEventListener('categoriesUpdated', reload);
  }, []);

  // Handle multiple image uploads
  const handleImagesUpload = async (files: FileList) => {
    setUploadingImage(true);
    const urls: string[] = [];
    const previews: string[] = [];
    for (const file of Array.from(files)) {
      previews.push(URL.createObjectURL(file));
      const result = await FileUploadService.uploadImage(file);
      if (result.success && result.imageUrl) {
        urls.push(result.imageUrl);
      }
    }
    setImageFiles(Array.from(files));
    setImagePreviews(previews);
    setValue('image_urls', urls);
    setUploadingImage(false);
  };

  // Handle file input change (multiple)
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImagesUpload(files);
    }
  };

  // Open add product dialog
  const openAddDialog = async () => {
    await loadCategories(); // Ensure categories are loaded
    reset({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock_quantity: 0,
      image_urls: [],
      features: [],
      is_active: true,
      brand: '',
      tags: [],
      expiry_date: '',
      barcode: '',
      variants: []
    });
    setImagePreviews([]);
    setImageFiles([]);
    setIsAddDialogOpen(true);
  };

  // Open edit product dialog
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    let features = product.features || [];
    if (typeof features === 'string') {
      try { features = JSON.parse(features); } catch (e) { features = []; }
    }
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || '',
      stock_quantity: product.stock_quantity,
      image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
      features: features,
      is_active: product.is_active !== false,
      brand: product.brand || '',
      tags: product.tags || [],
      expiry_date: product.expiry_date || '',
      barcode: product.barcode || '',
      variants: product.variants || []
    });
    setImagePreviews(product.image_urls || (product.image_url ? [product.image_url] : []));
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Handle add product submission
  const onAddProduct = async (data: ProductFormValues) => {
    try {
      await ProductService.createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_urls && data.image_urls[0] ? data.image_urls[0] : '',
        category: data.category,
        stock_quantity: data.stock_quantity,
        features: data.features || [],
      });
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      setIsAddDialogOpen(false);
      loadProducts(currentPage);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive'
      });
    }
  };

  // Handle edit product submission
  const onEditProduct = async (data: ProductFormValues) => {
    if (!selectedProduct) return;
    try {
      await ProductService.updateProduct(Number(selectedProduct.id), {
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_urls && data.image_urls[0] ? data.image_urls[0] : '',
        category: data.category,
        stock_quantity: data.stock_quantity,
        features: data.features || [],
        is_active: data.is_active,
      });
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      setIsEditDialogOpen(false);
      loadProducts(currentPage);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
    }
  };

  // Handle delete product
  const onDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await ProductService.deleteProduct(Number(selectedProduct.id));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      loadProducts(currentPage);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  // Helper function to convert products to CSV
  function productsToCSV(products) {
    if (!products.length) return '';
    const headers = Object.keys(products[0]);
    const rows = products.map(prod => headers.map(h => JSON.stringify(prod[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl">Product Management</CardTitle>
            <CardDescription className="text-sm sm:text-base">Manage your store's products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-end mb-4 gap-2">
              <Button onClick={openAddDialog} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
            {/* Add advanced search/filter UI above the product table */}
            <div className="flex flex-col md:flex-wrap md:flex-row gap-2 md:gap-4 mb-4 items-end">
              <Input placeholder="Search by name or brand..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-48" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category, idx) => (
                    <SelectItem key={(typeof category === 'string' ? category : category.name) + '-' + idx} value={typeof category === 'string' ? category : category.name}>
                      {typeof category === 'string' ? category : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Brand" value={filterBrand} onChange={e => setFilterBrand(e.target.value)} className="w-full sm:w-32" />
              <Input placeholder="Min Price" type="number" value={filterPriceMin} onChange={e => setFilterPriceMin(e.target.value)} className="w-full sm:w-24" />
              <Input placeholder="Max Price" type="number" value={filterPriceMax} onChange={e => setFilterPriceMax(e.target.value)} className="w-full sm:w-24" />
              <Input placeholder="Min Stock" type="number" value={filterStockMin} onChange={e => setFilterStockMin(e.target.value)} className="w-full sm:w-24" />
              <Input placeholder="Max Stock" type="number" value={filterStockMax} onChange={e => setFilterStockMax(e.target.value)} className="w-full sm:w-24" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => loadProducts(1)} className="w-full sm:w-auto">Search</Button>
              <Button variant="outline" onClick={() => {
                setSearchTerm(''); setFilterCategory(''); setFilterBrand(''); setFilterStatus('all'); setFilterPriceMin(''); setFilterPriceMax(''); setFilterStockMin(''); setFilterStockMax(''); loadProducts(1);
              }} className="w-full sm:w-auto">Reset</Button>
            </div>
            <Button variant="outline" onClick={() => downloadCSV(productsToCSV(products), 'products.csv')} className="mb-4 w-full sm:w-auto">Export to CSV</Button>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-4">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-4">No products found</div>
              ) : (
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.image_urls && product.image_urls.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {product.image_urls.map((url, index) => (
                                <img 
                                  key={index}
                                  src={url} 
                                  alt={product.name} 
                                  className="w-20 h-20 object-cover rounded max-w-full"
                                />
                              ))}
                            </div>
                          ) : product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded max-w-full" />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          {product.is_active !== false ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500" onClick={() => openDeleteDialog(product)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => loadProducts(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={page === currentPage}
                        onClick={() => loadProducts(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => loadProducts(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
        {/* Add/Edit/Delete Dialogs: update DialogContent for mobile */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-full max-w-lg p-2 sm:p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new product to your store. All fields marked with an asterisk (*) are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddProduct)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" {...register('name')} placeholder="e.g., Tomato Pickle" className="w-full" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input id="price" type="number" step="0.01" {...register('price')} className="w-full" />
                  {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register('description')} className="w-full" />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={watch('category') || ''}
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, idx) => (
                        <SelectItem key={(typeof category === 'string' ? category : category.name) + '-' + idx} value={typeof category === 'string' ? category : category.name}>
                          {typeof category === 'string' ? category : category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input id="stock_quantity" type="number" {...register('stock_quantity')} className="w-full" />
                  {errors.stock_quantity && <p className="text-xs text-red-500">{errors.stock_quantity.message}</p>}
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <input type="checkbox" {...register('is_active')} id="is_active" className="mr-2" />
                  <Label htmlFor="is_active">Active Product</Label>
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <Label>Product Images</Label>
                <Input type="file" accept="image/*" multiple onChange={handleFilesChange} className="w-full" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
                {uploadingImage && <span>Uploading images...</span>}
              </div>
              {/* Variants */}
              <div>
                <Label>Variants (Weight/Pricing)</Label>
                <div className="space-y-2">
                  {variantFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input {...register(`variants.${index}.weight`)} placeholder="Weight" className="w-full" />
                      <Input {...register(`variants.${index}.price`)} placeholder="Price (Rs.)" type="number" className="w-full" />
                      <Input {...register(`variants.${index}.stock`)} placeholder="Stock" type="number" className="w-full" />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ weight: '', price: 0, stock: 0 })} className="w-full sm:w-auto mt-2">
                    + Add Variant
                  </Button>
                </div>
              </div>
              {/* Features */}
              <div>
                <Label>Product Features</Label>
                <div className="space-y-2">
                  {featureFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input {...register(`features.${index}`)} className="w-full" />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendFeature('')} className="w-full sm:w-auto">
                    + Add Feature
                  </Button>
                </div>
              </div>
              {/* Footer */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto">Add Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-full max-w-xs sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product information below. All changes will be saved when you submit the form.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onEditProduct)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input id="edit-name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={watch('category') || ''}
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, idx) => (
                        <SelectItem key={(typeof category === 'string' ? category : category.name) + '-' + idx} value={typeof category === 'string' ? category : category.name}>
                          {typeof category === 'string' ? category : category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input id="edit-price" type="number" step="0.01" {...register('price')} />
                  {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
                  <Input id="edit-stock_quantity" type="number" {...register('stock_quantity')} />
                  {errors.stock_quantity && <p className="text-sm text-red-500">{errors.stock_quantity.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" {...register('description')} />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>
              
              {/* Image Upload (Multiple) */}
              <div className="mb-4">
                <Label>Product Images</Label>
                <Input type="file" accept="image/*" multiple onChange={handleFilesChange} />
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
                {uploadingImage && <span>Uploading images...</span>}
              </div>
              
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="space-y-2">
                  {featureFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input
                        {...register(`features.${index}`)} 
                        defaultValue={field as unknown as string}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => appendFeature('')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
              
              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...register('brand')} />
                {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
              </div>
              
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" value={(watch('tags') || []).join(', ')} onChange={e => setValue('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))} />
                {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
              </div>
              
              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input id="expiry_date" type="date" {...register('expiry_date')} />
                {errors.expiry_date && <p className="text-sm text-red-500">{errors.expiry_date.message}</p>}
              </div>
              
              {/* Barcode */}
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" {...register('barcode')} />
                {errors.barcode && <p className="text-sm text-red-500">{errors.barcode.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Product Variants</Label>
                {variantFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-5 gap-2 items-end mb-2">
                    <Input placeholder="Weight" {...register(`variants.${index}.weight` as const)} />
                    <Input placeholder="Price" type="number" step="0.01" {...register(`variants.${index}.price` as const)} />
                    <Input placeholder="Stock" type="number" {...register(`variants.${index}.stock` as const)} />
                    <Input placeholder="Color" {...register(`variants.${index}.color` as const)} />
                    <Input placeholder="Size" {...register(`variants.${index}.size` as const)} />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeVariant(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ weight: '', price: 0, stock: 0, color: '', size: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Variant
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="edit-is_active" className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="edit-is_active" 
                    {...register('is_active')} 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Active</span>
                </Label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadingImage}>
                  {uploadingImage ? 'Uploading...' : 'Update Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="w-full max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p>Are you sure you want to delete the product "{selectedProduct?.name}"?</p>
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={onDeleteProduct}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductManagement;



