"use client";

import { AuthGuard } from "@/components/app/AuthGuard";
import IndexPage from "@/components/pages/index-page";
export default function Page() {
  return (
    <>
      <AuthGuard>
        <IndexPage />
      </AuthGuard>
    </>
  );
}
