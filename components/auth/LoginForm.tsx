"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginInput } from "@/types/user";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (loading) return;

    setError(null);

    // =========================
    // VALIDATION
    // =========================
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const payload: LoginInput = {
        email,
        password,
      };

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md"
      aria-describedby={error ? "login-error" : undefined}
    >
      {/* ERROR MESSAGE (ACCESSIBLE) */}
      {error && (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="text-red-600 text-sm border border-red-200 bg-red-50 p-2 rounded"
        >
          {error}
        </div>
      )}

      {/* EMAIL */}
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border p-2"
        disabled={loading}
        autoComplete="email"
      />

      {/* PASSWORD */}
      <label htmlFor="password" className="text-sm font-medium">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="border p-2"
        disabled={loading}
        autoComplete="current-password"
      />

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 disabled:opacity-50"
        aria-busy={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}