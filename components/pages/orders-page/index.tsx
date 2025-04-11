import React from "react";
import { Header } from "@/components/organisms/header";
import { SideBar } from "@/components/organisms/side-bar";
import { CarrierProvider } from "@/contexts/TrucksContext";
import { OrdersTable } from "@/components/organisms/orders-table";
import { CarrierOrdersTable } from "@/components/organisms/carrier-orders-table";

export default function OrdersPage() {
  return (
    <CarrierProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <OrdersTable />
          <CarrierOrdersTable />
        </div>
      </div>
    </CarrierProvider>
  );
}
