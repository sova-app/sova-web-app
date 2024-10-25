import Link from "next/link";

export const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <span className="ml-2 text-2xl font-bold">Sova</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {/* <Search className="h-5 w-5" />
      <Bell className="h-5 w-5" />
      <User className="h-5 w-5" /> */}
      </nav>
    </header>
  );
};
