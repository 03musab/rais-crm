'use client';

import { useState, useEffect } from 'react';
import { Plus, GripVertical, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/modal';
import { useAuth } from '@/context/auth-context';
import { getSections, createSection, updateSection, deleteSection } from '@/lib/api';
import { Section, SectionType } from '@/types';

const sectionColors: Record<SectionType, string> = {
  homepage: 'bg-blue-100 text-blue-800',
  featured: 'bg-green-100 text-green-800',
  promotions: 'bg-purple-100 text-purple-800',
  category: 'bg-orange-100 text-orange-800',
};

export default function SectionsPage() {
  const { user } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'featured' as SectionType,
    description: '',
  });

  useEffect(() => {
    if (user) loadSections();
  }, [user]);

  const loadSections = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const teamId = `team_${user.uid}`;
      const sects = await getSections(teamId);
      setSections(sects);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const teamId = `team_${user.uid}`;

    try {
      if (editingSection) {
        await updateSection(editingSection.id, formData);
      } else {
        await createSection({ ...formData, teamId });
      }
      setShowModal(false);
      setEditingSection(null);
      resetForm();
      loadSections();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      type: section.type,
      description: section.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      await deleteSection(id);
      loadSections();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'featured',
      description: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sections</h1>
          <p className="text-gray-500">Organize products into sections</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <LayoutGrid className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No sections yet. Create your first section!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                    <div>
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                      <Badge className={sectionColors[section.type]} variant="default">
                        {section.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(section)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(section.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description || 'No description'}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingSection(null); resetForm(); }}
        title={editingSection ? 'Edit Section' : 'Create Section'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Section Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Sale"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as SectionType })}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="homepage">Homepage</option>
              <option value="featured">Featured</option>
              <option value="promotions">Promotions</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              rows={3}
              placeholder="Optional description..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSection ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
