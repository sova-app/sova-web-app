import React from "react";
import { Header } from "@/components/organisms/header";
import { SideBar } from "@/components/organisms/side-bar";
import { CarrierProvider } from "@/contexts/TrucksContext";

export default function UsersDashboardPage() {
  return (
    <CarrierProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <p>users page</p>
          {/* <OrdersTable /> */}
        </div>
      </div>
    </CarrierProvider>
  );
}
