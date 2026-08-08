"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />

        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white shadow-sm">
            T
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
            Todo Web App
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            A calm place to plan your day.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Minimal, focused, and polished. Register or sign in to manage your
            todos from a single serene dashboard.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
          >
            I already have an account
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Fast authentication, lightweight todo CRUD, and a distraction-free UI.
        </p>
      </div>
    </main>
  );
}
