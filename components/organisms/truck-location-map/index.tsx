"use client";
import { YMaps, Map, Polyline, Placemark } from "@pbe/react-yandex-maps";
import React, { useEffect, useState } from "react";
import { TruckMapLocationProps } from "./types";
import { useTruckLocationService } from "@/contexts/TruckLocationContext";
import { TruckLocation } from "@/data/repositories/IRepository";

export const TruckLocationMap = (props: TruckMapLocationProps) => {
  const { truckID } = props;
  const [locations, setLocations] = useState<TruckLocation[]>([]);
  const service = useTruckLocationService();
  useEffect(() => {
    const fetchLocations = async () => {
      const data = await service.getTruckLocations(truckID);
      setLocations(data);
    };

    fetchLocations();
  }, [truckID, service]);

  const pathCoordinates = locations.map((location) => [
    location.lat,
    location.lng,
  ]);

  return (
    <YMaps>
      <div>
        {locations.length > 0 && (
          <Map
            width={"100vw"}
            height={"100vh"}
            defaultState={{
              center: [locations[0].lat, locations[0].lng],
              zoom: 9,
            }}
          >
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
                  balloonContent: `Timestamp: 123`,
                }}
                options={{
                  hasBalloon: true,
                  balloonCloseButton: true,
                  preset: "islands#icon",
                  iconColor: index === locations.length - 1 ? "red" : "blue",
                }}
              />
            ))}
          </Map>
        )}
      </div>
    </YMaps>
  );
};
