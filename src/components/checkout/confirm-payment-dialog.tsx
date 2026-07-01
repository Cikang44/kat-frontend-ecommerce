'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
          'w-full max-w-sm rounded-xl bg-[#022C3F] p-6 shadow-xl transition-all duration-200',
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-payment-title"
          className="font-[Redzone] mb-2 text-lg font-bold text-white"
        >
          Lanjutkan ke Pembayaran?
        </h2>

        <p className="font-[Geom] mb-6 text-sm leading-relaxed text-white/70">
          Pastikan pesanan Anda sudah benar. Data pemesanan ini tidak dapat
          diubah setelah pembayaran.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="font-[Geom] cursor-pointer text-sm text-white/60 underline-offset-2 hover:text-white/90 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </button>

          <Button
            type="button"
            className="bg-[#FFE788] text-[#022C3F] hover:bg-[#FFE788]/90 font-[Geom] font-medium"
            onClick={handleConfirm}
          >
            Bayar
          </Button>
        </div>
      </div>
    </div>
  );
}
