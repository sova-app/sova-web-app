// MapComponent.tsx
"use client";

import useFirestore from "@/lib/hooks/useFirestore";
import { YMaps, Map, Polyline, Placemark } from "@pbe/react-yandex-maps";
import React from "react";

type MapProps = {
  userID: string;
};

export const MapComponent: React.FC<MapProps> = ({ userID }) => {
  const locations = useFirestore(userID);

  // Convert location data to an array of coordinate pairs for Polyline
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
              center: [locations[0].lat, locations[0].lng], // Center map at the first recorded location
              zoom: 9,
            }}
          >
            {/* Draw Polyline showing the path of the driver */}
            <Polyline
              geometry={pathCoordinates} // Array of coordinates representing the path
              options={{
                balloonCloseButton: true,
                strokeColor: "#0000FF", // Color of the line
                strokeWidth: 4, // Thickness of the line
                strokeOpacity: 0.8, // Opacity of the line
              }}
            />

            {/* Place markers for each location with a timestamp */}
            {locations.map((location, index) => (
              <Placemark
                key={index}
                geometry={[location.lat, location.lng]}
                properties={{
                  balloonContent: `Timestamp: ${location.timestamp.toLocaleString()}`,
                }}
                options={{
                  preset: "islands#icon",
                  iconColor: index === locations.length - 1 ? "red" : "blue", // Current location is red, others are blue
                }}
              />
            ))}
          </Map>
        )}
      </div>
    </YMaps>
  );
};
