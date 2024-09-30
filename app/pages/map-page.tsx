// App.tsx
import React from "react";
import { MapComponent } from "../../components/map-component";

export const MapPage = () => {
  const userID = "метро";
  return (
    <div>
      <h1>Driver Location</h1>
      <MapComponent userID={userID} />
    </div>
  );
};
