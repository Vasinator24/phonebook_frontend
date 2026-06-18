import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../auth/useAuth";
import { getValidationMessage, loginSchema } from "../../types";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const validation = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validation.success) {
      alert(getValidationMessage(validation.error));
      return;
    }

    try {
      await login(validation.data);
      navigate("/users", { replace: true });
    } catch (err) {
      console.error("LOGIN FAILED:", err);
      alert("Wrong Email/username or password.");
    }
  }

  return (
    <main className="min-h-screen bg-[#eef2f1] text-slate-950">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <div className="mb-8 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/20">
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="7" y="2" width="10" height="20" rx="2" />
                <path d="M11 18h2" />
              </svg>
            </span>
            <h1 className="max-w-xl text-5xl font-bold leading-tight">
              Phonebook
            </h1>
          </div>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Manage users and phone numbers from one clean workspace.
          </p>
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 border-l-4 border-l-teal-600 bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-bold">Users</p>
              <p className="mt-1 text-sm text-slate-500">Profiles and contacts</p>
            </div>
            <div className="rounded-lg border border-slate-200 border-l-4 border-l-amber-500 bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-bold">Phones</p>
              <p className="mt-1 text-sm text-slate-500">Numbers by owner</p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/40"
        >
          <div className="mb-7">
            <p className="text-sm font-medium text-slate-500">Welcome back</p>
            <h2 className="mt-1 text-3xl font-bold">Login</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email or username
              </Label>
              <Input
                name="email"
                className="h-11 rounded-lg border-slate-300 bg-slate-50 px-3 focus-visible:border-slate-500 focus-visible:ring-slate-200"
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="h-11 rounded-lg border-slate-300 bg-slate-50 px-3 pr-11 focus-visible:border-slate-500 focus-visible:ring-slate-200"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-950"
                >
                  {showPassword ? (
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.1A10.5 10.5 0 0 1 12 5c5 0 8.5 4.5 9.5 7a12.3 12.3 0 0 1-2 3.1" />
                      <path d="M6.6 6.6A12.3 12.3 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7a10.5 10.5 0 0 0 4.4-.9" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.5 12c1-2.5 4.5-7 9.5-7s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7s-8.5-4.5-9.5-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-lg bg-teal-700 text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-800"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
