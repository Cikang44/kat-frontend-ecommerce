'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ShoppingCartLinear } from 'vuesax-icon-pack';

import { useIsAdmin } from '@/domains/auth/auth.hooks';
import { useCartTotalQuantity } from '@/domains/cart/cart.hooks';
import { useAuthStore } from '@/lib/providers';
import { cn } from '@/lib/utils';

type NavLink = {
  label: string;
  href: string;
  adminOnly?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Product List', href: '/products' },
  { label: 'Item', href: '/admin/dashboard-item', adminOnly: true },
  { label: 'Transaction', href: '/admin/dashboard-transaction', adminOnly: true },
  { label: 'Hand Over', href: '/admin/hand-over', adminOnly: true },
];

function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function CartIcon() {
  return <ShoppingCartLinear className="h-5 w-5" />;
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

function LoginIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H8" />
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

function AuthLinks({ isLoggedIn, onNavigate }: { isLoggedIn: boolean; onNavigate?: () => void }) {
  const totalQuantity = useCartTotalQuantity();
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-full bg-[#fff3b8] px-5 py-2 text-sm font-bold text-[#022c3f] hover:bg-[#f7e8bd]"
      >
        <LoginIcon />
        Login
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/cart"
        onClick={onNavigate}
        aria-label="Cart"
        className="flex items-center gap-2 text-[#fff3b8] hover:text-[#f7e8bd]"
      >
        <span className="text-sm font-semibold">{totalQuantity}</span>
        <CartIcon />
      </Link>
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-full border border-[#fff3b8]/50 px-4 py-1.5 text-sm font-semibold text-[#fff3b8] hover:bg-white/5"
      >
        <UserIcon />
        User
      </Link>
    </>
  );
}

type NavbarProps = {
  mobileMenuBgSrc?: string;
  mobileMenuOverlayOpacity?: number;
};

function Navbar({ mobileMenuBgSrc = '/bg-footer.png', mobileMenuOverlayOpacity = 0 }: NavbarProps) {
  const pathname = usePathname() ?? '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { data: adminData } = useIsAdmin();
  const isAdmin = adminData?.isAdmin ?? false;

  const visibleLinks = NAV_LINKS.filter((link) => !link.adminOnly || isAdmin);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="sticky top-4 z-50 mx-4 md:mx-8">
      <nav className="mx-auto max-w-[1180px] rounded-2xl border-0 bg-[#022c3f] md:border md:border-[#fff3b8]">
        <div className="flex items-center justify-between gap-2 px-4 py-3 md:gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="px-4 text-center font-['Redzone',sans-serif] text-lg leading-tight font-black tracking-wide whitespace-nowrap text-[#fff3b8] uppercase"
            onClick={() => setMobileOpen(false)}
          >
            <span className="block text-[22px] leading-none tracking-tight">Ganesha</span>
            <span className="block text-[15px] leading-none tracking-tight">Goods</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 text-lg font-semibold md:flex">
            {visibleLinks.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-disabled={link.href !== '/products'}
                    className={cn(
                      active ? 'text-white/40' : 'text-white transition hover:text-white/70',
                      'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:text-white/30',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right side: cart + user, or Login when logged out */}
          <div className="hidden items-center gap-4 md:flex">
            <AuthLinks isLoggedIn={isLoggedIn} />
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
              {visibleLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={active ? 'text-white/40' : 'text-white'}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Pushes the bottom row to the bottom of the screen */}
            <div className="flex-1" />

            {/* Bottom row: cart + user, or Login when logged out */}
            <div className="flex items-center justify-center gap-6 border-t border-[#fff3b8]/20 px-6 py-6">
              <AuthLinks isLoggedIn={isLoggedIn} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
