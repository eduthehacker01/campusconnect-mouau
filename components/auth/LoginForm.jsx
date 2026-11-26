"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthGate } from "@/components/auth/AuthGateProvider";
import { INPUT_CLASS } from "@/lib/utils/format";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useAuthGate();

  const nextUrl = searchParams.get("next") || "/";
  const safeNext = nextUrl.startsWith("/") ? nextUrl : "/";

  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Please enter your password (at least 6 characters).");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication service is not configured.");
      return;
    }

    setLoading(true);
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });
    setLoading(false);

    if (signInErr) {
      setError(signInErr.message);
      return;
    }

    showToast("Welcome back to MOUAU Connect!");
    router.push(safeNext);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Log in to MOUAU Connect</h1>
      <p className="mt-1 text-xs text-brand-200/80">
        Sign in to message sellers, apply for jobs, join communities, and RSVP to
        events.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <div>
          <label
            htmlFor="login-email"
            className="mb-1 block text-xs font-semibold text-brand-200"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="e.g. student@gmail.com"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-brand-200"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-gold-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${INPUT_CLASS} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-brand-950/90 px-2 py-1 text-[11px] font-bold text-brand-200 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-gold-400/45 bg-gold-500/10 px-3 py-2 text-xs font-semibold text-gold-300"
          >
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log In →"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-brand-200/80">
        Don&apos;t have an account yet?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(safeNext)}`}
          className="font-extrabold text-gold-400 hover:underline"
        >
          Create Free Account
        </Link>
      </p>
    </div>
  );
}
