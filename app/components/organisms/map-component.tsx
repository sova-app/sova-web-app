"use client";

import useFirestore from "@/lib/hooks/useFirestore";
import { YMaps, Map, Polyline, Placemark } from "@pbe/react-yandex-maps";
import React from "react";
import { TruckSelector } from "../molecules/truck-selector";

export const MapComponent = () => {
  const [truckID, setTruckID] = React.useState<string>("");
  const locations = useFirestore(truckID);
  const pathCoordinates = locations.map((location) => [
    location.lat,
    location.lng,
  ]);

  return (
    <YMaps>
      <div>
        My awesome application with maps!
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
                  balloonContent: `Timestamp: ${location.timestamp.toLocaleString()}`,
                }}
                options={{
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
