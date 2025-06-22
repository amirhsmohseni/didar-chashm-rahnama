
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

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
  presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#000000', '#ffffff', '#6b7280', '#374151'
  ]
}: ColorPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="font-mono"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(!showPicker)}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      {showPicker && (
        <div className="p-4 bg-white border rounded-lg shadow-lg">
          <div className="mb-3">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 rounded-lg border cursor-pointer"
            />
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  value === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
