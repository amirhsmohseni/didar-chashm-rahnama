
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { SettingItem } from '@/hooks/useSimpleSiteSettings';
import SimpleSettingsInput from './SimpleSettingsInput';

interface SimpleSettingsCardProps {
  setting: SettingItem;
  onSave: (key: string, value: string) => Promise<void>;
}

const SimpleSettingsCard = ({ setting, onSave }: SimpleSettingsCardProps) => {
  const [currentValue, setCurrentValue] = useState(setting.value || '');
  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (value: string) => {
    setCurrentValue(value);
    setHasChanged(value !== (setting.value || ''));
  };

  const handleSave = async () => {
    if (!hasChanged) return;
    
    try {
      setIsSaving(true);
      await onSave(setting.key, currentValue);
      setHasChanged(false);
      // Update the original setting value after successful save
      setting.value = currentValue;
    } catch (error) {
      console.error('Failed to save setting:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCurrentValue(setting.value || '');
    setHasChanged(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {setting.type !== 'boolean' && (
          <div className="mb-2">
            <Label htmlFor={setting.key} className="text-base font-medium text-gray-900">
              {setting.label}
              {!setting.is_public && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  خصوصی
                </span>
              )}
            </Label>
            {setting.description && (
              <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
            )}
          </div>
        )}
        
        <SimpleSettingsInput
          setting={setting}
          value={currentValue}
          onChange={handleChange}
        />
        
        {hasChanged && (
          <div className="mt-3 flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-700 font-medium">تغییرات ذخیره نشده</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                بازگردانی
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded-md transition-colors disabled:opacity-50"
              >
                {isSaving ? 'ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleSettingsCard;
