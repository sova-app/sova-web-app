"use client";
import { Dashboard } from "@/components/pages/dashboard-page";
import { withBootstrap } from "@/utils/withBootstrap.js";
function Page() {
  return <Dashboard />;
}

export default withBootstrap(Page);
