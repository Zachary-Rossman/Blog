"use client";

import { useState } from "react";
import type { CreateUserInput } from "@/types/user";

export default function CreateUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
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

  console.log(data);
}

  return (
    <form className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        className="border p-2"
      />

      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        className="border p-2"
      />

      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        placeholder="Birthday"
        className="border p-2"
      />

      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2"
      />

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2"
      />

      <input
        type="text"
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
        Create Account
      </button>
    </form>
  );
}