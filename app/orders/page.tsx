"use client";
import { AuthGuard } from "@/components/app/AuthGuard";
import OrdersPage from "@/components/pages/orders-page";
import { withBootstrap } from "@/utils/withBootstrap.js";

import "react-toastify/dist/ReactToastify.css";

function Page() {
  return (
    <>
      <AuthGuard requireAuth>
        <OrdersPage />
      </AuthGuard>
    </>
  );
}

export default withBootstrap(Page);
