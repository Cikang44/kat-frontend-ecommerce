'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Step = 'confirm' | 'otp' | 'change';

interface Props {
  email: string;
  onClose: () => void;
}

const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };
const redzone: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };

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

export function ForgotPasswordModal({ email, onClose }: Props) {
  const [step, setStep] = useState<Step>('confirm');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(272);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [nim, setNim] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const displayEmail = email || 'Nama@mahasiswa.itb.ac.id';

  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, timeLeft]);

  function fmt(s: number) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    setOtp((prev) => {
      const n = [...prev];
      n[i] = val;
      return n;
    });
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mx-auto w-full max-w-[620px]">
        <div className="relative overflow-hidden rounded-2xl bg-[#D2E1F3] px-4 py-6 md:px-10 md:py-8">
          {/* Close button */}
          <button
            onClick={onClose}
            style={geom}
            className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center text-lg font-bold text-[#1B2F53] hover:opacity-60"
          >
            ✕
          </button>

          {step !== 'change' && <ArmDeco />}
          {step === 'change' && (
            <div
              className="pointer-events-none absolute -top-12 right-14 z-10 hidden md:block"
              style={{ transform: 'rotate(32deg)' }}
            >
              <Image
                src="/modal-deco-ranting-change-v2.webp"
                alt=""
                width={180}
                height={180}
                className="h-auto w-[200px]"
              />
            </div>
          )}

          {/* ─── STEP: confirm ─── */}
          {step === 'confirm' && (
            <>
              <MushroomDeco desktopPx={180} />
              <div className="relative z-10 mb-5 pt-15 text-center md:pt-4">
                <h2
                  style={{ ...redzone, fontSize: '30px', lineHeight: '100%', color: '#1B2F53' }}
                  className="mb-3 font-black"
                >
                  Ubah Password?
                </h2>
                <p
                  style={{ ...geom, fontWeight: 300, color: '#1B2F53' }}
                  className="text-[16px] leading-6 md:text-[18px] md:leading-7"
                >
                  Kode OTP akan dikirim ke email
                </p>
                <p
                  style={{ ...geom, fontWeight: 700, color: '#1B2F53' }}
                  className="text-[16px] leading-6 md:text-[18px] md:leading-7"
                >
                  {displayEmail}
                </p>
                <p
                  style={{ ...geom, fontWeight: 300, color: '#1B2F53' }}
                  className="text-[16px] leading-6 md:text-[18px] md:leading-7"
                >
                  untuk verifikasi sebelum mengubah password.
                </p>
              </div>

              <div className="relative z-10 flex justify-center gap-3 pb-12 md:pb-6">
                <button
                  onClick={onClose}
                  style={{ ...geom, backgroundColor: '#F4FBEC', color: '#1B2F53' }}
                  className="rounded-xl px-8 py-2.5 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={() => setStep('otp')}
                  style={{ ...geom, backgroundColor: '#1B2F53', color: 'white' }}
                  className="rounded-xl px-8 py-2.5 font-semibold"
                >
                  Kirim OTP
                </button>
              </div>
            </>
          )}

          {/* ─── STEP: otp ─── */}
          {step === 'otp' && (
            <>
              <MushroomDeco desktopPx={180} />
              <div className="relative z-10">
                <div className="mb-4 pt-16 text-center md:pt-4">
                  <h2
                    style={{ ...redzone, fontSize: '30px', lineHeight: '100%', color: '#1B2F53' }}
                    className="mb-3 font-black"
                  >
                    Masukkan kode OTP
                  </h2>
                  <p
                    style={{ ...geom, fontWeight: 300, color: '#1B2F53' }}
                    className="text-[16px] leading-6 md:text-[18px] md:leading-7"
                  >
                    Kode verifikasi 6 digit telah dikirim ke
                  </p>
                  <p
                    style={{ ...geom, fontWeight: 700, color: '#1B2F53' }}
                    className="text-[16px] leading-6 md:text-[18px] md:leading-7"
                  >
                    {displayEmail}
                  </p>
                  <p
                    style={{ ...geom, fontWeight: 300, color: '#1B2F53' }}
                    className="text-[16px] leading-6 md:text-[18px] md:leading-7"
                  >
                    Cek inbox atau folder spam
                  </p>
                </div>

                {/* OTP boxes */}
                <div className="mb-4 flex justify-center gap-2 md:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      style={{
                        ...geom,
                        fontWeight: 400,
                        color: '#1B2F53',
                        backgroundColor: '#F4FBEC',
                        border: '2px solid #1B2F53',
                        textAlign: 'center',
                      }}
                      className="h-10 w-9 rounded-lg text-lg md:h-16 md:w-14 md:text-2xl"
                    />
                  ))}
                </div>

                {/* Timer: single line desktop, "Kirim ulang" baris baru di mobile */}
                <div className="mb-4 text-center" style={{ ...geom, color: '#1B2F53' }}>
                  <p className="text-[14px] leading-6">
                    Kode berlaku selama <span style={{ fontWeight: 800 }}>{fmt(timeLeft)}</span>
                    <span className="hidden md:inline"> · </span>
                    <span className="hidden md:inline">
                      <button
                        type="button"
                        onClick={() => setTimeLeft(272)}
                        style={{ color: '#774C26' }}
                        className="hover:underline"
                      >
                        Kirim ulang
                      </button>
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setTimeLeft(272)}
                    style={{ ...geom, color: '#774C26', fontSize: '14px' }}
                    className="hover:underline md:hidden"
                  >
                    Kirim ulang
                  </button>
                </div>

                <div className="flex justify-center gap-3 pb-12 md:pb-6">
                  <button
                    onClick={() => setStep('confirm')}
                    style={{ ...geom, backgroundColor: '#F4FBEC', color: '#1B2F53' }}
                    className="rounded-xl px-8 py-2.5 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setStep('change')}
                    style={{ ...geom, backgroundColor: '#1B2F53', color: 'white' }}
                    className="rounded-xl px-8 py-2.5 font-semibold"
                  >
                    Verifikasi
                  </button>
                </div>
              </div>
              {/* end relative z-10 */}
            </>
          )}

          {/* ─── STEP: change password ─── */}
          {step === 'change' && (
            <>
              <MushroomDeco desktopPx={160} />
              <div className="relative z-10">
                <h2
                  style={{ ...redzone, color: '#1B2F53' }}
                  className="mb-5 pt-2 text-[30px] leading-none font-black md:text-[40px]"
                >
                  Ubah Password
                </h2>

                <div className="relative z-10 mb-5 space-y-3">
                  {(
                    [
                      {
                        label: 'Password Baru',
                        placeholder: 'Tuliskan kata sandi baru',
                        value: newPass,
                        setter: setNewPass,
                        type: 'password',
                      },
                      {
                        label: 'Konfirmasi Password',
                        placeholder: 'Tuliskan kembali kata sandi baru',
                        value: confirmPass,
                        setter: setConfirmPass,
                        type: 'password',
                      },
                      {
                        label: 'Konfirmasi Akun',
                        placeholder: 'Tuliskan NIM Anda',
                        value: nim,
                        setter: setNim,
                        type: 'text',
                      },
                    ] as const
                  ).map(({ label, placeholder, value, setter, type }) => (
                    <div key={label} className="space-y-1">
                      <label
                        style={{ ...geom, fontWeight: 400, color: '#1B2F53' }}
                        className="block text-[14px] leading-5 md:text-[16px]"
                      >
                        {label} <span style={{ color: '#7A213D' }}>*</span>
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        style={{
                          ...geom,
                          fontWeight: 400,
                          backgroundColor: '#F4FBEC',
                          border: '1px solid #7A94D4',
                          borderRadius: '10px',
                          color: '#1B2F53',
                          padding: '10px 12px',
                        }}
                        className="w-full text-[14px] placeholder:text-[#7A94D4] focus:ring-1 focus:ring-[#7A94D4] focus:outline-none md:text-[16px]"
                      />
                    </div>
                  ))}
                </div>

                {/* Mobile: stacked (Ubah Password atas, Batal bawah) | Desktop: side by side */}
                <div className="flex flex-col gap-3 pb-4 md:flex-row md:justify-end md:pb-2">
                  <button
                    onClick={onClose}
                    style={{ ...geom, backgroundColor: '#1B2F53', color: 'white' }}
                    className="order-1 w-full rounded-xl py-2.5 font-semibold md:order-2 md:w-auto md:px-8"
                  >
                    Ubah Password
                  </button>
                  <button
                    onClick={onClose}
                    style={{ ...geom, backgroundColor: '#F4FBEC', color: '#1B2F53' }}
                    className="order-2 w-full rounded-xl py-2.5 font-semibold md:order-1 md:w-auto md:px-8"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
