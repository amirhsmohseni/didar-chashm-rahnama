
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { SettingItem } from '@/hooks/useSimpleSiteSettings';
import AdvancedImageUpload from './AdvancedImageUpload';
import ColorPicker from './ColorPicker';

interface SimpleSettingsInputProps {
  setting: SettingItem;
  value: string;
  onChange: (value: string) => void;
}

const SimpleSettingsInput = ({ setting, value, onChange }: SimpleSettingsInputProps) => {
  const handleChange = (newValue: string) => {
    console.log(`Changing ${setting.key} from "${value}" to "${newValue}"`);
    onChange(newValue);
  };

  switch (setting.type) {
    case 'text':
      return (
        <Input
          id={setting.key}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={setting.description || ''}
          className="mt-2"
        />
      );

    case 'textarea':
      return (
        <Textarea
          id={setting.key}
          value={value}
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
            checked={value === 'true'}
            onCheckedChange={(checked) => handleChange(checked ? 'true' : 'false')}
          />
        </div>
      );

    case 'number':
      return (
        <Input
          id={setting.key}
          type="number"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={setting.description || ''}
          className="mt-2"
        />
      );

    case 'color':
      return (
        <ColorPicker
          value={value}
          onChange={handleChange}
          label={setting.label}
        />
      );

    case 'image':
      return (
        <AdvancedImageUpload
          currentImage={value}
          onImageChange={handleChange}
          label={setting.label}
          description={setting.description}
        />
      );

    default:
      return (
        <Input
          id={setting.key}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={setting.description || ''}
          className="mt-2"
        />
      );
  }
};

export default SimpleSettingsInput;
