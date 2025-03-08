"use client";

import classNames from "classnames";
import styles from "./index.module.scss";
import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/organisms/header";

const TruckLocationPage = () => {
  const { truckName } = useParams<{ truckName: string }>();

  useEffect(() => {
    console.log("Truck ID:", truckName);
    console.log("Hey");
  }, [truckName]);

  return (
    <TruckLocationProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <main className="flex-1 p-4 md:p-6">
            <div
              className={classNames(
                "relative flex-1 items-center h-full",
                styles.locationMapContainer
              )}
            >
              <h1 className="text-2xl font-bold mb-4">Truck: {truckName}</h1>
              <TruckLocationMap truckName={truckName} />
            </div>
          </main>
        </div>
      </div>
    </TruckLocationProvider>
  );
};

export default TruckLocationPage;
