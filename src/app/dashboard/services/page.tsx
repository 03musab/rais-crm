'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/modal';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import { Service, ServiceBadge } from '@/types';

const ICON_OPTIONS = [
  { value: 'star', label: 'Star', icon: '⭐' },
  { value: 'building', label: 'Building', icon: '🏢' },
  { value: 'hands', label: 'Hands', icon: '🤲' },
  { value: 'tshirt', label: 'T-Shirt', icon: '👕' },
  { value: 'ruler', label: 'Ruler', icon: '📏' },
  { value: 'user-tie', label: 'User Tie', icon: '👔' },
  { value: 'cog', label: 'Gear', icon: '⚙️' },
];

const BADGE_OPTIONS: ServiceBadge[] = [null, 'Popular', 'Corporate', 'Artisan', 'Bulk'];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    badge: null as ServiceBadge,
    icon: 'star',
    image_url: '',
    whatsapp_message: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const srvcs = await getServices();
      setServices(srvcs);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService(formData);
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      badge: service.badge,
      icon: service.icon || 'star',
      image_url: service.image_url || '',
      whatsapp_message: service.whatsapp_message || '',
      sort_order: service.sort_order,
      is_active: service.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteService(id);
      loadData();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { is_active: !service.is_active });
      loadData();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const handleReorder = async (service: Service, direction: 'up' | 'down') => {
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(s => s.id === service.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const temp = sorted[swapIdx].sort_order;
    sorted[swapIdx].sort_order = service.sort_order;
    service.sort_order = temp;

    try {
      await Promise.all([
        updateService(service.id, { sort_order: service.sort_order }),
        updateService(sorted[swapIdx].id, { sort_order: sorted[swapIdx].sort_order }),
      ]);
      loadData();
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', badge: null, icon: 'star', image_url: '', whatsapp_message: '', sort_order: 0, is_active: true });
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.sort_order - b.sort_order);

  const getBadgeVariant = (badge: ServiceBadge) => {
    if (!badge) return 'secondary';
    if (badge === 'Popular') return 'default';
    return 'secondary';
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
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-gray-500">Manage your service offerings</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-16">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Badge</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Icon</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Active</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, idx) => (
                  <tr key={service.id} className={`border-b ${!service.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleReorder(service, 'up')} disabled={idx === 0}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleReorder(service, 'down')} disabled={idx === filteredServices.length - 1}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{service.title}</p>
                      {service.description && (
                        <p className="text-sm text-gray-500 truncate max-w-[300px]">
                          {service.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {service.badge ? (
                        <Badge variant={getBadgeVariant(service.badge)}>{service.badge}</Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg">{ICON_OPTIONS.find(i => i.value === service.icon)?.icon || '⭐'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleToggleActive(service)}>
                        {service.is_active ? (
                          <ToggleRight className="h-6 w-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredServices.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                {search ? 'No services found' : 'No services yet. Add your first service!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingService(null); resetForm(); }}
        title={editingService ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value, whatsapp_message: formData.whatsapp_message || `Hi! I'm interested in ${e.target.value}.` })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <select
                id="badge"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: (e.target.value || null) as ServiceBadge })}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {BADGE_OPTIONS.filter(b => b !== null).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_message">WhatsApp Message</Label>
            <Input
              id="whatsapp_message"
              value={formData.whatsapp_message}
              onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
              placeholder="Hi! I'm interested in..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <select
                id="is_active"
                value={String(formData.is_active)}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingService ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
