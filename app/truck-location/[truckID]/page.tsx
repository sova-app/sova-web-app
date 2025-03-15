"use client";

import classNames from "classnames";
import styles from "./index.module.scss";
import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { useParams } from "next/navigation";
import { Header } from "@/components/organisms/header";
import { ToastContainer } from "react-toastify";

const TruckLocationPage = () => {
  const { truckID } = useParams<{ truckID: string }>();

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
              <h1 className="text-2xl font-bold mb-4">Truck: {truckID}</h1>
              <TruckLocationMap truckIds={[truckID]} />
            </div>
          </main>
        </div>
      </div>
      <ToastContainer />
    </TruckLocationProvider>
  );
};

export default TruckLocationPage;
