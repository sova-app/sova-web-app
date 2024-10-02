// ?: Is there are any workaround here?
"use client";

import React from "react";
import { TruckSelector } from "@/components/molecules/truck-selector";
import { TruckMapLocation } from "@/components/organisms/truck-map-location";

export default function TruckLocationPage() {
  const [truckID, setTruckID] = React.useState<string>("");
  return (
    <>
      <TruckSelector onTruckSelected={setTruckID} />
      <TruckMapLocation truckID={truckID} />
    </>
  );
}
