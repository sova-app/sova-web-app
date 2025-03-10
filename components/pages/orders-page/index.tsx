import React from "react";
import { Header } from "@/components/organisms/header";
import { SideBar } from "@/components/organisms/side-bar";
import { OrdersDashboard } from "@/components/organisms/orders-dashboard";
import { CarrierProvider } from "@/contexts/TrucksContext";

export default function OrdersPage() {
  return (
    <CarrierProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <OrdersDashboard />
        </div>
      </div>
    </CarrierProvider>
  );
}
