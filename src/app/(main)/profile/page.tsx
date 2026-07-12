'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useProfile, useLogout, useChangePassword } from '@/domains/auth/auth.hooks';
import {
  PASSWORD_RULE_HINT,
  passwordChangeReady,
  validateNewPassword,
} from '@/domains/auth/password-policy';
import type { UserProfile } from '@/api/types.gen';

type ProfileField = {
  label: string;
  value: string;
};

type ProfileSection = {
  title: string;
  fields: ProfileField[];
};

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

// Shared decorative corner assets used by the modal card
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

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: 'current-password' | 'new-password';
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[#1a3a6b]">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-md border border-[#1a3a6b]/30 bg-[#f4fbec] px-2.5 py-1.5 pr-10 text-sm text-[#1a3a6b] transition outline-none focus:border-[#1a3a6b] focus:ring-2 focus:ring-[#1a3a6b]/30"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-semibold text-[#1a3a6b]/70 hover:text-[#1a3a6b]"
        >
          {show ? 'Sembunyikan' : 'Lihat'}
        </button>
      </div>
    </div>
  );
}

/**
 * Change-password modal (panitia/admin only). Collects the current password
 * plus a new password + confirmation and calls POST /auth/change-password.
 * Client validation mirrors the backend policy; the backend stays authoritative.
 */
function ChangePasswordModal({
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
  onSubmit: (oldPassword: string, newPassword: string, confirmPassword: string) => void;
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const newPasswordCheck = validateNewPassword(newPassword);
  const canSubmit = passwordChangeReady({ oldPassword, newPassword, confirmPassword });

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
            Ubah Password
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-[#1a3a6b]/90">
            Masukkan password saat ini dan password baru untuk akunmu.
          </p>

          <div className="space-y-3 text-left">
            <PasswordField
              label="Password Saat Ini"
              value={oldPassword}
              onChange={setOldPassword}
              autoComplete="current-password"
              placeholder="Password saat ini"
            />
            <PasswordField
              label="Password Baru"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              placeholder="Password baru"
            />
            <PasswordField
              label="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              placeholder="Ulangi password baru"
            />

            <p className="text-xs text-[#1a3a6b]/70">{PASSWORD_RULE_HINT}</p>

            {newPassword.length > 0 && !newPasswordCheck.ok && (
              <p className="text-xs font-medium text-red-700">{newPasswordCheck.message}</p>
            )}
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
              onClick={() => onSubmit(oldPassword, newPassword, confirmPassword)}
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

function buildMemberSections(profile: UserProfile): ProfileSection[] {
  return [
    {
      title: 'Identitas',
      fields: [{ label: 'Nama', value: profile.name ?? '' }],
    },
    {
      title: 'Kontak',
      fields: [
        { label: 'Email', value: profile.email ?? '' },
        { label: 'No. HP', value: profile.phone ?? '' },
        { label: 'ID Line', value: profile.lineId ?? '' },
      ],
    },
    {
      title: 'Kelompok / Keluarga (Opsional)',
      fields: [{ label: 'No. Kelompok', value: profile.kelompok ?? '' }],
    },
  ];
}

function buildPanitiaSections(profile: UserProfile): ProfileSection[] {
  return [
    {
      title: 'Identitas',
      fields: [
        { label: 'Nama', value: profile.name ?? '' },
        { label: 'NIM', value: profile.nim ?? '' },
        { label: 'Email', value: profile.email ?? '' },
      ],
    },
    {
      title: 'Kontak',
      fields: [
        { label: 'No. HP', value: profile.phone ?? '' },
        { label: 'ID Line', value: profile.lineId ?? '' },
      ],
    },
    {
      title: 'Bidang',
      fields: [
        { label: 'Bidang', value: profile.division?.name ?? '' },
        { label: 'Kode', value: profile.division?.code ?? '' },
      ],
    },
  ];
}

export default function Page() {
  const router = useRouter();
  const { data: profile, isLoading, isError, error } = useProfile();
  const logout = useLogout();
  const changePassword = useChangePassword();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  // panitia/admin authenticate with a password; umum sign in via Google and
  // have no password to change, so the action is hidden for them.
  const canChangePassword = profile?.role === 'panitia' || profile?.role === 'admin';

  const sections: ProfileSection[] = profile
    ? profile.role === 'umum'
      ? buildMemberSections(profile)
      : buildPanitiaSections(profile)
    : [];

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
    });
  };

  const openChangePassword = () => {
    setChangePasswordError(null);
    setIsModalOpen(true);
  };

  const closeChangePassword = () => {
    setIsModalOpen(false);
    setChangePasswordError(null);
  };

  const handleChangePassword = (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    setChangePasswordError(null);
    changePassword.mutate(
      { oldPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          // The backend revokes all refresh tokens on a password change, so end
          // this session too and send the user back to login to re-authenticate.
          setIsModalOpen(false);
          logout.mutate(undefined, {
            onSettled: () => router.replace('/login?passwordChanged=1'),
          });
        },
        onError: (err) => {
          setChangePasswordError(err?.message ?? 'Gagal mengubah password');
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
            {canChangePassword && (
              <ActionButton icon={<KeyIcon />} label="Ubah Password" onClick={openChangePassword} />
            )}
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

        {/* Action buttons: mobile layout */}
        <div className="mt-6 flex flex-col gap-3 sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {canChangePassword && (
              <ActionButton icon={<KeyIcon />} label="Ubah Password" onClick={openChangePassword} />
            )}
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
        isOpen={isModalOpen}
        isSubmitting={changePassword.isPending || logout.isPending}
        errorMessage={changePasswordError}
        onClose={closeChangePassword}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
