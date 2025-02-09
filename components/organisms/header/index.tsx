import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <span className="ml-2 text-2xl font-bold">Sova</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {/* <Search className="h-5 w-5" />
      <Bell className="h-5 w-5" />


      <User className="h-5 w-5" /> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <User className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onSelect={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};
