"use client";

import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/organisms/header";
import { OrderLocationPage } from "@/components/pages/order-location-page";
import { CarrierProvider } from "@/contexts/TrucksContext";
import { ToastContainer } from "react-toastify";

const Page = () => {
  const { orderID } = useParams<{ orderID: string }>();

  useEffect(() => {}, [orderID]);

  return (
    <CarrierProvider>
      <TruckLocationProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1">
            <main className="flex-1 p-4 md:p-6">
              <OrderLocationPage orderID={orderID} />
            </main>
          </div>
        </div>
        <ToastContainer />
      </TruckLocationProvider>
    </CarrierProvider>
  );
};

export default Page;
