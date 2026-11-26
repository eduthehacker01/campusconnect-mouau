import "./globals.css";
import { AuthGateProvider } from "@/components/auth/AuthGateProvider";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export const metadata = {
  title: {
    default:
      "MOUAU Connect — Connecting People. Creating Opportunities. Building Communities.",
    template: "%s | MOUAU Connect",
  },
  description:
    "Explore the community-driven digital platform connecting students, young people, businesses, and individuals around MOUAU (Umudike), ABSU (Uturu), and surrounding communities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-forest-950">
      <body className="min-h-screen bg-gradient-to-br from-forest-950 via-[#0a360c] to-brand-950 text-slate-100 antialiased">
        <AuthGateProvider>
          {children}
          <AuthPromptModal />
        </AuthGateProvider>
      </body>
    </html>
  );
}
