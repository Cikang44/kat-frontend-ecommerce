'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  useProfile,
  useIsAdmin,
  useLogout,
  useResendOtp,
  useVerifyOtp,
  useChangePassword,
} from '@/domains/auth/auth.hooks';

type ProfileField = {
  label: string;
  value: string;
};

type ProfileSection = {
  title: string;
  fields: ProfileField[];
};

type UserProfileLike = {
  name: string;
  nim: string;
  email: string;
  phone: string;
  lineId: string;
  kelompok: string;
  division?: { id: string; name: string; code: string };
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 5 * 60;

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(clamped % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-1 font-['Redzone',sans-serif] text-sm font-bold text-[#1a3a6b] sm:text-base">
      {children}
    </h2>
  );
}

function SectionDivider() {
  return <hr className="mb-2 border-t border-[#1a3a6b]/30" />;
}

function FieldGrid({ fields }: { fields: ProfileField[] }) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3 sm:gap-y-4">
      {fields.map((field) => (
        <div key={field.label} className="flex items-start justify-between sm:block">
          <p className="text-xs font-medium text-[#b5651d] sm:mb-0.5 sm:text-sm">{field.label}</p>
          <p className="text-right text-sm font-medium text-[#1a1a1a] sm:text-left sm:text-base">
            {field.value || '-'}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProfileCard({ sections }: { sections: ProfileSection[] }) {
  return (
    <div className="rounded-2xl bg-white/80 px-6 py-6 shadow-sm backdrop-blur-sm sm:px-8">
      {sections.map((section, i) => (
        <div key={section.title}>
          <SectionTitle>{section.title}</SectionTitle>
          <SectionDivider />
          <FieldGrid fields={section.fields} />
          {i < sections.length - 1 && <div className="mb-2" />}
        </div>
      ))}
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white/80 px-6 py-6 shadow-sm backdrop-blur-sm sm:px-8">
      {[1, 2, 3].map((section) => (
        <div key={section} className="mb-6 last:mb-0">
          <div className="mb-2 h-4 w-32 rounded bg-[#1a3a6b]/20" />
          <div className="mb-4 h-px w-full bg-[#1a3a6b]/10" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
            {[1, 2, 3].map((field) => (
              <div key={field}>
                <div className="mb-2 h-3 w-16 rounded bg-[#1a3a6b]/10" />
                <div className="h-4 w-24 rounded bg-[#1a3a6b]/20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  href,
  onClick,
  fullWidth = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md border border-[#1a3a6b]/40 bg-[#1a3a6b] text-white px-3 py-1.5 text-xs sm:text-sm font-normal transition hover:bg-[#122a50] disabled:opacity-60 disabled:cursor-not-allowed ${
    fullWidth ? 'w-full' : 'w-full sm:w-auto'
  }`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {label}
    </button>
  );
}

// Icons — point these paths at wherever you keep static SVGs (e.g. /public/icons/*.svg)
function KeyIcon() {
  return <Image src="/key.svg" alt="" width={16} height={16} className="shrink-0" />;
}
function ClockIcon() {
  return <Image src="/clock.svg" alt="" width={16} height={16} className="shrink-0" />;
}
function LogoutIcon() {
  return <Image src="/logout.svg" alt="" width={16} height={16} className="shrink-0" />;
}
function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Shared decorative corner assets used by both modal cards
function ModalDecorations() {
  return (
    <>
      <div className="absolute -top-2 right-6 hidden aspect-square w-[18%] sm:block">
        <Image src="/asset_branch.png" alt="" fill className="pointer-events-none object-contain" />
      </div>
      <div className="absolute -bottom-4 left-4 hidden aspect-square w-[18%] sm:block">
        <Image src="/asset_root.png" alt="" fill className="pointer-events-none object-contain" />
      </div>
    </>
  );
}

function ChangePasswordModal({
  email,
  isOpen,
  isSending,
  errorMessage,
  onClose,
  onConfirm,
}: {
  email: string;
  isOpen: boolean;
  isSending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-md bg-[#dbe6f5] px-6 py-8 shadow-xl sm:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-[#1a3a6b]/70 hover:text-[#1a3a6b]"
        >
          <CloseIcon />
        </button>

        <ModalDecorations />

        <div className="relative text-center">
          <h2
            id="change-password-title"
            className="mb-3 font-['Redzone',sans-serif] text-xl font-black text-[#1a3a6b]"
          >
            Ubah Password?
          </h2>
          <p className="text-sm leading-relaxed text-[#1a3a6b]/90">
            Kode OTP akan dikirim ke email
            <br />
            <span className="font-semibold">{email}</span>
            <br />
            untuk verifikasi sebelum mengubah password.
          </p>

          {errorMessage && <p className="mt-3 text-sm font-medium text-red-700">{errorMessage}</p>}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="rounded-md bg-[#f4fbec] px-6 py-2.5 text-sm font-normal text-[#1b2f53] transition hover:brightness-95 disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSending}
              className="rounded-md bg-[#1a3a6b] px-6 py-2.5 text-sm font-normal text-white transition hover:bg-[#122a50] disabled:opacity-60"
            >
              {isSending ? 'Mengirim...' : 'Kirim OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OtpInputs({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? value[i] ?? '');
    onChange(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-14 w-11 rounded-md border border-[#1a3a6b]/30 bg-[#f4fbec] text-center text-xl font-semibold text-[#1a3a6b] transition outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/30 sm:h-16 sm:w-12"
        />
      ))}
    </div>
  );
}

function OtpVerifyModal({
  email,
  isOpen,
  otp,
  onOtpChange,
  secondsLeft,
  onResend,
  isResending,
  isVerifying,
  errorMessage,
  onClose,
  onVerify,
}: {
  email: string;
  isOpen: boolean;
  otp: string[];
  onOtpChange: (next: string[]) => void;
  secondsLeft: number;
  onResend: () => void;
  isResending: boolean;
  isVerifying: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onVerify: () => void;
}) {
  if (!isOpen) return null;

  const isComplete = otp.every((d) => d !== '');
  const canResend = secondsLeft <= 0 && !isResending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-verify-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-md bg-[#dbe6f5] px-6 py-8 shadow-xl sm:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-[#1a3a6b]/70 hover:text-[#1a3a6b]"
        >
          <CloseIcon />
        </button>

        <ModalDecorations />

        <div className="relative text-center">
          <h2
            id="otp-verify-title"
            className="mb-2 font-['Redzone',sans-serif] text-xl font-black text-[#1a3a6b]"
          >
            Masukkan kode OTP
          </h2>
          <p className="mb-1 text-sm leading-relaxed text-[#1a3a6b]/90">
            Kode verifikasi 6 digit telah dikirim ke
          </p>
          <p className="mb-1 text-sm font-semibold text-[#1a3a6b]">{email}</p>
          <p className="mb-6 text-xs text-[#1a3a6b]/70">Cek inbox atau folder spam</p>

          <OtpInputs value={otp} onChange={onOtpChange} />

          {errorMessage && <p className="mt-3 text-sm font-medium text-red-700">{errorMessage}</p>}

          <p className="mt-4 text-xs text-[#1a3a6b]/80">
            Kode berlaku selama <span className="font-semibold">{formatTime(secondsLeft)}</span> ·{' '}
            <button
              type="button"
              onClick={onResend}
              disabled={!canResend}
              className="font-semibold text-[#1a3a6b] transition hover:text-[#b5651d] disabled:cursor-not-allowed disabled:text-[#1a3a6b]/40 disabled:hover:text-[#1a3a6b]/40"
            >
              {isResending ? 'Mengirim...' : 'Kirim ulang'}
            </button>
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-[#f4fbec] px-6 py-2.5 text-sm font-normal text-[#1b2f53] transition hover:brightness-95"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onVerify}
              disabled={!isComplete || isVerifying}
              className="rounded-md bg-[#1a3a6b] px-6 py-2.5 text-sm font-normal text-white transition hover:bg-[#122a50] disabled:opacity-60"
            >
              {isVerifying ? 'Memverifikasi...' : 'Verifikasi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SetNewPasswordModal({
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (nim: string, newPassword: string, confirmPassword: string) => void;
}) {
  const [nim, setNim] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNim('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = nim.trim() !== '' && newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="set-new-password-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-md bg-[#dbe6f5] px-6 py-8 shadow-xl sm:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-[#1a3a6b]/70 hover:text-[#1a3a6b]"
        >
          <CloseIcon />
        </button>

        <ModalDecorations />

        <div className="relative text-center">
          <h2
            id="set-new-password-title"
            className="mb-3 font-['Redzone',sans-serif] text-xl font-black text-[#1a3a6b]"
          >
            Buat Password Baru
          </h2>

          <p className="mb-5 text-sm leading-relaxed text-[#1a3a6b]/90">
            Masukkan password baru untuk akunmu.
          </p>

          <div className="space-y-3 text-left">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1a3a6b]">
                Password Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                className="w-full rounded-md border border-[#1a3a6b]/30 bg-[#f4fbec] px-2.5 py-1.5 text-sm text-[#1a3a6b] transition outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/30"
                placeholder="Tuliskan kata sandi baru"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1a3a6b]">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                className="w-full rounded-md border border-[#1a3a6b]/30 bg-[#f4fbec] px-2.5 py-1.5 text-sm text-[#1a3a6b] transition outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/30"
                placeholder="Tuliskan kembali kata sandi baru"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#1a3a6b]">
                Konfirmasi Akun
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full rounded-md border border-[#1a3a6b]/30 bg-[#f4fbec] px-2.5 py-1.5 text-sm text-[#1a3a6b] transition outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/30"
                placeholder="Tuliskan NIM Anda"
              />
            </div>

            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs font-medium text-red-700">Password tidak cocok</p>
            )}

            {errorMessage && <p className="text-sm font-medium text-red-700">{errorMessage}</p>}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md bg-[#f4fbec] px-6 py-2.5 text-sm font-normal text-[#1b2f53] transition hover:brightness-95 disabled:opacity-60"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => onSubmit(nim, newPassword, confirmPassword)}
              disabled={!canSubmit || isSubmitting}
              className="rounded-md bg-[#1a3a6b] px-6 py-2.5 text-sm font-normal text-white transition hover:bg-[#122a50] disabled:opacity-60"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildMemberSections(profile: UserProfileLike): ProfileSection[] {
  return [
    {
      title: 'Identitas',
      fields: [
        { label: 'Nama', value: profile.name },
        { label: 'NIM', value: profile.nim },
        { label: 'Alamat', value: '' },
      ],
    },
    {
      title: 'Kontak',
      fields: [
        { label: 'Email', value: profile.email },
        { label: 'No.HP', value: profile.phone },
        { label: 'ID Line', value: profile.lineId },
      ],
    },
    {
      title: 'Kelompok / Keluarga (Opsional)',
      fields: [
        { label: 'No. Kelompok', value: profile.kelompok },
        { label: 'Bata', value: '' },
      ],
    },
  ];
}

function buildAdminSections(profile: UserProfileLike): ProfileSection[] {
  return [
    {
      title: 'Identitas',
      fields: [
        { label: 'Nama', value: profile.name },
        { label: 'NIM', value: profile.nim },
        { label: 'Email', value: profile.email },
      ],
    },
    {
      title: 'Fakultas dan Jurusan',
      fields: [
        { label: 'Fakultas', value: profile.division?.code ?? '' },
        { label: 'Jurusan', value: profile.division?.name ?? '' },
      ],
    },
    {
      title: 'Bidang',
      fields: [
        { label: 'Bidang', value: (profile as any).bidang ?? '' },
        { label: 'Divisi', value: (profile as any).divisi ?? '' },
      ],
    },
  ];
}

type ModalStep = 'confirm' | 'otp' | 'newPassword' | null;

export default function Page() {
  const router = useRouter();
  const { data: profile, isLoading, isError, error } = useProfile();
  const { data: adminStatus } = useIsAdmin();
  const logout = useLogout();
  const resendOtp = useResendOtp();
  const verifyOtp = useVerifyOtp();
  const changePassword = useChangePassword();

  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifiedOtpCode, setVerifiedOtpCode] = useState<string | null>(null);

  const [sendOtpError, setSendOtpError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [setPasswordError, setSetPasswordError] = useState<string | null>(null);

  const isAdmin = (adminStatus?.isAdmin ?? false) || profile?.role === 'panitia';

  const sections: ProfileSection[] = profile
    ? isAdmin
      ? buildAdminSections(profile)
      : buildMemberSections(profile)
    : [];

  // Countdown timer, ticks only while the OTP modal is open
  useEffect(() => {
    if (modalStep !== 'otp') return;
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [modalStep, secondsLeft]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push('/login');
      },
    });
  };

  const handleCloseModal = () => {
    setModalStep(null);
    setOtp(Array(OTP_LENGTH).fill(''));
    setSecondsLeft(RESEND_SECONDS);
    setVerifiedOtpCode(null);
    setSendOtpError(null);
    setVerifyError(null);
    setSetPasswordError(null);
  };

  const handleSendOtp = () => {
    if (!profile?.email) return;
    setSendOtpError(null);
    // NOTE: api.resendOtp only knows about `pendingRegistrations` (the
    // signup flow), so this will throw NOT_FOUND for a real logged-in
    // profile until the mock/real API gets a dedicated
    // "send password-change OTP" endpoint for existing users.
    setModalStep('otp');
    // resendOtp.mutate(
    //   { email: profile.email } as any,
    //   {
    //     onSuccess: () => {
    //       setOtp(Array(OTP_LENGTH).fill(""));
    //       setSecondsLeft(RESEND_SECONDS);
    //       setModalStep("otp");
    //     },
    //     onError: (err: any) => {
    //       setSendOtpError(err?.message ?? "Gagal mengirim OTP");
    //     },
    //   }
    // );
  };

  const handleResendOtp = () => {
    if (!profile?.email || secondsLeft > 0) return;
    setVerifyError(null);

    resendOtp.mutate({ email: profile.email } as any, {
      onSuccess: () => {
        setOtp(Array(OTP_LENGTH).fill(''));
        setSecondsLeft(RESEND_SECONDS);
      },
      onError: (err: any) => {
        setVerifyError(err?.message ?? 'Gagal mengirim ulang OTP');
      },
    });
  };

  const handleVerifyOtp = () => {
    if (!profile?.email) return;
    // const code = otp.join("");
    setVerifyError(null);
    // NOTE: api.verifyOtp is the signup-verification endpoint (it also
    // creates a new mock user under the hood). For an existing profile's
    // email this will throw NOT_FOUND until a dedicated password-change
    // OTP verification endpoint exists.

    // verifyOtp gak jalan somehow
    setModalStep('newPassword');
    // verifyOtp.mutate(
    //   { email: profile.email, otp: code } as any,
    //   {
    //     onSuccess: () => {
    //       setVerifiedOtpCode(code);
    //       setModalStep("newPassword");
    //     },
    //     onError: (err: any) => {
    //       setVerifyError(err?.message ?? "Kode OTP salah");
    //     },
    //   }
    // );
  };

  const handleSetNewPassword = (newPassword: string, confirmPassword: string) => {
    setSetPasswordError(null);
    // NOTE: api.changePassword requires `oldPassword`, but this OTP-based
    // reset flow never collects the old password. Passing the verified OTP
    // code through as a stand-in `oldPassword` since the mock accepts any
    // value there — swap this for a real "reset via OTP token" call once
    // the backend supports one.
    changePassword.mutate(
      {
        oldPassword: verifiedOtpCode ?? '',
        newPassword,
        confirmPassword,
      } as any,
      {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: (err: any) => {
          setSetPasswordError(err?.message ?? 'Gagal mengubah password');
        },
      },
    );
  };

  return (
    <div
      className="relative min-h-screen pb-10"
      style={{
        backgroundImage: "url('/bg-desktop-main.png'), url('/warna-bg-desktop.png')",
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <div className="mx-auto max-w-[1000px] px-4 py-6 sm:px-6 sm:py-10">
        {/* Page header: title (+ action buttons on desktop) */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-['Redzone',sans-serif] text-5xl font-black text-[#7a1a1a]">
            Profile
          </h1>
          <div className="hidden flex-wrap gap-2 sm:flex">
            <ActionButton
              icon={<KeyIcon />}
              label="Ubah Password"
              onClick={() => setModalStep('confirm')}
            />
            <ActionButton icon={<ClockIcon />} label="Riwayat Transaksi" href="/history" />
            <ActionButton
              icon={<LogoutIcon />}
              label="Log Out"
              onClick={handleLogout}
              disabled={logout.isPending}
            />
          </div>
        </div>

        {/* Profile card */}
        {isLoading && !profile && <ProfileCardSkeleton />}

        {isError && (
          <div className="rounded-2xl bg-white/80 px-6 py-6 text-sm text-red-700 shadow-sm backdrop-blur-sm sm:px-8">
            Gagal memuat profil{error?.message ? `: ${error.message}` : '.'}
          </div>
        )}

        {profile && <ProfileCard sections={sections} />}

        {/* Action buttons: mobile layout — two-up row, then full-width logout */}
        <div className="mt-6 flex flex-col gap-3 sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              icon={<KeyIcon />}
              label="Ubah Password"
              onClick={() => setModalStep('confirm')}
            />
            <ActionButton icon={<ClockIcon />} label="Riwayat Transaksi" href="/history" />
          </div>
          <ActionButton
            icon={<LogoutIcon />}
            label="Log Out"
            fullWidth
            onClick={handleLogout}
            disabled={logout.isPending}
          />
        </div>
      </div>

      <ChangePasswordModal
        email={profile?.email ?? ''}
        isOpen={modalStep === 'confirm'}
        isSending={resendOtp.isPending}
        errorMessage={sendOtpError}
        onClose={handleCloseModal}
        onConfirm={handleSendOtp}
      />

      <OtpVerifyModal
        email={profile?.email ?? ''}
        isOpen={modalStep === 'otp'}
        otp={otp}
        onOtpChange={setOtp}
        secondsLeft={secondsLeft}
        onResend={handleResendOtp}
        isResending={resendOtp.isPending}
        isVerifying={verifyOtp.isPending}
        errorMessage={verifyError}
        onClose={handleCloseModal}
        onVerify={handleVerifyOtp}
      />

      <SetNewPasswordModal
        isOpen={modalStep === 'newPassword'}
        isSubmitting={changePassword.isPending}
        errorMessage={setPasswordError}
        onClose={handleCloseModal}
        onSubmit={handleSetNewPassword}
      />
    </div>
  );
}
