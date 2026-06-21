"use client";

import { useState } from "react";
import type { LoginInput } from "@/types/user";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
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
    console.log(data);
  }

  return (
    <form className="flex flex-col gap-4 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-black text-white p-2"
      >
        Login
      </button>
    </form>
  );
}