import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";

export function PublicShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 lg:px-6">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
