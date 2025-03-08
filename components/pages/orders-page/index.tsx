import React from "react";
import { Header } from "@/components/organisms/header";
import { SideBar } from "@/components/organisms/side-bar";

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <p>Hail Orders</p>
      </div>
    </div>
  );
}
