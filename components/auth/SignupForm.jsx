"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthGate } from "@/components/auth/AuthGateProvider";
import { COLLEGES_MAP, COLLEGES } from "@/lib/constants/colleges";
import { INPUT_CLASS } from "@/lib/utils/format";

const ACCOUNT_ROLES = [
  { key: "Student", label: "🎓 Student", desc: "MOUAU / ABSU" },
  { key: "Business", label: "🛍️ Business", desc: "Vendor / Seller" },
  { key: "Employer", label: "💼 Employer", desc: "Post Jobs" },
  { key: "Blogger", label: "✍️ Blogger", desc: "Campus Media" },
];

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useAuthGate();

  const nextUrl = searchParams.get("next") || "/";
  const safeNext = nextUrl.startsWith("/") ? nextUrl : "/";

  const [step, setStep] = useState(1); // 1: Account Info | 2: 6-Digit Email OTP | 3: Optional Student KYC
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    studentId: "",
    college: "CAERSE",
    department: COLLEGES_MAP.CAERSE[0],
    password: "",
    agreedTerms: true,
  });

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const otpRefs = useRef([]);

  const [kycDocType, setKycDocType] = useState("MOUAU Student ID Card");
  const [kycFile, setKycFile] = useState(null);
  const [kycPreview, setKycPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    const p = form.password || "";
    if (!p) return { score: 0, label: "Enter password", color: "bg-brand-900" };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { score: 25, label: "Weak", color: "bg-rose-500" };
    if (s === 2) return { score: 55, label: "Fair", color: "bg-gold-400" };
    if (s === 3) return { score: 80, label: "Good", color: "bg-emerald-400" };
    return { score: 100, label: "Strong", color: "bg-brand-600" };
  }, [form.password]);

  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOtpChange = (index, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleKycFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG or PNG).");
      return;
    }
    setKycFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setKycPreview(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication service is not configured.");
      return;
    }

    if (step === 1) {
      if (!form.fullName.trim()) return setError("Please enter your full name.");
      if (!form.email.trim() || !form.email.includes("@")) {
        return setError("Please enter a valid email address.");
      }
      if (role === "Student" && !form.studentId.trim()) {
        return setError("Please enter your Matric Number (e.g. MOUAU/21/12345).");
      }
      if (form.password.length < 6) {
        return setError("Password must be at least 6 characters.");
      }
      if (!form.agreedTerms) {
        return setError("Please agree to the community safety rules.");
      }

      setLoading(true);
      const cleanEmail = form.email.trim().toLowerCase();
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: form.fullName.trim(),
            matric_number: form.studentId.trim().toUpperCase(),
            college: form.college,
            department: form.department,
            role,
          },
        },
      });
      setLoading(false);
      if (otpErr) return setError(otpErr.message);

      setOtpDigits(["", "", "", "", "", ""]);
      setResendTimer(60);
      setStep(2);
      showToast(`6-digit OTP sent to ${cleanEmail}. Check your inbox.`);
      return;
    }

    if (step === 2) {
      const token = otpDigits.join("");
      if (token.length < 6) {
        return setError("Please enter all 6 digits of the verification code.");
      }
      setLoading(true);
      const cleanEmail = form.email.trim().toLowerCase();
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token,
        type: "email",
      });
      if (verifyErr) {
        setLoading(false);
        return setError(verifyErr.message);
      }
      try {
        await supabase.auth.updateUser({ password: form.password });
      } catch (_) {}
      setLoading(false);
      showToast("Email verified! Complete your profile setup.");
      setStep(3);
      return;
    }

    if (step === 3) {
      setLoading(true);
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        setLoading(false);
        return setError("Session expired. Please verify your OTP again.");
      }

      let publicKycUrl = null;
      if (kycFile) {
        const ext = (kycFile.name.split(".").pop() || "jpg").toLowerCase();
        const filePath = `${user.id}/${Date.now()}-kyc.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("kyc-ids")
          .upload(filePath, kycFile, { upsert: true });
        if (uploadErr) {
          setLoading(false);
          return setError(`Upload error: ${uploadErr.message}`);
        }
        const { data: urlData } = supabase.storage
          .from("kyc-ids")
          .getPublicUrl(filePath);
        publicKycUrl = urlData?.publicUrl || null;
      }

      const { error: profErr } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: form.fullName.trim(),
          email: user.email || form.email.trim().toLowerCase(),
          matric_number: form.studentId.trim().toUpperCase(),
          college: form.college,
          department: form.department,
          role,
          kyc_image_url: publicKycUrl,
          kyc_status: publicKycUrl ? "pending" : "unverified",
        },
        { onConflict: "id" }
      );
      setLoading(false);
      if (profErr) return setError(profErr.message);

      showToast("Account created! Welcome to MOUAU Connect.");
      router.push(safeNext);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white">
        {step === 1 && "Create Your Free Account"}
        {step === 2 && "Verify Your Email (OTP)"}
        {step === 3 && "Student Verification (KYC)"}
      </h1>
      <p className="mt-1 text-xs text-brand-200/80">
        {step === 1 &&
          "Join MOUAU Connect to connect with sellers, apply for jobs, and join campus communities."}
        {step === 2 && `Enter the 6-digit code sent to ${form.email}.`}
        {step === 3 &&
          "Upload your Student ID Card or Course Form (optional for non-students)."}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ACCOUNT_ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`rounded-xl border p-2 text-left transition ${
                    role === r.key
                      ? "border-brand-500 bg-brand-600/25 text-white ring-1 ring-brand-500"
                      : "border-brand-800/70 bg-forest-950/70 text-brand-200 hover:border-brand-600"
                  }`}
                >
                  <p className="text-xs font-extrabold">{r.label}</p>
                  <p className="text-[10px] text-brand-300/80">{r.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-200">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={update}
                  placeholder="e.g. Tobechi Okafor"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-200">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="e.g. student@gmail.com"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {role === "Student" && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-200">
                  Matric Number
                </label>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={update}
                  placeholder="e.g. MOUAU/21/12345 or ABSU/21/12345"
                  className={INPUT_CLASS}
                />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-200">
                  College / Institution
                </label>
                <select
                  name="college"
                  value={form.college}
                  onChange={(e) => {
                    const col = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      college: col,
                      department: COLLEGES_MAP[col]?.[0] || "",
                    }));
                  }}
                  className={INPUT_CLASS}
                >
                  {COLLEGES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-200">
                  Department / Category
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={update}
                  className={INPUT_CLASS}
                >
                  {(COLLEGES_MAP[form.college] || []).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-200">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update}
                  placeholder="Min. 6 characters"
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
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-brand-200/75">Password strength:</span>
                  <span className="font-bold text-gold-300">
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-forest-950">
                  <div
                    className={`h-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-xs text-brand-200/85">
              <input
                type="checkbox"
                checked={form.agreedTerms}
                onChange={(e) =>
                  setForm({ ...form, agreedTerms: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 accent-brand-600"
              />
              <span>
                I agree to the <strong>MOUAU Connect Community Rules</strong> (no
                scams, honest listings, respect community privacy).
              </span>
            </label>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4 rounded-2xl border border-brand-800/70 bg-forest-950/75 p-4">
            <div className="grid grid-cols-6 gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  aria-label={`OTP Digit ${idx + 1}`}
                  className="h-12 w-full rounded-xl border border-brand-700 bg-forest-900 text-center text-lg font-black text-white focus:border-brand-500 focus:outline-none"
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-bold text-brand-300 hover:text-white"
              >
                ← Edit details
              </button>
              <span className="text-brand-200/75">
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Check spam folder"}
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 rounded-2xl border border-brand-800/70 bg-forest-950/75 p-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-brand-200">
                Verification Document Type
              </label>
              <select
                value={kycDocType}
                onChange={(e) => setKycDocType(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="MOUAU Student ID Card">MOUAU Student ID Card</option>
                <option value="ABSU Student ID Card">ABSU Student ID Card</option>
                <option value="Course Registration Form">Course Registration Form</option>
              </select>
            </div>

            {kycPreview ? (
              <div className="overflow-hidden rounded-xl border border-brand-600">
                <img
                  src={kycPreview}
                  alt="Uploaded KYC preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-700/70 bg-forest-900/70 px-4 py-6 text-center hover:border-brand-500">
                <span className="text-2xl">🪪</span>
                <span className="text-xs font-bold text-white">
                  Upload ID Card or Course Form (JPG / PNG)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleKycFile}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        )}

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
          {loading
            ? "Processing…"
            : step === 1
            ? "Send 6-Digit Email OTP →"
            : step === 2
            ? "Verify OTP & Continue →"
            : "Finish Creating Account →"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-brand-200/80">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(safeNext)}`}
          className="font-extrabold text-gold-400 hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
