import Image from 'next/image';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 w-screen overflow-hidden">
        <div className="fixed inset-0 top-0 left-0 flex h-screen shrink-0 items-center justify-center overflow-hidden md:hidden">
          <Image
            src="/warna-bg-mobile.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <Image
            src="/bg-mobile-main.png"
            alt=""
            fill
            className="object-cover object-left-top"
            priority
          />
        </div>

        {/* Desktop: illustration left panel (hidden on mobile) */}
        <div className="fixed inset-0 top-0 left-0 hidden h-full overflow-hidden md:flex md:w-screen">
          <Image
            src="/warna-bg-desktop.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
          />
          <Image
            src="/bg-desktop-main.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-left"
            priority
          />
        </div>
      </div>
      <Navbar />
      <div className="z-1 min-h-[calc(100vh-232.5px-41px)] md:min-h-[calc(100vh-136px-50px)]">
        {children}
      </div>
      <Footer />
    </>
  );
}
