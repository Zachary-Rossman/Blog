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

    setLoading(true);
    setError(null);
    setSuccess(null);

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

      // Small UX delay so user sees success message
      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 max-w-md"
    >
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        className="border p-2"
        required
      />

      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        className="border p-2"
        required
      />

      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        placeholder="Birthday"
        className="border p-2"
        required
      />

      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2"
        required
      />

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2"
        required
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {success && (
        <p className="text-green-600 text-sm">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}