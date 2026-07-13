'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ManualCodeInput from '@/components/admin/manual-code-input';
import HandoverDetailView from '@/components/admin/handover-detail-view';

const QrScanner = dynamic(
  () => import('@/components/admin/qr-scanner').then((mod) => mod.default),
  { ssr: false }
);

export default function HandOverPage() {
  const [viewMode, setViewMode] = useState<'scan' | 'manual' | 'detail'>('scan');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScanSuccess = (token: string) => {
    setSelectedOrderId(token);
    setViewMode('detail');
  };

  const handleManualCodeSubmit = async (code: string) => {
    setIsSubmitting(true);
    try {
      setSelectedOrderId(code);
      setViewMode('detail');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToScanner = () => {
    setSelectedOrderId('');
    setViewMode('scan');
  };

  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        {viewMode === 'scan' && (
          <QrScanner
            onScanSuccess={handleScanSuccess}
            onManualInput={() => setViewMode('manual')}
          />
        )}

        {viewMode === 'manual' && (
          <ManualCodeInput
            onBackToScanner={handleBackToScanner}
            onSubmitCode={handleManualCodeSubmit}
            isLoading={isSubmitting}
          />
        )}

        {viewMode === 'detail' && (
          <HandoverDetailView
            qrToken={selectedOrderId}
            onBack={handleBackToScanner}
          />
        )}
      </div>
    </div>
  );
}
