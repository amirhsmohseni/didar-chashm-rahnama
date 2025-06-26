
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  presetColors?: string[];
}

const ColorPicker = ({ 
  value, 
  onChange, 
  label,
  presetColors
}: ColorPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // پالت رنگ‌های حرفه‌ای برای چشم‌پزشکی و پزشکی
  const professionalColorPalettes = {
    primary: [
      '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e',
      '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'
    ],
    medical: [
      '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
      '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'
    ],
    warm: [
      '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f',
      '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'
    ],
    purple: [
      '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
      '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'
    ],
    neutral: [
      '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827',
      '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#f9fafb'
    ],
    accent: [
      '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843',
      '#84cc16', '#65a30d', '#4d7c0f', '#365314', '#1a2e05'
    ]
  };

  const allPresetColors = presetColors || [
    ...professionalColorPalettes.primary,
    ...professionalColorPalettes.medical,
    ...professionalColorPalettes.warm,
    ...professionalColorPalettes.purple,
    ...professionalColorPalettes.neutral.slice(0, 5),
    ...professionalColorPalettes.accent
  ];

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      toast.success(`رنگ ${color} کپی شد`);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (error) {
      toast.error('خطا در کپی کردن رنگ');
    }
  };

  const generateRandomColor = () => {
    const colors = allPresetColors;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onChange(randomColor);
  };

  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm relative overflow-hidden group transition-all hover:scale-105"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
            <Palette className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              onChange(newValue);
            }}
            placeholder="#000000"
            className={`font-mono ${!isValidHex(value) && value ? 'border-red-300 bg-red-50' : ''}`}
          />
          {!isValidHex(value) && value && (
            <p className="text-xs text-red-500 mt-1">فرمت رنگ نامعتبر است</p>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(value)}
            title="کپی رنگ"
          >
            {copiedColor === value ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandomColor}
            title="رنگ تصادفی"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPicker(!showPicker)}
          >
            <Palette className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showPicker && (
        <div className="p-6 bg-white border rounded-xl shadow-lg border-gray-200">
          {/* Color Picker Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب دقیق رنگ</label>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 rounded-lg border cursor-pointer"
            />
          </div>
          
          {/* Professional Color Palettes */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                رنگ‌های اصلی و پزشکی
              </h4>
              <div className="grid grid-cols-10 gap-2">
                {[...professionalColorPalettes.primary, ...professionalColorPalettes.medical].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 relative group ${
                      value === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                    title={color}
                  >
                    {value === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                رنگ‌های تکمیلی
              </h4>
              <div className="grid grid-cols-10 gap-2">
                {[...professionalColorPalettes.purple, ...professionalColorPalettes.warm].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 relative group ${
                      value === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                    title={color}
                  >
                    {value === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                رنگ‌های خنثی و لهجه‌ای
              </h4>
              <div className="grid grid-cols-10 gap-2">
                {[...professionalColorPalettes.neutral, ...professionalColorPalettes.accent].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 relative group ${
                      value === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                    title={color}
                  >
                    {value === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {allPresetColors.length} رنگ پیش‌فرض موجود
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange('#ffffff')}
                  className="text-xs"
                >
                  سفید
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange('#000000')}
                  className="text-xs"
                >
                  سیاه
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPicker(false)}
                  className="text-xs"
                >
                  بستن
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
