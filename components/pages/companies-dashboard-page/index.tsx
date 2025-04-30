import React from "react";
import { Header } from "@/components/organisms/header";
import { SideBar } from "@/components/organisms/side-bar";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { CompaniesTable } from "@/components/organisms/companies-table";

export default function CompaniesDashboardPage() {
  return (
    <CompanyProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <CompaniesTable />
        </div>
      </div>
    </CompanyProvider>
  );
}
