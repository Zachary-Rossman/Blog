"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateUserInput } from "@/types/User";

// ======================================================
// CREATE USER FORM
// ======================================================
// This component handles user registration.
//
// Responsibilities:
// - Collect registration information
// - Validate required fields before submitting
// - Send a POST request to /api/users
// - Display success and error feedback
// - Redirect new users to the login page after
//   a successful registration
//
// This component is purely responsible for the UI.
// Database creation and validation happen inside
// the API route.
// ======================================================

export default function CreateUserForm() {
  const router = useRouter();

  // --------------------------------------------------
  // Form state
  // --------------------------------------------------
  // Each field is controlled so React always has the
  // latest value entered by the user.
  // --------------------------------------------------

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // --------------------------------------------------
  // UI state
  // --------------------------------------------------
  // loading:
  // Prevents duplicate submissions while waiting
  // for the server.
  //
  // success:
  // Displays confirmation after the account is
  // successfully created.
  //
  // error:
  // Displays validation or server errors.
  // --------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ==================================================
  // Handle Form Submission
  // ==================================================
  // Workflow:
  //
  // 1. Prevent normal form submission
  // 2. Prevent duplicate requests
  // 3. Reset previous messages
  // 4. Validate required fields
  // 5. Build request payload
  // 6. Send POST request
  // 7. Handle API response
  // 8. Redirect to login after success
  // ==================================================

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (loading) return;

    setError(null);
    setSuccess(null);

    // --------------------------------------------------
    // Client-side validation
    //
    // These checks improve the user experience by
    // preventing unnecessary API requests.
    //
    // The server performs validation again for security.
    // --------------------------------------------------

    if (!firstName.trim()) return setError("First name is required");
    if (!lastName.trim()) return setError("Last name is required");
    if (!birthday) return setError("Birthday is required");
    if (!email.trim()) return setError("Email is required");
    if (!username.trim()) return setError("Username is required");
    if (!password.trim()) return setError("Password is required");

    setLoading(true);

    try {
      // Build request payload using the shared type.
      const newUser: CreateUserInput = {
        firstName,
        lastName,
        birthday,
        email,
        username,
        password,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      // Display API validation errors.
      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Show success feedback before redirecting.
      setSuccess("Account created successfully!");

      // Small delay so users can read the success message.
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      // Handles network failures such as no internet
      // connection or an unreachable server.
      setError("Network error. Please try again.");
    } finally {
      // Always restore the form state.
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-md"
      aria-describedby={error || success ? "form-feedback" : undefined}
    >
      {/* ==================================================
          FEEDBACK MESSAGES
      ================================================== */}

      {(error || success) && (
        <div
          id="form-feedback"
          role={error ? "alert" : "status"}
          aria-live="polite"
          className="space-y-2"
        >
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </p>
          )}
        </div>
      )}

      {/* ==================================================
          FIRST NAME
      ================================================== */}

      <div className="space-y-1">
        <label htmlFor="firstName" className="text-sm font-medium">
          First Name
        </label>

        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="given-name"
        />
      </div>

      {/* ==================================================
          LAST NAME
      ================================================== */}

      <div className="space-y-1">
        <label htmlFor="lastName" className="text-sm font-medium">
          Last Name
        </label>

        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="family-name"
        />
      </div>

      {/* ==================================================
          BIRTHDAY
      ================================================== */}

      <div className="space-y-1">
        <label htmlFor="birthday" className="text-sm font-medium">
          Birthday
        </label>

        <input
          id="birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="bday"
        />
      </div>

      {/* ==================================================
          EMAIL
      ================================================== */}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {/* ==================================================
          USERNAME
      ================================================== */}

      <div className="space-y-1">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>

        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="username"
        />
      </div>

      {/* ==================================================
          PASSWORD
      ================================================== */}

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      {/* ==================================================
          SUBMIT BUTTON
      ================================================== */}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}