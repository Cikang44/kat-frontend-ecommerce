'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowLeftIcon1Linear, ArrowRightIcon1Linear } from 'vuesax-icon-pack';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMultipleImages = sortedImages.length > 1;

  const goToPrevious = () => {
    const prev = selectedIndex === 0 ? sortedImages.length - 1 : selectedIndex - 1;
    setSelectedIndex(prev);
    scrollThumbIntoView(prev);
  };

  const goToNext = () => {
    const next = selectedIndex === sortedImages.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(next);
    scrollThumbIntoView(next);
  };

  const handleThumbnailClick = (idx: number) => {
    setSelectedIndex(idx);
    scrollThumbIntoView(idx);
  };

  const scrollThumbIntoView = (idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const thumb = container.children[idx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Main image */}
      <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] border border-[#996537] bg-[#fff3b8]">
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

        {/* Navigation arrows */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="bg-powder border-navy absolute top-1/2 left-7 z-10 -translate-y-1/2 rounded-full border p-2 text-white/60 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:text-white"
            >
              <ArrowLeftIcon1Linear className="text-navy size-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next image"
              className="bg-powder border-navy absolute top-1/2 right-7 z-10 -translate-y-1/2 rounded-full border p-2 text-white/60 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:text-white"
            >
              <ArrowRightIcon1Linear className="text-navy size-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — scrollable, max 3 visible at a time */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {sortedImages.map((image, idx) => (
          <button
            key={image.id}
            type="button"
            onClick={() => handleThumbnailClick(idx)}
            className={cn(
              'relative aspect-square w-[calc((100%-24px)/3)] shrink-0 snap-start overflow-hidden rounded-md border border-[#996537] bg-[#fff3b8] transition-opacity',
              selectedIndex === idx ? 'opacity-100' : 'opacity-70 hover:opacity-100',
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
