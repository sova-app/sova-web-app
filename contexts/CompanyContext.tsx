import React, { createContext, useContext } from "react";
import { CompanyService } from "../services/CompanyService";

const CompanyContext = createContext<CompanyService | null>(null);

export const CompanyProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const service = new CompanyService();
  return (
    <CompanyContext.Provider value={service}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyService = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyService must be used within a CompanyProvider");
  }
  return context;
};
