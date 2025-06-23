
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { Card, CardContent } from "@/components/ui/card";
import { SettingItem } from '@/hooks/useAdvancedSiteSettings';
import AdvancedImageUpload from './AdvancedImageUpload';
import ColorPicker from './ColorPicker';

interface SettingsCategoryProps {
  category: string;
  settings: SettingItem[];
  changedSettings: Record<string, string>;
  onSettingChange: (key: string, value: string) => void;
}

const SettingsCategory = ({
  category,
  settings,
  changedSettings,
  onSettingChange
}: SettingsCategoryProps) => {

  const renderSettingInput = (setting: SettingItem) => {
    // Always use changedSettings value if it exists (even if empty string), otherwise use original setting value
    const currentValue = setting.key in changedSettings 
      ? changedSettings[setting.key] 
      : (setting.value || '');

    console.log(`Rendering ${setting.key}: changedValue="${changedSettings[setting.key]}", originalValue="${setting.value}", currentValue="${currentValue}"`);

    const handleChange = (value: string) => {
      console.log(`Changing ${setting.key} to: "${value}"`);
      onSettingChange(setting.key, value);
    };

    switch (setting.type) {
      case 'text':
        return (
          <Input
            id={setting.key}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={setting.description || ''}
            className="mt-2"
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={setting.key}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={setting.description || ''}
            rows={4}
            className="mt-2"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center justify-between mt-2 p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">{setting.label}</Label>
              {setting.description && (
                <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
              )}
            </div>
            <Switch
              checked={currentValue === 'true'}
              onCheckedChange={(checked) => handleChange(checked ? 'true' : 'false')}
            />
          </div>
        );

      case 'number':
        return (
          <Input
            id={setting.key}
            type="number"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={setting.description || ''}
            className="mt-2"
          />
        );

      case 'color':
        return (
          <ColorPicker
            value={currentValue}
            onChange={handleChange}
            label={setting.label}
          />
        );

      case 'image':
        return (
          <AdvancedImageUpload
            currentImage={currentValue}
            onImageChange={handleChange}
            label={setting.label}
            description={setting.description}
          />
        );

      default:
        return (
          <Input
            id={setting.key}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={setting.description || ''}
            className="mt-2"
          />
        );
    }
  };

  return (
    <div className="grid gap-6">
      {settings.map((setting) => (
        <Card key={setting.key} className="hover:shadow-md transition-shadow">
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
            
            {renderSettingInput(setting)}
            
            {setting.key in changedSettings && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-orange-600">تغییر یافته</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SettingsCategory;
