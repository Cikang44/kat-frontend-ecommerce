"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DashboardItemTable } from "@/components/admin/dashboard-item-table";
import { SearchFilterPanel } from "@/components/admin/dashboard-item-search-filter";
import { useDashboardStats } from "@/domains/admin/admin.hooks";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

function StatCard({ icon, label, value, className = "" }: StatCardProps) {
  return (
    <div
      className={`flex flex-1 items-center gap-2 rounded-lg bg-[#133B79] px-5 py-4 sm:gap-4 sm:px-6 sm:py-5 ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F4E4B8]">
        {icon}
      </div>
      <div>
        <p className="text-xs text-white sm:text-sm">{label}</p>
        <p className="text-xl font-['Redzone',sans-serif] font-semibold text-[#EFDD8D] sm:text-xl">{value}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const faculty = searchParams.get("faculty") ?? undefined;
  const category = searchParams.get("type") ?? undefined;

  const { totalProduk, totalItemTerjual, totalPendapatan } = useDashboardStats();

  const handleExportCsv = () => {
    // Hook up to the real export endpoint when it's ready.
    console.log("Export CSV requested");
  };

  return (
    <div
      style={{
        backgroundImage: `url('/bg-desktop-main.webp'), url('/warna-bg-mobile.webp')`,
        backgroundSize: "contain, cover",
        backgroundPosition: "top center, center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-['Redzone',sans-serif] text-3xl text-[#022C3F] sm:text-[#7A1E2B] sm:text-4xl">Item</h1>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-lg bg-[#F4E4B8] px-4 py-2 text-sm font-semibold text-[#0B1F3A] shadow-sm ring-1 ring-[#0B1F3A]/10 transition hover:brightness-95 sm:px-5"
          >
            <Image src="/icons/download.svg" alt="" width={16} height={16} aria-hidden />
            Eksport CSV
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Image src="/icons/box.svg" alt="" width={18} height={18} aria-hidden />}
            label="Total Produk"
            value={totalProduk.toString()}
          />
          <StatCard
            icon={<Image src="/icons/shopping-cart.svg" alt="" width={18} height={18} aria-hidden />}
            label="Total Item Terjual"
            value={totalItemTerjual.toLocaleString("id-ID")}
          />
          <StatCard
            icon={<Image src="/icons/coin.svg" alt="" width={18} height={18} aria-hidden />}
            label="Total Pendapatan"
            value={`Rp${totalPendapatan.toLocaleString("id-ID")}`}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <SearchFilterPanel />

        <DashboardItemTable search={search} faculty={faculty} category={category} />
      </main>
    </div>
  );
}