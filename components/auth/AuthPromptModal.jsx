"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthGate } from "@/components/auth/AuthGateProvider";

export function AuthPromptModal() {
  const { promptState, closeAuthPrompt } = useAuthGate();

  useEffect(() => {
    if (!promptState) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAuthPrompt();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [promptState, closeAuthPrompt]);

  if (!promptState) return null;

  const encodedNext = encodeURIComponent(promptState.nextUrl || "/");

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-forest-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      onClick={closeAuthPrompt}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop-in w-full max-w-md rounded-3xl border border-brand-700/70 bg-forest-900 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-500/15 px-2.5 py-0.5 text-[11px] font-extrabold text-gold-300">
              Account Required
            </span>
            <h2
              id="auth-prompt-title"
              className="mt-2 text-lg font-extrabold text-white"
            >
              {promptState.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthPrompt}
            aria-label="Close prompt and continue browsing"
            className="rounded-lg p-1.5 text-brand-200/80 transition hover:bg-brand-950 hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-brand-100/90">
          {promptState.message}
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href={`/signup?next=${encodedNext}`}
            onClick={closeAuthPrompt}
            className="w-full rounded-xl bg-brand-600 py-3 text-center text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500"
          >
            Create Free Account
          </Link>
          <Link
            href={`/login?next=${encodedNext}`}
            onClick={closeAuthPrompt}
            className="w-full rounded-xl border border-brand-700/80 bg-forest-950/80 py-3 text-center text-sm font-bold text-brand-100 transition hover:border-gold-400 hover:text-white"
          >
            Log In
          </Link>
          <button
            type="button"
            onClick={closeAuthPrompt}
            className="mt-1 w-full rounded-xl py-2 text-xs font-semibold text-brand-200/80 transition hover:text-white"
          >
            Dismiss and continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
