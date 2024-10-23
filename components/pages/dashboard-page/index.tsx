"use client";

import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { TrucksTable } from "@/components/organisms/trucks-table";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { Truck as TruckDTO } from "@/data/repositories/IRepository";
import { Truck, Ticket, Bell, Search, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Dashboard() {
  const [selectedTruck, setSelectedTruck] = useState<TruckDTO>();

  const onTruckSelect = (truck: TruckDTO) => {
    setSelectedTruck(truck);
  };
  const clearSelectedTruck = () => {
    setSelectedTruck(undefined);
  };
  return (
    <TruckLocationProvider>
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
          <Link className="flex items-center justify-center" href="/">
            <Truck className="h-6 w-6" />
            <span className="ml-2 text-2xl font-bold">Sova</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Search className="h-5 w-5" />
            <Bell className="h-5 w-5" />
            <User className="h-5 w-5" />
          </nav>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 border-r bg-gray-100/40 hidden md:block">
            <nav className="flex flex-col gap-4 p-4">
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                <Truck className="h-4 w-4" />
                Fleet Overview
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                <Ticket className="h-4 w-4" />
                Tickets
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <button
              onClick={clearSelectedTruck}
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            >
              Clear
            </button>
            <div className="grid gap-6">
              {selectedTruck ? (
                <TruckLocationMap truckID={selectedTruck.name} />
              ) : (
                <TrucksTable onTruckSelect={onTruckSelect} />
              )}
            </div>
          </main>
        </div>
      </div>
    </TruckLocationProvider>
  );
}
