import { Loader } from "@/components/molecules/loader";
import { useAuth } from "@/contexts/AuthContext";
import { Roles } from "@/data/repositories/IRepository";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();
  const { role } = useAuth();
  console.log(role);
  useEffect(() => {
    console.log(role);
    if (role === Roles.admin) {
      router.push("/admin/users-dashboard");
    } else {
      router.push("/dashboard");
    }
  }, [router, role]);

  return (
    <div className="flex items-center justify-center h-screen">
      {" "}
      <Loader size={128} />
    </div>
  );
}
