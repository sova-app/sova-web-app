"use client";

import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { useParams } from "next/navigation";

export default function TruckMapLocation() {
  const params = useParams();
  const id = decodeURIComponent((params?.id as string) || "");
  return (
    <TruckLocationProvider>
      <TruckLocationMap truckID={id} />
    </TruckLocationProvider>
  );
}
