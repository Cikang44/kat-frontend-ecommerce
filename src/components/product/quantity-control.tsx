'use client';

import { MinusLinear, AddLinear } from 'vuesax-icon-pack';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityControl({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityControlProps) {
  const decrease = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={quantity <= min}
        className="h-11 w-11 rounded-[15px] border-[#022c3f] bg-[#ffe788] text-[#022c3f] hover:bg-[#ffe788]/80 disabled:opacity-50"
      >
        <MinusLinear className="size-5" />
      </Button>
      <span className="w-8 text-center font-['Geom'] text-xl font-bold text-[#fff3b8]">
        {quantity}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={increase}
        disabled={quantity >= max}
        className="h-11 w-11 rounded-[15px] border-[#022c3f] bg-[#ffe788] text-[#022c3f] hover:bg-[#ffe788]/80 disabled:opacity-50"
      >
        <AddLinear className="size-5" />
      </Button>
    </div>
  );
}
