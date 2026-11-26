"use client";

import { usePathname } from "next/navigation";
import { useAuthGate } from "@/components/auth/AuthGateProvider";

export function ProtectedActionButton({
  children,
  className = "",
  promptTitle = "Join MOUAU Connect",
  promptMessage = "Join MOUAU Connect to complete this action and connect with the community.",
  authenticatedMessage = "You're signed in! Full interactive features are coming in Milestone 2.",
  onAuthenticatedClick,
  type = "button",
  title,
}) {
  const pathname = usePathname();
  const { isAuthenticated, openAuthPrompt, showToast } = useAuthGate();

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthPrompt({
        title: promptTitle,
        message: promptMessage,
        nextUrl: pathname || "/",
      });
      return;
    }
    if (onAuthenticatedClick) {
      onAuthenticatedClick(e);
    } else {
      showToast(authenticatedMessage);
    }
  };

  return (
    <button type={type} onClick={handleClick} className={className} title={title}>
      {children}
    </button>
  );
}
