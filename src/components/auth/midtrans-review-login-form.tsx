'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/domains/auth/auth.hooks';

export function MidtransReviewLoginForm() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: (result) => {
          if (result.onboardingRequired) {
            router.push('/onboarding');
          } else {
            router.push('/products');
          }
        },
      },
    );
  }

  return (
    <div className="w-full max-w-md">
      <h1
        style={{ fontFamily: "'Redzone', sans-serif" }}
        className="mb-2 text-center text-[59px] leading-none font-black text-[#FFE788]"
      >
        Sign In
      </h1>
      <p
        style={{ fontFamily: "'Geom', sans-serif" }}
        className="mb-8 text-center text-sm text-white/70"
      >
        Reviewer access only
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
