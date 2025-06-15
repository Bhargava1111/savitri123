import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Tag,
  Package } from
'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  product_count?: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  is_active: boolean;
}

const CategoryManagement: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      // Mock categories for now
      const mockCategories: Category[] = [
      { id: 1, name: 'Pickles', description: 'Traditional pickles and preserves', is_active: true, product_count: 12 },
      { id: 2, name: 'Spices', description: 'Authentic spices and seasonings', is_active: true, product_count: 8 },
      { id: 3, name: 'Condiments', description: 'Sauces and condiments', is_active: true, product_count: 5 },
      { id: 4, name: 'Traditional Foods', description: 'Traditional prepared foods', is_active: true, product_count: 3 },
      { id: 5, name: 'Organic', description: 'Organic and natural products', is_active: true, product_count: 7 },
      { id: 6, name: 'Premium', description: 'Premium quality products', is_active: false, product_count: 2 }];

      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true
    });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: `Category ${editingCategory ? 'updated' : 'added'} successfully`
      });

      resetForm();
      setIsDialogOpen(false);
      await loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      is_active: category.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category?.product_count && category.product_count > 0) {
      toast({
        title: "Cannot Delete",
        description: "This category has products. Please move or delete the products first.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });

      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Success",
        description: `Category ${!category.is_active ? 'activated' : 'deactivated'}`
      });

      await loadCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      toast({
        title: "Error",
        description: "Failed to update category status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6" data-id="f3o10s2hl" data-path="src/components/CategoryManagement.tsx">
      {/* Header */}
      <div className="flex justify-between items-center" data-id="lgjjpsq6x" data-path="src/components/CategoryManagement.tsx">
        <div data-id="1llw01yot" data-path="src/components/CategoryManagement.tsx">
          <h2 className="text-2xl font-bold" data-id="bqmhwvlfa" data-path="src/components/CategoryManagement.tsx">Category Management</h2>
          <p className="text-gray-600" data-id="8wvzxldn3" data-path="src/components/CategoryManagement.tsx">Organize your products with categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} data-id="d7vafhuxl" data-path="src/components/CategoryManagement.tsx">
          <DialogTrigger asChild data-id="i0gygrb50" data-path="src/components/CategoryManagement.tsx">
            <Button onClick={() => {resetForm();setIsDialogOpen(true);}} data-id="o9wppersg" data-path="src/components/CategoryManagement.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="wyc4nofjh" data-path="src/components/CategoryManagement.tsx" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" data-id="rmapp0wa6" data-path="src/components/CategoryManagement.tsx">
            <DialogHeader data-id="ll861df1p" data-path="src/components/CategoryManagement.tsx">
              <DialogTitle data-id="tsvvs0rja" data-path="src/components/CategoryManagement.tsx">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4" data-id="7eqq0515a" data-path="src/components/CategoryManagement.tsx">
              <div data-id="3n24rsjok" data-path="src/components/CategoryManagement.tsx">
                <Label htmlFor="name" data-id="7laeak2wk" data-path="src/components/CategoryManagement.tsx">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Pickles"
                  required data-id="8s1tlekr3" data-path="src/components/CategoryManagement.tsx" />

              </div>

              <div data-id="io8ucowse" data-path="src/components/CategoryManagement.tsx">
                <Label htmlFor="description" data-id="yiifoe3wi" data-path="src/components/CategoryManagement.tsx">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the category"
                  required data-id="qp05abjqk" data-path="src/components/CategoryManagement.tsx" />

              </div>

              <div className="flex items-center space-x-2" data-id="ggygsgvp3" data-path="src/components/CategoryManagement.tsx">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))} data-id="tjr8qsuec" data-path="src/components/CategoryManagement.tsx" />

                <Label htmlFor="active" data-id="1dnwfgvm3" data-path="src/components/CategoryManagement.tsx">Active Category</Label>
              </div>

              <div className="flex justify-end space-x-2" data-id="jlrukn8i3" data-path="src/components/CategoryManagement.tsx">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-id="nn3bar8zl" data-path="src/components/CategoryManagement.tsx">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} data-id="nu3p0rxnx" data-path="src/components/CategoryManagement.tsx">
                  {isLoading ?
                  <div className="flex items-center gap-2" data-id="p70kclvuv" data-path="src/components/CategoryManagement.tsx">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-id="1z9uzz429" data-path="src/components/CategoryManagement.tsx"></div>
                      Saving...
                    </div> :

                  <div className="flex items-center gap-2" data-id="asf7cu7zh" data-path="src/components/CategoryManagement.tsx">
                      <Save className="h-4 w-4" data-id="9e4a8l1uj" data-path="src/components/CategoryManagement.tsx" />
                      {editingCategory ? 'Update' : 'Add'} Category
                    </div>
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-id="vgsbsgkrr" data-path="src/components/CategoryManagement.tsx">
        {categories.map((category) =>
        <Card key={category.id} className={`${!category.is_active ? 'opacity-50' : ''}`} data-id="nga1r4jf9" data-path="src/components/CategoryManagement.tsx">
            <CardContent className="p-4" data-id="tay6dqspk" data-path="src/components/CategoryManagement.tsx">
              <div className="space-y-3" data-id="kks1726qh" data-path="src/components/CategoryManagement.tsx">
                {/* Category Header */}
                <div className="flex justify-between items-start" data-id="cqyavt65t" data-path="src/components/CategoryManagement.tsx">
                  <div className="flex items-center space-x-2" data-id="z3swz4dvj" data-path="src/components/CategoryManagement.tsx">
                    <Tag className="w-5 h-5 text-blue-600" data-id="djxsl46bl" data-path="src/components/CategoryManagement.tsx" />
                    <h3 className="font-semibold text-lg" data-id="tzk3oizdj" data-path="src/components/CategoryManagement.tsx">{category.name}</h3>
                  </div>
                  <Badge variant={category.is_active ? "default" : "secondary"} data-id="2lk334lg2" data-path="src/components/CategoryManagement.tsx">
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Category Info */}
                <div data-id="25xy35shc" data-path="src/components/CategoryManagement.tsx">
                  <p className="text-gray-600 text-sm" data-id="e4pa2usgb" data-path="src/components/CategoryManagement.tsx">{category.description}</p>
                  <div className="flex items-center space-x-2 mt-2" data-id="cn34uq6t2" data-path="src/components/CategoryManagement.tsx">
                    <Package className="w-4 h-4 text-gray-400" data-id="drddrr85c" data-path="src/components/CategoryManagement.tsx" />
                    <span className="text-sm text-gray-500" data-id="mg6r2xta9" data-path="src/components/CategoryManagement.tsx">
                      {category.product_count || 0} products
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2" data-id="h8f5sh77e" data-path="src/components/CategoryManagement.tsx">
                  <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                  className="flex-1" data-id="fv8yj04dh" data-path="src/components/CategoryManagement.tsx">

                    <Edit className="w-4 h-4 mr-1" data-id="b8m6w6cov" data-path="src/components/CategoryManagement.tsx" />
                    Edit
                  </Button>
                  <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleCategoryStatus(category)} data-id="guteghsjb" data-path="src/components/CategoryManagement.tsx">

                    {category.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                  disabled={category.product_count && category.product_count > 0} data-id="gztydsfk2" data-path="src/components/CategoryManagement.tsx">

                    <Trash2 className="w-4 h-4" data-id="g49zwmupy" data-path="src/components/CategoryManagement.tsx" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {categories.length === 0 && !isLoading &&
      <Card data-id="404d303bi" data-path="src/components/CategoryManagement.tsx">
          <CardContent className="text-center py-12" data-id="p6sgnkwm3" data-path="src/components/CategoryManagement.tsx">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" data-id="44ip8frfu" data-path="src/components/CategoryManagement.tsx" />
            <h3 className="text-xl font-semibold mb-2" data-id="dxsv9b0sc" data-path="src/components/CategoryManagement.tsx">No Categories Found</h3>
            <p className="text-gray-600 mb-4" data-id="bzuu39f1g" data-path="src/components/CategoryManagement.tsx">
              Start by adding your first product category
            </p>
            <Button onClick={() => setIsDialogOpen(true)} data-id="v4wmueo00" data-path="src/components/CategoryManagement.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="mphy6yfqv" data-path="src/components/CategoryManagement.tsx" />
              Add Your First Category
            </Button>
          </CardContent>
        </Card>
      }
    </div>);

};

export default CategoryManagement;