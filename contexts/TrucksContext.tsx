import React, { createContext, useContext } from "react";
import { CarrierCompanyService } from "../services/CarrierCompanyService";

const CarrierContext = createContext<CarrierCompanyService | null>(null);

export const CarrierProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const service = new CarrierCompanyService();
  return (
    <CarrierContext.Provider value={service}>
      {children}
    </CarrierContext.Provider>
  );
};

export const useCarrierService = () => {
  const context = useContext(CarrierContext);
  if (!context) {
    throw new Error("useCarrierService must be used within a CarrierProvider");
  }
  return context;
};
