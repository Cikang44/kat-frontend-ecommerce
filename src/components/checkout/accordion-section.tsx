'use client';

import { ArrowDownLinear } from 'vuesax-icon-pack';
import { type ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

interface AccordionSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionSection({
  icon,
  title,
  children,
  defaultOpen = true,
  className,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        'rounded-xl outline-[5px] outline-white/50 bg-navy text-white',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-2 px-4 pt-4 pb-3 text-left"
      >
        <span className="flex size-5 items-center justify-center text-white">{icon}</span>
        <h2 className="flex-1 font-[Redzone] text-base font-bold text-white">
          {title}
        </h2>
        <ArrowDownLinear
          size={16}
          className={cn(
            'text-white/70 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'transition-all duration-200 ease-in-out',
          open ? 'max-h-[2000px]' : 'max-h-0',
        )}
      >
        {/* no overflow-hidden — allows dropdowns to pop out */}
        {open && <div className="px-4 pb-4">{children}</div>}
      </div>
    </section>
  );
}
