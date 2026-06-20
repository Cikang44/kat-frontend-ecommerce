'use client';

import { Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const CATEGORY_OPTIONS = [
  { label: 'Merchandise', value: 'merchandise' },
  { label: 'Collaboration', value: 'collaboration' },
  { label: 'Kit Panitia', value: 'kit_panitia' },
];

const FACULTY_OPTIONS = [
  'STEI',
  'FTSL',
  'FTI',
  'FSRD',
  'FTMD',
  'FMIPA',
  'FITB',
  'SBM',
  'SAPPK',
  'SITH',
];

export function SearchFilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateUrlParams('search', search);
    }
  };

  return (
    <div className="z-10 mb-8 flex w-full flex-col gap-3 md:flex-row md:gap-4">
      <div className="flex flex-1 flex-row gap-3 md:gap-4">
        <Link href="/products">
          <button
            type="button"
            className="flex flex-shrink-0 cursor-pointer items-center justify-center transition-transform active:scale-95"
            style={{
              width: 'clamp(48px, 12vw, 66px)',
              height: 'clamp(48px, 12vw, 66px)',
              borderRadius: '15px',
              background: 'linear-gradient(140.48deg, #1D3F7F 31.13%, #5E68A3 90.15%)',
              boxShadow: '0px 0px 11.19px 0px rgba(255, 255, 255, 0.5)',
            }}
          >
            <div className="relative h-3/5 w-3/5">
              <Image src="/gift.png" alt="Giveaway" fill className="object-contain" />
            </div>
          </button>
        </Link>

        <div
          className="relative flex flex-1 items-center"
          style={{ height: 'clamp(48px, 12vw, 66px)' }}
        >
          <div className="absolute left-4 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="h-full w-full rounded-[15px] border border-gray-200 bg-[#F8F9FA] pr-4 pl-12 font-['Geom'] text-[#133b79] transition-all focus:ring-2 focus:ring-[#133b79] focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
      </div>

      <div className="flex gap-3" style={{ height: 'clamp(48px, 12vw, 66px)' }}>
        <FilterDropdown
          title="All Categories"
          options={CATEGORY_OPTIONS.map((o) => o.label)}
          paramKey="type"
          mappedValues={CATEGORY_OPTIONS.map((o) => o.value)}
        />
        <FilterDropdown title="Faculty" options={FACULTY_OPTIONS} paramKey="faculty" />
      </div>
    </div>
  );
}

function FilterDropdown({
  title,
  options,
  paramKey,
  mappedValues,
}: {
  title: string;
  options: string[];
  paramKey: string;
  mappedValues?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const paramVal = searchParams.get(paramKey);
  const existingValues = paramVal ? paramVal.split(',').filter((v) => v.trim() !== '') : [];

  const [selected, setSelected] = useState<string[]>(existingValues);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        const paramVal = searchParams.get(paramKey);
        setSelected(paramVal ? paramVal.split(',').filter((v) => v.trim() !== '') : []);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchParams, paramKey]);

  const toggleSelection = (val: string) => {
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val],
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length > 0) {
      params.set(paramKey, selected.join(','));
    } else {
      params.delete(paramKey);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative h-full flex-1 md:flex-none" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full min-w-[140px] cursor-pointer items-center justify-between gap-2 rounded-[15px] border border-gray-200 bg-[#F8F9FA] px-4 font-['Geom'] text-[#133b79] transition-colors hover:bg-gray-50 md:min-w-[180px]"
      >
        <span className="truncate text-sm md:text-base">
          {selected.length > 0 ? `${selected.length} Selected` : title}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 flex w-full min-w-[180px] flex-col overflow-hidden rounded-[15px] border border-gray-200 bg-white shadow-lg">
          <div className="flex max-h-[250px] flex-col gap-1 overflow-y-auto p-2">
            {options.map((opt, idx) => {
              const actualValue = mappedValues ? mappedValues[idx] : opt;
              const isChecked = selected.includes(actualValue);
              return (
                <label
                  key={actualValue}
                  className="flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2 font-['Geom'] text-sm text-[#133b79] transition-colors hover:bg-gray-100 md:text-base"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-[6px] border transition-colors ${isChecked ? 'border-[#133b79] bg-[#133b79]' : 'border-gray-300'}`}
                  >
                    {isChecked && <span className="text-xs text-white">✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isChecked}
                    onChange={() => toggleSelection(actualValue)}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={handleApply}
              className="hover:bg-navy-deep w-full cursor-pointer rounded-[10px] bg-[#133b79] py-2 font-['Geom'] text-sm font-bold text-white transition-colors md:py-3 md:text-base"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
