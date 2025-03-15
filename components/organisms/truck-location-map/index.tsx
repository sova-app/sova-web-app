"use client";
import { useTruckLocationService } from "@/contexts/TruckLocationContext";
import type { Truck, TruckLocation } from "@/data/repositories/IRepository";
import { Map, Placemark, Polyline, YMaps } from "@pbe/react-yandex-maps";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import type { TruckMapLocationProps } from "./types";

interface TruckData {
  truck: Truck;
  locations: TruckLocation[];
}

export const TruckLocationMap = (props: TruckMapLocationProps) => {
  const { truckIds } = props;
  const [trucksData, setTrucksData] = useState<Record<string, TruckData>>({});
  const service = useTruckLocationService();
  const mapRef = useRef<ymaps.Map | null>(null);

  const fetchTruckData = useCallback(async () => {
    if (!truckIds || truckIds.length === 0) {
      return;
    }

    try {
      const newTrucksData: Record<string, TruckData> = {};

      for (const truckId of truckIds) {
        const truck = await service.getTruckById(truckId);
        const locations = await service.getTruckLocations(truck.name);
        newTrucksData[truckId] = { truck, locations };
      }
      setTrucksData(newTrucksData);

      const firstTruckData = Object.values(newTrucksData)[0];
      if (
        firstTruckData &&
        firstTruckData.locations.length > 0 &&
        mapRef.current
      ) {
        const lastLocation =
          firstTruckData.locations[firstTruckData.locations.length - 1];
        mapRef.current.setCenter([lastLocation.lat, lastLocation.lng]);
      }
    } catch (error) {
      console.error("Error fetching truck data:", error);
      toast.error("An error occurred while fetching truck information.");
    }
  }, [truckIds, service]);

  useEffect(() => {
    fetchTruckData();
  }, [fetchTruckData]);

  return (
    <YMaps>
      <Map
        width={"100%"}
        height={"100%"}
        defaultState={{
          center: [55.751244, 37.618423],
          zoom: 10,
        }}
        instanceRef={(instance) => {
          mapRef.current = instance;
        }}
      >
        {Object.entries(trucksData).map(([truckId, { truck, locations }]) => {
          if (locations.length === 0) {
            toast.info(`No locations available for ${truck.name}.`);
            return null;
          }
          return (
            <React.Fragment key={truckId}>
              <Polyline
                geometry={locations.map((loc) => [loc.lat, loc.lng])}
                options={{
                  strokeColor: "#0000FF",
                  strokeWidth: 4,
                  strokeOpacity: 0.8,
                }}
              />
              {locations.map((location, index) => (
                <Placemark
                  key={`${truckId}-${index}`}
                  geometry={[location.lat, location.lng]}
                  properties={{
                    balloonContent: `Truck: ${
                      truck.name
                    }<br>Timestamp: ${location.timestamp.toLocaleString()}`,
                  }}
                  modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                  options={{
                    preset: "islands#icon",
                    iconColor: index === locations.length - 1 ? "red" : "blue",
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}
      </Map>
    </YMaps>
  );
};
