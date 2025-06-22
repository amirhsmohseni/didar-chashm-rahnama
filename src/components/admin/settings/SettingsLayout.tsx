
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';

interface SettingsLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  onSave: () => void;
  onRefresh?: () => void;
  isSaving: boolean;
  hasChanges?: boolean;
}

const SettingsLayout = ({
  title,
  description,
  icon,
  children,
  onSave,
  onRefresh,
  isSaving,
  hasChanges = false
}: SettingsLayoutProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            تغییرات ذخیره نشده
          </div>
        )}
      </div>

      {/* Content */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          {children}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={isSaving}
            className="px-6"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            بازخوانی
          </Button>
        )}
        
        <Button
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="px-8 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsLayout;
