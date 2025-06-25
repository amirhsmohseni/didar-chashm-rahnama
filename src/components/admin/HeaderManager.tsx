
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Menu, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from './ImageUploader';

interface HeaderItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const HeaderManager = () => {
  const [headerItems, setHeaderItems] = useState<HeaderItem[]>([
    { id: '1', title: 'خانه', url: '/', icon: 'home', order: 1, isActive: true },
    { id: '2', title: 'خدمات', url: '/services', icon: 'eye', order: 2, isActive: true },
    { id: '3', title: 'پزشکان', url: '/doctors', icon: 'user-check', order: 3, isActive: true },
    { id: '4', title: 'تماس', url: '/consultation', icon: 'phone', order: 4, isActive: true },
  ]);
  const [editingItem, setEditingItem] = useState<HeaderItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<HeaderItem>>({
    title: '',
    url: '',
    icon: '',
    order: headerItems.length + 1,
    isActive: true
  });
  const { toast } = useToast();

  const handleSaveItem = (item: HeaderItem) => {
    setHeaderItems(prev => 
      prev.map(h => h.id === item.id ? item : h).sort((a, b) => a.order - b.order)
    );
    setEditingItem(null);
    toast({ title: "موفق", description: "آیتم هدر با موفقیت ذخیره شد" });
  };

  const handleDeleteItem = (id: string) => {
    setHeaderItems(prev => prev.filter(h => h.id !== id));
    toast({ title: "موفق", description: "آیتم هدر حذف شد" });
  };

  const handleAddNew = () => {
    if (!newItem.title || !newItem.url) {
      toast({ title: "خطا", description: "عنوان و URL الزامی است", variant: "destructive" });
      return;
    }

    const item: HeaderItem = {
      id: Date.now().toString(),
      title: newItem.title!,
      url: newItem.url!,
      icon: newItem.icon || 'link',
      order: newItem.order || headerItems.length + 1,
      isActive: newItem.isActive ?? true
    };

    setHeaderItems(prev => [...prev, item].sort((a, b) => a.order - b.order));
    setNewItem({ title: '', url: '', icon: '', order: headerItems.length + 2, isActive: true });
    setIsAddingNew(false);
    toast({ title: "موفق", description: "آیتم جدید اضافه شد" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Menu className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">مدیریت هدر</h2>
            <p className="text-gray-600">ویرایش منوی ناوبری سایت</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddingNew(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          آیتم جدید
        </Button>
      </div>

      {/* Add New Item Form */}
      {isAddingNew && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">افزودن آیتم جدید</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>عنوان</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان منو"
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={newItem.url}
                  onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="/page-url"
                />
              </div>
              <div>
                <Label>آیکون</Label>
                <Input
                  value={newItem.icon}
                  onChange={(e) => setNewItem(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="نام آیکون (مثل: home, user, etc.)"
                />
              </div>
              <div>
                <Label>ترتیب</Label>
                <Input
                  type="number"
                  value={newItem.order}
                  onChange={(e) => setNewItem(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                ذخیره
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                <X className="h-4 w-4 mr-2" />
                لغو
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Items List */}
      <div className="grid gap-4">
        {headerItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {editingItem?.id === item.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>عنوان</Label>
                      <Input
                        value={editingItem.title}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={editingItem.url}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, url: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label>آیکون</Label>
                      <Input
                        value={editingItem.icon}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, icon: e.target.value } : null)}
                        placeholder="نام آیکون"
                      />
                    </div>
                    <div>
                      <Label>ترتیب</Label>
                      <Input
                        type="number"
                        value={editingItem.order}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, order: parseInt(e.target.value) } : null)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveItem(editingItem)} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      ذخیره
                    </Button>
                    <Button variant="outline" onClick={() => setEditingItem(null)}>
                      <X className="h-4 w-4 mr-2" />
                      لغو
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">#{item.order}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.url}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isActive ? 'فعال' : 'غیرفعال'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeaderManager;
