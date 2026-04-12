"use client";

import { useState } from "react";
import { resetPassword } from "@/app/actions/auth";

export default function ResetTempPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("Password updated successfully!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-surface-container-low p-10 rounded-[2.5rem] editorial-shadow space-y-8">
        <h1 className="text-3xl font-editorial italic text-primary text-center">Temp Reset</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-surface-container-highest border-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-4 rounded-xl bg-surface-container-highest border-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-full font-bold">
            Update Password
          </button>
        </form>
        {message && <p className="text-green-600 font-bold text-center">{message}</p>}
        {error && <p className="text-red-600 font-bold text-center">{error}</p>}
      </div>
    </div>
  );
}
