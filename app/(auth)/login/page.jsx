import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In",
  description: "Log in to your MOUAU Connect account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-xs text-brand-200">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
