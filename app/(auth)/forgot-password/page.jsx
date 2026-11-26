import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
  description: "Recover access to your MOUAU Connect account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
