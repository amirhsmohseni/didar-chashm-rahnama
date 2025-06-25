
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { Setting } from '@/hooks/useSettingsManager';
import AdvancedImageUpload from './AdvancedImageUpload';
import ColorPicker from './ColorPicker';

interface SettingInputProps {
  setting: Setting;
  onUpdate: (key: string, value: string) => Promise<boolean>;
}

const SettingInput = ({ setting, onUpdate }: SettingInputProps) => {
  const [currentValue, setCurrentValue] = useState(setting.value || '');
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleValueChange = (newValue: string) => {
    setCurrentValue(newValue);
    setIsChanged(newValue !== (setting.value || ''));
  };

  const handleSave = async () => {
    if (!isChanged) return;
    
    setIsSaving(true);
    const success = await onUpdate(setting.key, currentValue);
    
    if (success) {
      setIsChanged(false);
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    setCurrentValue(setting.value || '');
    setIsChanged(false);
  };

  const renderInput = () => {
    switch (setting.type) {
      case 'text':
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={setting.description || ''}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={setting.description || ''}
            rows={4}
            className="w-full"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={currentValue === 'true'}
              onCheckedChange={(checked) => handleValueChange(checked ? 'true' : 'false')}
            />
            <Label>{currentValue === 'true' ? 'فعال' : 'غیرفعال'}</Label>
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={setting.description || ''}
            className="w-full"
          />
        );

      case 'color':
        return (
          <ColorPicker
            value={currentValue}
            onChange={handleValueChange}
            label={setting.label}
          />
        );

      case 'image':
        return (
          <AdvancedImageUpload
            currentImage={currentValue}
            onImageChange={handleValueChange}
            label={setting.label}
            description={setting.description}
          />
        );

      default:
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={setting.description || ''}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium text-gray-900">
            {setting.label}
            {!setting.is_public && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                خصوصی
              </span>
            )}
          </Label>
          {setting.description && (
            <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
          )}
        </div>

        <div className="space-y-3">
          {renderInput()}
          
          {isChanged && (
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-700 font-medium">تغییرات ذخیره نشده</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  بازگردانی
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'ذخیره...' : 'ذخیره'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingInput;
