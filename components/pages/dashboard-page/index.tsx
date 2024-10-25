"use client";

import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { SideBar } from "@/components/organisms/side-bar";
import { Header } from "@/components/organisms/header";
import { TruckContent } from "@/components/organisms/trucks-content";

export function Dashboard() {
  return (
    <TruckLocationProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <TruckContent />
        </div>
      </div>
    </TruckLocationProvider>
  );
}
