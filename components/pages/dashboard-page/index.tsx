"use client";
import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { TrucksTable } from "@/components/organisms/trucks-table";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { Truck as TruckDTO } from "@/data/repositories/IRepository";
import { Truck, Bell, Search, User, Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export function Dashboard() {
  const [selectedTruck, setSelectedTruck] = useState<TruckDTO>();

  const onTruckSelect = (truck: TruckDTO) => {
    setSelectedTruck(truck);
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
                Trucks
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                <Ticket className="h-4 w-4" />
                Orders
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                <Ticket className="h-4 w-4" />
                Reports
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">
            <div
              className={classNames(
                "relative flex-1",
                styles.locationMapContainer
              )}
            >
              <TruckLocationMap truckID={selectedTruck?.name} />
              <div
                className="absolute top-4 left-4 bg-white/90 rounded-lg shadow-lg max-h-[50vh] w-80 overflow-y-auto z-10 p-4"
                style={{ backdropFilter: "blur(5px)" }}
              >
                <TrucksTable onTruckSelect={onTruckSelect} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </TruckLocationProvider>
  );
}
