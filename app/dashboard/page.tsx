"use client";
import { AuthGuard } from "@/components/app/AuthGuard";
import { Dashboard } from "@/components/pages/dashboard-page";
import { withBootstrap } from "@/utils/withBootstrap.js";

// TODO: Make DefaultTemplate that will include toaster
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Page() {
  return (
    <>
      <AuthGuard requireAuth>
        <Dashboard />
        <ToastContainer />
      </AuthGuard>
    </>
  );
}

export default withBootstrap(Page);
