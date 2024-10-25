// ?: Is there are any workaround here?
"use client";

import React from "react";
// import { TruckSelector } from "@/components/molecules/truck-selector";
import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";

export default function TruckLocationPage() {
  const [truckID, ] = React.useState<string>("");
  return (
    <TruckLocationProvider>
      {/* <TruckSelector onTruckSelected={setTruckID} /> */}
      <TruckLocationMap truckID={truckID} />
    </TruckLocationProvider>
  );
}
