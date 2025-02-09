"use client";

import { Loader } from "@/components/molecules/loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      {" "}
      <Loader size={128} />
    </div>
  );
}
