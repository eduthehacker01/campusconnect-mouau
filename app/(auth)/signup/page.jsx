import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up",
  description: "Create a free MOUAU Connect account.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-xs text-brand-200">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
