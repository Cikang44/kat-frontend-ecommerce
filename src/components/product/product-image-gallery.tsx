'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { ProductImage } from '@/api/types.gen';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductImageGallery({ images, productName, className }: ProductImageGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = sortedImages[selectedIndex] ?? sortedImages[0];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Main image */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] border border-[#996537] bg-[#fff3b8]">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={productName}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        ) : (
          <div className="text-sm text-[#51446b]">No image</div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3">
        {sortedImages.slice(0, 3).map((image, idx) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-md border border-[#996537] bg-[#fff3b8] transition-opacity',
              selectedIndex === idx
                ? 'opacity-100 ring-2 ring-[#dd7702]'
                : 'opacity-70 hover:opacity-100',
            )}
          >
            <Image
              src={image.url}
              alt={`${productName} - ${idx + 1}`}
              fill
              className="object-contain p-2"
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
