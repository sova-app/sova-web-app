import React from "react";
import { Header } from "@/components/organisms/header";
import { SideBar } from "@/components/organisms/side-bar";
import { TrucksDashboard } from "@/components/organisms/trucks-dashboard";
import { CarrierProvider } from "@/contexts/TrucksContext";

export default function TrucksPage() {
  return (
    <CarrierProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <TrucksDashboard />
        </div>
      </div>
    </CarrierProvider>
  );
}
