"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { INPUT_CLASS } from "@/lib/utils/format";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setError("Please enter a valid registered email address.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Password recovery service is not configured.");
      return;
    }

    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(clean);
    setLoading(false);

    if (resetErr) {
      setError(resetErr.message);
      return;
    }
    setSent(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white">Reset Your Password</h1>
      <p className="mt-1 text-xs text-brand-200/80">
        Enter the email address associated with your MOUAU Connect account and
        we&apos;ll send a recovery link.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <div>
          <label
            htmlFor="reset-email"
            className="mb-1 block text-xs font-semibold text-brand-200"
          >
            Registered Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. student@gmail.com"
            className={INPUT_CLASS}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-gold-400/45 bg-gold-500/10 px-3 py-2 text-xs font-semibold text-gold-300"
          >
            ⚠️ {error}
          </p>
        )}

        {sent && (
          <p
            role="status"
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2.5 text-xs font-semibold text-emerald-300"
          >
            ✔ Password recovery link sent! Please check your inbox and spam
            folder.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-brand-500 disabled:opacity-60"
        >
          {loading ? "Sending recovery link…" : "Send Recovery Link"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-brand-200/80">
        Remembered your password?{" "}
        <Link href="/login" className="font-extrabold text-gold-400 hover:underline">
          ← Back to Log In
        </Link>
      </p>
    </div>
  );
}
