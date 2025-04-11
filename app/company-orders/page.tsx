"use client";
import { AuthGuard } from "@/components/app/AuthGuard";
import CompanyOrdersPage from "@/components/pages/company-orders-page";
import { Roles } from "@/data/repositories/IRepository";
import { withBootstrap } from "@/utils/withBootstrap.js";

import "react-toastify/dist/ReactToastify.css";

function Page() {
  return (
    <>
      <AuthGuard requireAuth allowedRoles={[Roles.expeditor]}>
        <CompanyOrdersPage />
      </AuthGuard>
    </>
  );
}

export default withBootstrap(Page);
