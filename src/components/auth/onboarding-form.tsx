'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/domains/auth/auth.context';

type Role = 'umum' | 'panitia';

const radioSelected: React.CSSProperties = {
  border: '10px solid #38578D',
  backgroundColor: 'transparent',
  boxShadow: '0px 0px 4px 5px #D2E1F33D',
};

const radioUnselected: React.CSSProperties = {
  border: '3px solid #7A94D4',
  backgroundColor: '#FFFFFF',
};

export function OnboardingForm() {
  const router = useRouter();
  const existingUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [role, setRole] = useState<Role | null>(null);
  const [nim, setNim] = useState('');
  const [divisionCode, setDivisionCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) return;

    setIsSubmitting(true);

    setUser({
      id: existingUser?.id ?? `usr-${Date.now()}`,
      name: existingUser?.name ?? 'User',
      email: existingUser?.email ?? '',
      role,
      isOnboardingComplete: true,
    });

    router.push('/products');
  }

  return (
    <div className="w-full max-w-md">
      <h1
        style={{ fontFamily: "'Redzone', sans-serif" }}
        className="mb-8 text-center text-[48px] leading-none font-black text-[#FFE788]"
      >
        Apa peranmu?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selection */}
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3" onClick={() => setRole('umum')}>
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full transition-all"
              style={role === 'umum' ? radioSelected : radioUnselected}
            >
              {role === 'umum' && <div className="size-2 rounded-full bg-white" />}
            </div>
            <span className="text-white">Massa Umum/Peserta</span>
          </label>

          <label
            className="flex cursor-pointer items-center gap-3"
            onClick={() => setRole('panitia')}
          >
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full transition-all"
              style={role === 'panitia' ? radioSelected : radioUnselected}
            >
              {role === 'panitia' && <div className="size-2 rounded-full bg-white" />}
            </div>
            <span className="text-white">Panitia</span>
          </label>
        </div>

        {/* Extra fields for panitia */}
        {role === 'panitia' && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-white">
                NIM<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="NIM"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
                className="border-transparent bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-300 focus-visible:ring-blue-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-white">
                Kode Bidang<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Kode Bidang"
                value={divisionCode}
                onChange={(e) => setDivisionCode(e.target.value)}
                required
                className="border-transparent bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-300 focus-visible:ring-blue-200"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={!role || isSubmitting}
            style={{
              fontFamily: "'Redzone', sans-serif",
              ...(role
                ? {}
                : {
                    backgroundColor: '#F9F6F3',
                    borderColor: '#F9F6F3',
                    border: '1.85px solid #F9F6F3',
                    color: '#7B7B7B',
                  }),
            }}
            className={`w-full font-black transition-colors ${
              role ? 'bg-[#FFE788] text-[#133B79] hover:bg-[#f5dd6a]' : 'cursor-not-allowed'
            }`}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
