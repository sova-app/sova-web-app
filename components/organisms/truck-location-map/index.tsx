"use client";
import { YMaps, Map, Polyline, Placemark } from "@pbe/react-yandex-maps";
import React, { useEffect, useRef, useState } from "react";
import { TruckMapLocationProps } from "./types";
import { useTruckLocationService } from "@/contexts/TruckLocationContext";
import { TruckLocation } from "@/data/repositories/IRepository";

export const TruckLocationMap = (props: TruckMapLocationProps) => {
  const { truckID } = props;
  const [locations, setLocations] = useState<TruckLocation[]>([]);
  const service = useTruckLocationService();
  const mapRef = useRef<any>(null); // Create a ref for the map instance

  // Fetching the locations whenever truckID changes
  useEffect(() => {
    if (!truckID) {
      return;
    }
    const fetchLocations = async () => {
      const data = await service.getTruckLocations(truckID);
      setLocations(data);
      if (mapRef.current && data.length > 0) {
        const lastLocation = data[data.length - 1];
        // Center the map on the last truck location
        mapRef.current.setCenter([lastLocation.lat, lastLocation.lng]);
      }
    };

    fetchLocations();
  }, [truckID, service]);

  const pathCoordinates = locations.map((location) => [
    location.lat,
    location.lng,
  ]);

  return (
    <YMaps>
      <Map
        width={"100%"}
        height={"100%"}
        defaultState={{
          center: [55.751244, 37.618423], // Initial fallback center
          zoom: 10,
        }}
        instanceRef={(instance) => {
          mapRef.current = instance; // Save the map instance to the ref
        }}
      >
        {/* Only rerender polyline and placemarks when locations change */}
        {locations.length > 0 && (
          <>
            <Polyline
              geometry={pathCoordinates}
              options={{
                strokeColor: "#0000FF",
                strokeWidth: 4,
                strokeOpacity: 0.8,
              }}
            />
            {locations.map((location, index) => (
              <Placemark
                key={index}
                geometry={[location.lat, location.lng]}
                properties={{
                  balloonContent: `Timestamp: ${location.timestamp.toLocaleString()}`,
                }}
                modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                options={{
                  preset: "islands#icon",
                  iconColor: index === locations.length - 1 ? "red" : "blue",
                }}
              />
            ))}
          </>
        )}
      </Map>
    </YMaps>
  );
};
