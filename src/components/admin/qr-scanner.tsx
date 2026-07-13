"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";

const redzone: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };
const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };

interface QrScannerProps {
  onScanSuccess: (token: string) => void;
  onManualInput: () => void;
}

export default function QrScanner({ onScanSuccess, onManualInput }: QrScannerProps) {
  const [modalState, setModalState] = useState<"idle" | "success" | "error">("idle");
  const [isScanning, setIsScanning] = useState(true);
  const [scannedText, setScannedText] = useState("");

  const handleScan = (text: string) => {
    if (text) {
      setIsScanning(false);
      setScannedText(text);
      setModalState("success");
    }
  };

  const handleError = (error: any) => {
    console.error("QR Scanner Error:", error);
    setIsScanning(false);
    setModalState("error");
  };

  const resetScanner = () => {
    setScannedText("");
    setModalState("idle");
    setIsScanning(true);
  };

  const handleLanjutHandover = () => {
    onScanSuccess(scannedText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div className="text-left w-full mb-4">
        <h1
          className="text-5xl font-bold text-[#7A213D]"
          style={redzone}
        >
          Scan QR
        </h1>
        <p className="text-sm text-[#7A213D]" style={geom}>
          Scan QR melalui kamera di bawah ini
        </p>
      </div>

      <div className="relative w-full aspect-[16/9] max-w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-700/50">
        {isScanning && (
          <div className="w-full h-full relative">
            <Scanner
              onScan={(detectedCodes) => {
                if (detectedCodes && detectedCodes.length > 0) {
                  handleScan(detectedCodes[0].rawValue);
                }
              }}
              onError={handleError}
              scanDelay={300}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { objectFit: "cover", width: "100%", height: "100%" }
              }}
            />

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 border-2 border-white/40 rounded-xl overflow-hidden">
                <div className="w-full h-[2px] bg-yellow-500 absolute top-1/2 left-0 animate-pulse" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />
              </div>
            </div>
          </div>
        )}

        {modalState === "error" && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#5c1d33] text-white rounded-2xl p-6 w-full max-w-xs sm:max-w-sm text-center shadow-2xl relative border border-red-900 overflow-hidden">
              <button
                onClick={resetScanner}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-xl z-10 cursor-pointer"
                style={geom}
              >
                ✕
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#5c1d33] text-3xl font-bold relative z-10">
                ✕
              </div>
              <h3
                className="text-[30px] font-bold mb-2 relative z-10"
                style={{ ...redzone, color: '#F9F6F3' }}
              >
                Scan Gagal!
              </h3>
              <p className="text-sm text-[#F9F6F3] mb-6 leading-relaxed relative z-10" style={geom}>
                Mohon maaf, QR tidak dapat ditemukan.
              </p>
              <div className="flex gap-3 justify-center relative z-10">
                <Button
                  onClick={resetScanner}
                  className="bg-transparent border border-white text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 cursor-pointer z-1"
                  style={geom}
                >
                  Scan Ulang
                </Button>
                <Button
                  onClick={onManualInput}
                  className="bg-white text-[#5c1d33] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 cursor-pointer"
                  style={geom}
                >
                  Gunakan Kode
                </Button>
              </div>
              <div className="absolute top-30 right-40 pointer-events-none w-[230px] h-[184px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static decoration */}
                <img
                  src="/confirmation_decoration.webp"
                  alt=""
                  className="w-full h-full object-contain scale-x-[-1] rotate-5 translate-x-[-20%] translate-y-[20%]"
                />
              </div>
            </div>
          </div>
        )}

        {modalState === "success" && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#1e2d4a] text-white rounded-2xl p-6 w-full max-w-xs sm:max-w-sm text-center shadow-2xl relative border border-blue-900 overflow-hidden">
              <button
                onClick={resetScanner}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-xl z-10 cursor-pointer"
                style={geom}
              >
                ✕
              </button>
              <div className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl relative z-10">
                ✓
              </div>
              <h3
                className="text-xl font-bold mb-2 relative z-10"
                style={{ ...redzone, color: '#FFF3B8' }}
              >
                Scan Berhasil!
              </h3>
              <p className="text-sm text-white/80 mb-6 leading-relaxed relative z-10" style={geom}>
                QR berhasil terbaca. Anda dapat melanjutkan proses.
              </p>
              <Button
                onClick={handleLanjutHandover}
                className="w-full bg-[#fde047] text-[#1e2d4a] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#facc15] relative z-10 cursor-pointer"
                style={geom}
              >
                Lanjut Handover
              </Button>
              <div className="absolute top-30 right-40 pointer-events-none w-[230px] h-[184px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static decoration */}
                <img
                  src="/confirmation_decoration.webp"
                  alt=""
                  className="w-full h-full object-contain scale-x-[-1] rotate-5 translate-x-[-20%] translate-y-[20%]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-6">
        <Button
          onClick={onManualInput}
          className="w-full bg-[#1e3a8a] text-[#FFF3B8] py-3 rounded-xl font-semibold text-center hover:bg-[#1e40af] transition-colors cursor-pointer shadow-md"
          style={geom}
        >
          Coba dengan Input Kode
        </Button>
      </div>
    </div>
  );
}
