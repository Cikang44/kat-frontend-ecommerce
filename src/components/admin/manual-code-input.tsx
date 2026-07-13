  "use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const redzone: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };
const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };

interface ManualCodeInputProps {
  onBackToScanner: () => void;
  onSubmitCode: (code: string) => void;
  isLoading?: boolean;
}

export default function ManualCodeInput({
  onBackToScanner,
  onSubmitCode,
  isLoading = false,
}: ManualCodeInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Kode pengambilan tidak boleh kosong");
      return;
    }

    onSubmitCode(code.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center animate-fade-in">
      <div className="flex items-center gap-3 w-full mb-6 text-left">
        <button
          onClick={onBackToScanner}
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#800020] text-white hover:bg-[#600018] transition-colors shadow-sm cursor-pointer"
          aria-label="Kembali ke scan QR"
        >
          <ArrowLeft size={16} color="white" strokeWidth={2} />
        </button>
        <div>
          <h1
            className="text-4xl font-bold text-[#7A213D]"
            style={redzone}
          >
            Input Kode
          </h1>
          <p className="text-sm text-[#7A213D]" style={geom}>
            Masukkan kode pengambilan secara manual
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="w-full relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan kode disini..."
            className="w-full text-center text-xl sm:text-2xl font-bold tracking-wide py-6 px-4 bg-[#f8fafc] text-[#1e3a8a] border-2 border-[#1e3a8a]/30 rounded-2xl shadow-inner focus:outline-none focus:border-[#1e3a8a] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-lg"
            style={redzone}
          />
          {error && (
            <p
              className="text-sm text-red-500 mt-2 text-center font-medium animate-shake"
              style={geom}
            >
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-[420px] bg-[#1e3a8a] text-[#FFF3B8] py-5 rounded-xl font-semibold text-center hover:bg-[#1e40af] disabled:bg-gray-400 transition-colors shadow-md cursor-pointer"
          style={geom}
        >
          {isLoading ? "Memproses..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}