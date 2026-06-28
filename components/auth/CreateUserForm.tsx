"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateUserInput } from "@/types/user";

export default function CreateUserForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (loading) return;

    setError(null);
    setSuccess(null);

    // =========================
    // CLIENT VALIDATION
    // =========================
    if (!firstName.trim()) return setError("First name is required");
    if (!lastName.trim()) return setError("Last name is required");
    if (!birthday) return setError("Birthday is required");
    if (!email.trim()) return setError("Email is required");
    if (!username.trim()) return setError("Username is required");
    if (!password.trim()) return setError("Password is required");

    setLoading(true);

    try {
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

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1200);

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
      aria-describedby={
        error || success ? "form-feedback" : undefined
      }
    >
      {/* FEEDBACK REGION (ACCESSIBLE ANNOUNCEMENT AREA) */}
      {(error || success) && (
        <div
          id="form-feedback"
          role="status"
          aria-live="polite"
          className="text-sm"
        >
          {error && (
            <p className="text-red-600 border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-700 border border-green-200 bg-green-50 p-2 rounded">
              {success}
            </p>
          )}
        </div>
      )}

      {/* FIRST NAME */}
      <label htmlFor="firstName" className="text-sm font-medium">
        First Name
      </label>
      <input
        id="firstName"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2"
        disabled={loading}
        autoComplete="given-name"
      />

      {/* LAST NAME */}
      <label htmlFor="lastName" className="text-sm font-medium">
        Last Name
      </label>
      <input
        id="lastName"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2"
        disabled={loading}
        autoComplete="family-name"
      />

      {/* BIRTHDAY */}
      <label htmlFor="birthday" className="text-sm font-medium">
        Birthday
      </label>
      <input
        id="birthday"
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        className="border p-2"
        disabled={loading}
        autoComplete="bday"
      />

      {/* EMAIL */}
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
        disabled={loading}
        autoComplete="email"
      />

      {/* USERNAME */}
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2"
        disabled={loading}
        autoComplete="username"
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
        className="border p-2"
        disabled={loading}
        autoComplete="new-password"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 disabled:opacity-50"
        aria-busy={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}