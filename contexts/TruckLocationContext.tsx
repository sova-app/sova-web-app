import React, { createContext, useContext } from "react";
import { TruckLocationService } from "../services/TruckLocationService";

const TruckLocationContext = createContext<TruckLocationService | null>(null);

export const TruckLocationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const service = new TruckLocationService();
  return (
    <TruckLocationContext.Provider value={service}>
      {children}
    </TruckLocationContext.Provider>
  );
};

export const useTruckLocationService = () => {
  const context = useContext(TruckLocationContext);
  if (!context) {
    throw new Error(
      "useTruckLocationService must be used within a TruckLocationProvider"
    );
  }
  return context;
};
