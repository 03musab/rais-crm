'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronRight, Folder, FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/modal';
import { useAuth } from '@/context/auth-context';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { Category } from '@/types';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: '' as string | null,
  });

  useEffect(() => {
    if (user) loadCategories();
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const teamId = `team_${user.uid}`;
      const cats = await getCategories(teamId);
      setCategories(cats as Category[]);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTree = (cats: Category[]): Category[] => {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    cats.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] });
    });

    map.forEach(cat => {
      if (cat.parent_id) {
        const parent = map.get(cat.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(cat);
        } else {
          roots.push(cat);
        }
      } else {
        roots.push(cat);
      }
    });

    return roots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const teamId = `team_${user.uid}`;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          parent_id: formData.parent_id || null,
        });
      } else {
        await createCategory({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          parent_id: formData.parent_id || null,
          team_id: teamId,
        });
      }
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      parent_id: null,
    });
  };

  const categoryTree = buildTree(categories);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id}>
        <div 
          className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
          style={{ paddingLeft: `${1.5 + level * 4}rem` }}
        >
          <div className="flex items-center gap-3">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <Folder className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{category.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                resetForm();
                setFormData(f => ({ ...f, parent_id: category.id }));
                setShowModal(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Sub
            </Button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500">Organize products into categories</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Tree</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {categoryTree.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No categories yet. Create your first category!
            </div>
          ) : (
            <div className="divide-y">
              {categoryTree.map(category => renderCategory(category))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingCategory(null); resetForm(); }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Electronics"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="electronics"
            />
            <p className="text-xs text-gray-500">Leave empty to auto-generate from name</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category</Label>
            <select
              id="parent"
              value={formData.parent_id || ''}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">None (Top Level)</option>
              {categories
                .filter(c => c.id !== editingCategory?.id)
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
