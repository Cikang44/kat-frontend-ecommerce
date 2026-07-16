'use client';

import Image from 'next/image';

const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };
const redzone: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };

const PO_FORM_URL = 'https://forms.gle/uKCZcejVu2FcETyy5';
const CICILAN_FORM_URL = 'https://forms.gle/eSbx2SxM5y7LadHL9';

function ArmDeco() {
  return (
    <>
      {/* Mobile: arm top-left sudut card */}
      <div
        className="pointer-events-none absolute -top-6 -left-8 z-10 md:hidden"
        style={{ transform: 'rotate(340deg)' }}
      >
        <Image
          src="/modal-deco-arm-mobile-v2.webp"
          alt=""
          width={100}
          height={100}
          className="h-auto w-[190px]"
        />
      </div>
      {/* Desktop: arm lama (confirm/otp) di pojok kanan */}
      <div className="pointer-events-none absolute top-4 right-0 z-10 hidden md:block">
        <Image
          src="/modal-deco-arm.webp"
          alt=""
          width={180}
          height={100}
          className="h-auto w-[160px]"
        />
      </div>
    </>
  );
}

function MushroomDeco({ desktopPx = 110 }: { desktopPx?: number }) {
  return (
    <>
      {/* Mobile: gambar baru, bottom-right */}
      <div className="pointer-events-none absolute -right-4 -bottom-3 z-0 md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/modal-deco-mushroom-mobile.webp" alt="" style={{ width: 168, height: 'auto' }} />
      </div>
      {/* Desktop: gambar lama, bottom-left, z-0 supaya di belakang form content */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 hidden md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/modal-deco-mushroom.webp" alt="" style={{ width: desktopPx, height: 'auto' }} />
      </div>
    </>
  );
}

export function MaintenanceModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto w-full max-w-[620px]">
        <div className="relative overflow-hidden rounded-2xl bg-[#D2E1F3] px-4 py-6 md:px-10 md:py-8">
          <ArmDeco />
          <MushroomDeco desktopPx={180} />

          <div className="relative z-10 mb-6 pt-15 text-center md:pt-4">
            <h2
              style={{ ...redzone, fontSize: '30px', lineHeight: '100%', color: '#1B2F53' }}
              className="mb-3 font-black"
            >
              Sedang Pemeliharaan
            </h2>
            <p
              style={{ ...geom, fontWeight: 300, color: '#1B2F53' }}
              className="text-[16px] leading-6 md:text-[18px] md:leading-7"
            >
              Mohon maaf saat ini website sedang dalam tahap pemeliharaan, untuk melakukan PO KIT
              Panitia dilakukan melalui link di bawah
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-3 pb-12 md:flex-row md:pb-6">
            <a
              href={PO_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...geom, backgroundColor: '#1B2F53', color: 'white' }}
              className="w-full rounded-xl px-8 py-2.5 text-center font-semibold md:w-auto"
            >
              Form PO
            </a>
            <a
              href={CICILAN_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...geom, backgroundColor: '#F4FBEC', color: '#1B2F53' }}
              className="w-full rounded-xl px-8 py-2.5 text-center font-semibold md:w-auto"
            >
              Form Pengajuan Cicilan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
