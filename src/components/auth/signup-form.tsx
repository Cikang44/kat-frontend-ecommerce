'use client';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignup } from '@/domains/auth/auth.hooks';

export function SignupForm() {
  const router = useRouter();
  const { mutate: signup, isPending, error } = useSignup();

  const [name, setName] = useState('');
  const [kontak, setKontak] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signup(
      { name, email, password },
      {
        onSuccess: () => {
          router.push('/onboarding');
        },
      },
    );
  }

  return (
    <div className="w-full max-w-md">
      <h1
        style={{ fontFamily: "'Redzone', sans-serif" }}
        className="mb-8 text-center text-[59px] leading-none font-black text-[#FFE788]"
      >
        Sign Up
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-white">
            Nama<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-transparent bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-300 focus-visible:ring-blue-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-white">
            Kontak<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="ID Line/Nomor WhatsApp (contoh: oskm2026/08xx)"
            value={kontak}
            onChange={(e) => setKontak(e.target.value)}
            className="border-transparent bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-300 focus-visible:ring-blue-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-white">
            Email<span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-transparent bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-300 focus-visible:ring-blue-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-white">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-transparent bg-white pr-10 text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-300 focus-visible:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error.message}</p>}

        <Button
          type="submit"
          disabled={isPending}
          style={{ fontFamily: "'Redzone', sans-serif" }}
          className="w-full border-transparent bg-[#FFE788] font-black text-[#022C3F] hover:bg-[#f5dd6a] disabled:opacity-70"
        >
          {isPending ? 'Signing up...' : 'Sign Up'}
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-xs text-white/40">or</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <Button
          type="button"
          disabled
          style={{ fontFamily: "'Redzone', sans-serif" }}
          className="w-full cursor-not-allowed border-transparent bg-white font-black text-[#022C3F] opacity-50"
        >
          <svg className="mr-2 size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign Up with Google
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-extrabold text-[#FFE788] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
