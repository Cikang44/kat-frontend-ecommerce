'use client';
import type { ProductVariant } from '@/api/types.gen';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColor: string;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
  className?: string;
}

const colorSwatch: Record<string, string> = {
  Hitam: '#1f2937',
  Navy: '#1e3a8a',
  Putih: '#f3f4f6',
};

export function VariantSelector({
  variants,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  className,
}: VariantSelectorProps) {
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter((s) => s !== 'none')));
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Size selector */}
      <div className="flex flex-col gap-2">
        <h3 className="text-royal font-['Redzone'] text-lg">Ukuran</h3>
        <ToggleGroup
          type="single"
          value={selectedSize}
          onValueChange={(value) => value && onSelectSize(value)}
          className="flex flex-wrap gap-6"
        >
          {sizes.map((size) => (
            <ToggleGroupItem
              key={size}
              value={size}
              aria-label={size}
              className={cn(
                "flex h-[46px] min-w-[40px] items-center justify-center rounded-none border-b-[3px] border-transparent bg-transparent px-2 font-['Geom'] text-[30px] leading-[30px] text-ink shadow-none transition-colors hover:border-accent-orange/50 hover:bg-transparent data-[state=on]:border-accent-orange data-[state=on]:bg-transparent",
              )}
            >
              {size}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Color selector */}
      <div className="flex flex-col gap-2">
        <h3 className="text-royal font-['Redzone'] text-lg">Warna</h3>
        <ToggleGroup
          type="single"
          value={selectedColor}
          onValueChange={(value) => value && onSelectColor(value)}
          className="flex flex-wrap gap-6"
        >
          {colors.map((color) => {
            const hex = colorSwatch[color] ?? '#ccc';
            const isSelected = selectedColor === color;
            return (
              <ToggleGroupItem
                key={color}
                value={color}
                aria-label={color}
                className="relative flex h-[66px] w-[50px] flex-col items-center justify-start gap-0 bg-transparent p-0 shadow-none hover:bg-transparent data-[state=on]:bg-transparent"
              >
                <span className="size-[50px] rounded-full" style={{ backgroundColor: hex }} />
                {isSelected && (
                  <span className="bg-accent-orange absolute bottom-2 h-[4px] w-full" />
                )}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
    </div>
  );
}
