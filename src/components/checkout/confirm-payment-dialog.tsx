'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfirmPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmPaymentDialogProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // trigger enter animation on next frame
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  function handleTransitionEnd() {
    if (!visible) {
      setMounted(false);
    }
  }

  function handleBackdropClick() {
    onOpenChange(false);
  }

  function handleConfirm() {
    onConfirm();
  }

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      onClick={handleBackdropClick}
      onTransitionEnd={handleTransitionEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-payment-title"
    >
      <div
        className={cn(
          'w-full max-w-sm rounded-xl bg-[#1B2F53] p-6 shadow-xl transition-all duration-200',
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-payment-title"
          className="font-[Redzone] text-center mb-2 text-2xl font-bold text-[#FFF3B8]"
        >
          Lanjutkan ke <br />Pembayaran?
        </h2>

        <p className="font-[Geom] text-center mb-6 text-sm leading-relaxed text-[#FFF3B8]">
          Pastikan pesanan Anda sudah benar. Data pemesanan ini tidak dapat
          diubah setelah pembayaran.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="border border-[#FFF3B8] bg-[#1B2F53] bg- w-full text-[#FFF3B8] py-1 rounded-md font-[Geom] font-medium"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </button>

          <button
            type="button"
            className="bg-[#FFF3B8] w-full text-[#022C3F] py-1 rounded-md hover:bg-[#FFF3B8]/90 font-[Geom] font-medium"
            onClick={handleConfirm}
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
