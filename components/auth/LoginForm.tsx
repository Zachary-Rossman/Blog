"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginInput } from "@/types/User";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginForm() {
  // =====================================================
  // HOOKS
  // =====================================================
  // router
  // Navigates the user after a successful login.
  //
  // refreshUser
  // Refreshes the global authentication context after
  // the server creates the authentication cookie.
  // Without this call, the navbar and protected UI would
  // still think the user is logged out until the page
  // reloads.
  // =====================================================

  const router = useRouter();
  const { refreshUser } = useAuth();

  // =====================================================
  // FORM STATE
  // =====================================================
  // email
  // Stores the user's email address.
  //
  // password
  // Stores the user's password.
  //
  // error
  // Displays validation or server errors.
  //
  // loading
  // Prevents duplicate submissions while the request
  // is being processed.
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN SUBMISSION
  // =====================================================
  // Workflow
  //
  // 1. Prevent the browser from refreshing.
  // 2. Prevent duplicate requests.
  // 3. Validate user input.
  // 4. Build the login payload.
  // 5. Send credentials to the login API.
  // 6. Refresh the authentication context so every
  //    component immediately knows the user is logged in.
  // 7. Redirect the user to the dashboard.
  // =====================================================

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (loading) return;

    setError(null);

    // -------------------------------------------------
    // CLIENT VALIDATION
    // -------------------------------------------------

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

      // -------------------------------------------------
      // SERVER VALIDATION
      // -------------------------------------------------
      // Display the API error instead of navigating.
      // -------------------------------------------------

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // -------------------------------------------------
      // AUTHENTICATION SUCCESS
      // -------------------------------------------------
      // Update the global auth provider before navigating.
      // This keeps the Navbar, protected routes, and
      // authenticated UI synchronized immediately.
      // -------------------------------------------------

      await refreshUser();

      router.push("/dashboard");
    } catch {
      // Network failures (offline, server unavailable, etc.)
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-md"
      aria-describedby={error ? "login-error" : undefined}
    >
      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* =====================================================
          EMAIL FIELD
      ===================================================== */}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="email"
          aria-invalid={!!error}
        />
      </div>

      {/* =====================================================
          PASSWORD FIELD
      ===================================================== */}

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="current-password"
          aria-invalid={!!error}
        />
      </div>

      {/* =====================================================
          SUBMIT BUTTON
      ===================================================== */}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}