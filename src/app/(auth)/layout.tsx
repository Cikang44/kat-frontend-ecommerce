import Image from 'next/image';

const redzoneStyle: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile: illustration top panel (hidden on desktop) */}
      <div className="relative flex h-[40vh] shrink-0 items-center justify-center overflow-hidden md:hidden">
        <Image src="/warna-bg-mobile.png" alt="" fill className="object-cover" priority />
        <Image src="/bg-mobile.png" alt="" fill className="object-cover object-left-top" priority />
        <div className="relative z-10 text-center" style={redzoneStyle}>
          <div className="text-[18vw] leading-none font-black text-black">OSKM</div>
          <div className="text-[8.8vw] leading-tight font-black text-black">2026</div>
        </div>
      </div>

      {/* Desktop: illustration left panel (hidden on mobile) */}
      <div className="relative hidden overflow-hidden md:flex md:w-[35%]">
        <Image
          src="/warna-bg-desktop.png"
          alt=""
          fill
          sizes="35vw"
          className="object-cover"
          priority
        />
        <Image
          src="/bg-desktop.png"
          alt=""
          fill
          sizes="35vw"
          className="object-cover object-left"
          priority
        />
        <div
          className="absolute top-[23%] left-24 z-10 text-center lg:left-30 xl:left-27"
          style={redzoneStyle}
        >
          <div className="text-[65px] leading-none font-black text-black lg:text-[80px] xl:text-[123px]">
            OSKM
          </div>
          <div className="text-[32px] leading-tight font-black text-black lg:text-[36px] xl:text-[60px]">
            2026
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#133B79] px-8 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:w-[65%] md:px-16 lg:px-24">
        {children}
      </div>
    </div>
  );
}
