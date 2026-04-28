"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mic,
  ChevronRight,
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { authApi, toLanguageCode } from "@/lib/api";
import VoiceWaveform from "@/components/VoiceWaveform";

type Tab = "login" | "signup";
const languages = [
  "Hindi",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Tamil",
  "Telugu",
  "English",
] as const;

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    loginWithToken,
    setLanguage: setStoreLang,
  } = useAuthStore();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedUsername = email.trim();

      if (tab === "signup") {
        await authApi.signup({
          name: familyName.trim(),
          username: normalizedUsername,
          password,
          primary_language: toLanguageCode(language),
        });
      }

      const res = await authApi.login(normalizedUsername, password);
      loginWithToken(res.access_token, res.household_id, res.household_id);

      if (tab === "signup") {
        setStoreLang(toLanguageCode(language) as any);
      }

      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        err?.message ??
        err?.response?.data?.detail ??
        "Authentication failed. Please check your credentials.";
      setError(typeof msg === "string" ? msg : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-surface-900 to-surface-950" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-navy-500/[0.08] rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <Image
              src="/images/logo-icon.png"
              alt="Vaxi Babu logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl"
            />
            <span className="font-heading font-800 text-2xl text-white">
              Vaxi<span className="text-teal-400">Babu  </span>{" "}
              <span className="text-teal-300 text-lg"></span>
            </span>
          </Link>
          <h1 className="font-heading font-800 text-4xl text-white leading-tight mb-4">
            Your familys
            <br />
            <span className="gradient-text">health memory</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-md mb-8">
            Voice-first preventive healthcare for every family. Remember,
            understand, and act on health tasks with simple voice interactions.
          </p>
          <div className="flex items-center gap-3">
            <VoiceWaveform bars={5} size="md" color="bg-teal-500" />
            <span className="text-sm text-white/30">
              Voice-powered health assistant
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <ArrowLeft size={16} className="text-white/40" />
            <Image
              src="/images/logo-icon.png"
              alt="Vaxi Babu logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-heading font-700 text-white">Vaxi Babu</span>
          </Link>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-surface-800/60 rounded-xl mb-8 border border-white/[0.04]">
            {[
              { key: "login" as Tab, label: "Sign In", icon: Mail },
              { key: "signup" as Tab, label: "Sign Up", icon: UserPlus },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-teal-500/15 text-teal-400 border border-teal-500/20" : "text-white/40 hover:text-white/60 border border-transparent"}`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-coral-500/10 border border-coral-500/20 rounded-xl text-xs text-coral-400"
            >
              {error}
            </motion.div>
          )}

          {(tab === "login" || tab === "signup") && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleAuth}
              className="space-y-4"
            >
              <div>
                <h2 className="font-heading font-700 text-xl text-white mb-1">
                  {tab === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm text-white/35">
                  {tab === "login"
                    ? "Sign in to access your family health records"
                    : "Set up your family health profile"}
                </p>
              </div>

              {tab === "signup" && (
                <>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">
                      Family Name
                    </label>
                    <input
                      type="text"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder="e.g. Sharma"
                      required
                      className="w-full px-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">
                      Preferred Language
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {languages.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLanguage(l)}
                          className={`py-2 rounded-lg text-xs font-medium transition-all ${language === l ? "bg-teal-500/15 text-teal-400 border border-teal-500/20" : "bg-surface-800/40 text-white/40 border border-white/[0.06] hover:text-white/60"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs text-white/40 mb-1.5 block">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sharma or you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-surface-950 font-heading font-700 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {tab === "login" ? "Sign In" : "Create Family Account"}
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
