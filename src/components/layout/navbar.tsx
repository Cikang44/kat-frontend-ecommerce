// components/layout/navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Product List', href: '/products' },
  { label: 'Item', href: '/admin/dashboard-item' },
  { label: 'Transaction', href: '/admin/dashboard-transaction' },
  { label: 'Hand Over', href: '/admin/hand-over' },
];

function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-5 w-5"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="h-4 w-4"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.5-3.2 4.2-5 7-5s5.5 1.8 7 5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-6 w-6"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-6 w-6"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

type NavbarProps = {
  /** Background image shown behind the full-screen mobile menu. Put the file in /public. */
  mobileMenuBgSrc?: string;
  /** Dark overlay strength (0–100) on top of that image so text stays readable. */
  mobileMenuOverlayOpacity?: number;
};

function Navbar({
  mobileMenuBgSrc = '/bg-footer.png', // <-- put your image in /public and update this path
  mobileMenuOverlayOpacity = 0,
}: NavbarProps) {
  const pathname = usePathname() ?? '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock background scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="sticky top-4 z-50 mx-4 md:mx-8">
      <nav className="mx-auto max-w-[1180px] rounded-2xl border-0 bg-[#022c3f] md:border md:border-[#fff3b8]">
        <div className="flex items-center justify-between gap-2 px-4 py-2 md:gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="text-center font-['Redzone',sans-serif] text-lg leading-tight font-black tracking-wide whitespace-nowrap text-[#fff3b8] uppercase"
            onClick={() => setMobileOpen(false)}
          >
            <span className="block text-[14px] leading-none tracking-tight md:text-[18px]">
              Ganesha
            </span>
            <span className="block text-[11px] leading-none tracking-tight md:text-[14px]">
              Goods
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="text-18px hidden items-center gap-8 font-semibold md:flex">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      active ? 'text-white' : 'text-white/40 transition hover:text-white/70'
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right side: cart + user */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/cart" aria-label="Cart" className="text-[#fff3b8] hover:text-[#f7e8bd]">
              <CartIcon />
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-[#fff3b8] px-4 py-1.5 text-sm font-semibold text-[#fff3b8] hover:bg-white/5"
            >
              <UserIcon />
              User
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex items-center justify-center text-[#fff3b8] md:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay — covers the entire viewport, no margins/rounding */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto md:hidden">
          {/* Background image */}
          <Image
            src={mobileMenuBgSrc}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 z-0 object-cover"
          />
          {/* Dark overlay so text stays legible regardless of the image */}
          <div
            aria-hidden
            className="absolute inset-0 z-[1] bg-[#022c3f]"
            style={{ opacity: mobileMenuOverlayOpacity / 100 }}
          />

          {/* Foreground content — must be `relative` + a z-index to sit above the
             absolutely-positioned background/overlay layers above */}
          <div className="relative z-10 flex flex-1 flex-col">
            {/* Header: logo + close button, mirrors the collapsed bar */}
            <div className="flex items-center justify-between gap-6 px-6 py-6">
              <Link
                href="/"
                className="px-1 text-center font-['Redzone',sans-serif] text-lg leading-tight font-black tracking-wide whitespace-nowrap text-[#fff3b8] uppercase"
                onClick={() => setMobileOpen(false)}
              >
                <span className="block text-[18px] leading-none tracking-tight">Ganesha</span>
                <span className="block text-[14px] leading-none tracking-tight">Goods</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center text-white"
              >
                <MenuIcon open />
              </button>
            </div>

            <hr className="border-t border-[#fff3b8]/30" />

            {/* Stacked links */}
            <ul className="flex flex-col gap-6 px-6 py-8 text-lg font-semibold">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={active ? 'text-white' : 'text-white/40'}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Pushes the bottom row to the bottom of the screen */}
            <div className="flex-1" />

            {/* Bottom row: cart + user */}
            <div className="flex items-center justify-center gap-6 border-t border-[#fff3b8] px-6 py-6">
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                aria-label="Cart"
                className="text-[#fff3b8]"
              >
                <CartIcon />
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-full border border-[#fff3b8] px-5 py-2 text-sm font-semibold text-[#fff3b8]"
              >
                <UserIcon />
                User
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
