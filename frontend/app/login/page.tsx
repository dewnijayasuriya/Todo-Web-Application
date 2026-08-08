"use client";

import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import api from "@/services/api";
import type { AuthResponse } from "@/types/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post<AuthResponse>("/login", {
        email,
        password,
      });
      const { token, user } = response.data;

      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-[24px] border border-white/70 bg-white/95 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Sign in to your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Keep your list in one calm, simple workspace.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
