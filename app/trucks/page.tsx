"use client";
import { AuthGuard } from "@/components/app/AuthGuard";
import TrucksPage from "@/components/pages/trucks";
import { withBootstrap } from "@/utils/withBootstrap.js";

import "react-toastify/dist/ReactToastify.css";

function Page() {
  return (
    <>
      <AuthGuard requireAuth>
        <TrucksPage />
      </AuthGuard>
    </>
  );
}

export default withBootstrap(Page);
