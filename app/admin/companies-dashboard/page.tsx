"use client";
import { AuthGuard } from "@/components/app/AuthGuard";
import CompaniesDashboardPage from "@/components/pages/companies-dashboard-page";
import { Roles } from "@/data/repositories/IRepository";
import { withBootstrap } from "@/utils/withBootstrap.js";

import "react-toastify/dist/ReactToastify.css";

function Page() {
  return (
    <>
      <AuthGuard requireAuth allowedRoles={[Roles.admin]}>
        <CompaniesDashboardPage />
      </AuthGuard>
    </>
  );
}

export default withBootstrap(Page);
