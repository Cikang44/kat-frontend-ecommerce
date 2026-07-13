'use client';

import { Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { Checkbox } from '@/components/ui/checkbox';

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Live-update the table as the user types, debounced so we're not
  // pushing a URL update (and re-fetching) on every keystroke.
  useEffect(() => {
    const currentParam = searchParams.get('search') || '';
    if (search === currentParam) return;

    const timeout = setTimeout(() => {
      updateUrlParams('search', search);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateUrlParams('search', search);
    }
  };

  const activeFilterCount =
    (searchParams.get('type') ? searchParams.get('type')!.split(',').filter(Boolean).length : 0) +
    (searchParams.get('faculty') ? searchParams.get('faculty')!.split(',').filter(Boolean).length : 0);

  return (
    <div className="z-10 mb-3 flex w-full flex-col gap-2 md:flex-row md:gap-3">
      <div className="flex flex-1 flex-row gap-2 md:gap-4">
        <div className="relative flex h-10 flex-1 items-center">
          <div className="absolute left-3 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="bg-[#e6eff9] h-full w-full rounded-[12px] border border-[#1f4280] pr-3 pl-10 font-['Geom'] text-xs text-[#133b79] transition-all focus:ring-2 focus:ring-[#133b79] focus:outline-none md:rounded-[15px] md:pr-4 md:pl-12 md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        {/* Mobile-only combined filter trigger */}
        <div className="relative shrink-0 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#1f4280] bg-[#657ac6] text-[#133b79] transition-colors"
            aria-label="Filter"
          >
            <Image
              src={activeFilterCount > 0 ? '/icons/filter-tick.svg' : '/icons/filter-search.svg'}
              alt=""
              width={16}
              height={16}
              aria-hidden
            />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#133b79] px-1 text-[9px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {isMobileFilterOpen && <MobileFilterPanel onClose={() => setIsMobileFilterOpen(false)} />}
        </div>
      </div>

      {/* Desktop-only separate dropdowns */}
      <div className="hidden gap-2 md:flex">
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

function PillOption({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md border px-3 py-1.5 font-['Geom'] text-xs whitespace-nowrap transition-colors ${
        isActive
          ? 'border-[#7a94d4] bg-[#d2e1f3] text-[#38578d]'
          : 'border-[#999999] bg-[#f9f6f3] text-[#999999]'
      }`}
    >
      {label}
    </button>
  );
}

function MobileFilterPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLDivElement>(null);

  const existingCategory = (searchParams.get('type') || '')
    .split(',')
    .filter((v) => v.trim() !== '');
  const existingFaculty = (searchParams.get('faculty') || '')
    .split(',')
    .filter((v) => v.trim() !== '');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(existingCategory);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>(existingFaculty);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const toggleFaculty = (value: string) => {
    setSelectedFaculty((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleCancel = () => {
    setSelectedCategories(existingCategory);
    setSelectedFaculty(existingFaculty);
    onClose();
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategories.length > 0) {
      params.set('type', selectedCategories.join(','));
    } else {
      params.delete('type');
    }

    if (selectedFaculty.length > 0) {
      params.set('faculty', selectedFaculty.join(','));
    } else {
      params.delete('faculty');
    }

    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 z-50 mt-2 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-4 rounded-[15px] border border-gray-200 bg-[#F1F7FC] p-4 shadow-lg"
    >
      <div className="flex flex-col gap-2">
        <p className="font-['Geom'] text-sm font-semibold text-[#133b79]">Categories</p>
        <div className="flex flex-wrap gap-2">
          <PillOption
            label="All"
            isActive={selectedCategories.length === 0}
            onClick={() => setSelectedCategories([])}
          />
          {CATEGORY_OPTIONS.map((opt) => (
            <PillOption
              key={opt.value}
              label={opt.label}
              isActive={selectedCategories.includes(opt.value)}
              onClick={() => toggleCategory(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-['Geom'] text-sm font-semibold text-[#133b79]">Faculty</p>
        <div className="flex flex-wrap gap-2">
          <PillOption
            label="All"
            isActive={selectedFaculty.length === 0}
            onClick={() => setSelectedFaculty([])}
          />
          {FACULTY_OPTIONS.map((opt) => (
            <PillOption
              key={opt}
              label={opt}
              isActive={selectedFaculty.includes(opt)}
              onClick={() => toggleFaculty(opt)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 cursor-pointer rounded-[10px] border border-[#38578d] bg-white py-2 font-['Geom'] text-sm text-[#38578d] transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 cursor-pointer rounded-[10px] bg-[#38578d] py-2 font-['Geom'] text-sm text-white transition-colors"
        >
          Terapkan
        </button>
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
    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative h-full flex-1 md:flex-none" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#bbcffb] flex h-full w-full min-w-[110px] cursor-pointer items-center justify-between gap-1.5 rounded-[12px] border border-gray-200 px-3 font-['Geom'] text-sm text-[#133b79] transition-colors md:min-w-[180px] md:gap-2 md:rounded-[15px] md:px-4 md:text-base"
      >
        <span className="truncate text-sm md:text-base">
          {selected.length > 0 ? `${selected.length} Selected` : title}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 flex w-full min-w-[160px] flex-col overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-lg md:min-w-[180px] md:rounded-[15px]">
          <div className="flex max-h-[220px] flex-col gap-0.5 overflow-y-auto p-1.5 md:max-h-[250px] md:gap-1 md:p-2">
            {options.map((opt, idx) => {
              const actualValue = mappedValues ? mappedValues[idx] : opt;
              const isChecked = selected.includes(actualValue);
              return (
                <label
                  key={actualValue}
                  className="text-navy flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 font-['Geom'] text-xs transition-colors hover:bg-gray-100 md:gap-3 md:rounded-[10px] md:px-3 md:py-2 md:text-base"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleSelection(actualValue)}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
          <div className="border-t border-gray-100 p-2 md:p-3">
            <button
              onClick={handleApply}
              className="hover:bg-navy-deep w-full cursor-pointer rounded-[8px] bg-[#133b79] py-1.5 font-['Geom'] text-xs font-bold text-white transition-colors md:rounded-[10px] md:py-3 md:text-base"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}