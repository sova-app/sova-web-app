"use client";
import { AuthGuard } from "@/components/app/AuthGuard";
import OrdersPage from "@/components/pages/orders-page";
import { Roles } from "@/data/repositories/IRepository";
import { withBootstrap } from "@/utils/withBootstrap.js";

import "react-toastify/dist/ReactToastify.css";

function Page() {
  return (
    <>
      <AuthGuard requireAuth allowedRoles={[Roles.carrier]}>
        <OrdersPage />
      </AuthGuard>
    </>
  );
}

export default withBootstrap(Page);
