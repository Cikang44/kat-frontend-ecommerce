'use client';

import { useRouter } from 'next/navigation';
import { ArrowCircleLeftLinear } from 'vuesax-icon-pack';

import { cn } from '@/lib/utils';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = 'Kembali', className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "flex items-center gap-3 self-start font-['Geom'] text-2xl font-normal leading-[30px] text-ink transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span className="size-6">
        <ArrowCircleLeftLinear className="text-ink size-6" />
      </span>
      <span>{label}</span>
    </button>
  );
}
