import Image from 'next/image';
import React from 'react';

const ICON_CDN = 'https://cdn.simpleicons.org';

type SocialIconProps = {
  slug: string;
  color: string;
  size?: number;
  alt: string;
  className?: string;
};

const SocialIcon = ({ slug, color, size = 18, alt, className }: SocialIconProps) => (
  // eslint-disable-next-line @next/next/no-img-element -- external SVG, no need for next/image optimization
  <img
    src={`${ICON_CDN}/${slug}/${color}`}
    alt={alt}
    width={size}
    height={size}
    loading="lazy"
    className={className}
  />
);

type FooterProps = {
  backgroundImageSrc?: string;
  overlayOpacity?: number;
};

const Footer: React.FC<FooterProps> = ({
  backgroundImageSrc = '/bg-footer.png',
  overlayOpacity = 30,
}) => {
  return (
    <footer className="relative isolate overflow-hidden text-[#eef1f6]">
      <Image
        src={backgroundImageSrc}
        alt=""
        fill
        className="absolute inset-0 z-0 object-cover object-bottom"
      />

      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[#0c2143]"
        style={{ opacity: overlayOpacity / 100 }}
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 py-8 md:px-10">
        {/* ===== Desktop layout ===== */}
        <div className="hidden items-center justify-center gap-7 md:flex">
          <div className="text-center font-['Redzone',sans-serif] text-2xl leading-tight font-black tracking-wide whitespace-nowrap text-[#f3dea0] uppercase">
            <span className="block text-[36px] leading-none tracking-tight">Ganesha</span>
            <span className="block text-[27px] leading-none tracking-tight">Goods</span>
          </div>

          <span className="h-18 w-px bg-[#f3dea0]" />

          <div className="flex flex-col gap-2.5">
            <p className="text-sm leading-relaxed text-white/85">
              For more information, check out our other social media!
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-[13.5px] text-white/85">
                <SocialIcon slug="whatsapp" color="FFFFFF" alt="WhatsApp" className="shrink-0" />
                <span>bit.ly/WA-BU26</span>
              </div>
              <div className="flex items-center gap-2 text-[13.5px] text-white/85">
                <SocialIcon slug="instagram" color="FFFFFF" alt="Instagram" className="shrink-0" />
                <span>@ganeshagoods</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Mobile layout ===== */}
        <div className="flex flex-col items-center gap-4 text-center md:hidden">
          <div className="font-['Redzone',sans-serif] text-xl leading-tight font-black tracking-wide text-[#f3dea0] uppercase">
            <span className="block text-[18px] leading-none tracking-tight">Ganesha</span>
            <span className="block text-[14px] leading-none tracking-tight">Goods</span>
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            <p className="min-w-0 flex-1 text-left font-['Redzone',sans-serif] text-sm leading-tight text-white/85">
              For more information, check out our other social media!
            </p>
            {/* <button
              type="button"
              className="shrink-0 rounded-lg bg-[#f3dea0] px-7 py-2.5 text-sm font-semibold text-[#0c2143] hover:bg-[#f7e8bd]"
            >
              Login
            </button> */}
          </div>

          <hr className="w-full max-w-[300px] border-t border-white/20" />

          <ul className="flex gap-7 text-sm">
            <li>
              <a href="#" className="text-[#eef1f6] hover:text-[#f3dea0]">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-[#eef1f6] hover:text-[#f3dea0]">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-[#eef1f6] hover:text-[#f3dea0]">
                Leaderboard
              </a>
            </li>
          </ul>

          <div className="flex gap-4">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f3dea0]">
              <SocialIcon slug="instagram" color="0C2143" alt="Instagram" size={12} />
            </span>
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f3dea0]">
              <SocialIcon slug="youtube" color="0C2143" alt="YouTube" size={12} />
            </span>
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f3dea0]">
              <SocialIcon slug="x" color="0C2143" alt="X" size={12} />
            </span>
            {/* <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f3dea0]">
              <SocialIcon slug="linkedin" color="0C2143" alt="LinkedIn" size={12} />
            </span> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
