import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import sdk from "../../sdk";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(4, "Password too short"),
});

const registerSchema = z.object({
  names: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password too short"),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    names: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [backendError, setBackendError] = useState("");

  // LOGIN
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErrors({});
    setBackendError("");

    const validation = loginSchema.safeParse(loginForm);

    if (!validation.success) {
      const err = validation.error.format();

      setErrors({
        email: err.email?._errors[0],
        password: err.password?._errors[0],
      });

      return;
    }

    try {
      const data = await sdk.auth.login(
        loginForm.email,
        loginForm.password
      );

      localStorage.setItem("token", data.token);

      navigate("/users");
    } catch (err: any) {
      setBackendError(err?.response?.data || "Login failed");
    }
  }

  // REGISTER
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setErrors({});
    setBackendError("");

    const validation = registerSchema.safeParse(registerForm);

    if (!validation.success) {
      const err = validation.error.format();

      setErrors({
        names: err.names?._errors[0],
        email: err.email?._errors[0],
        password: err.password?._errors[0],
      });

      return;
    }

    try {
      await sdk.users.create(registerForm);

      setIsLogin(true);

      setRegisterForm({
        names: "",
        email: "",
        password: "",
      });

    } catch (err: any) {
      setBackendError(err?.response?.data || "Register failed");
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-muted">

    <div className="w-[350px] bg-background rounded-xl shadow-lg p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold">📱 PhoneBook</h1>

        <p className="text-muted-foreground">
          {isLogin ? "Login to continue" : "Create your account"}
        </p>
      </div>

      {/* FORM */}
      {isLogin ? (
        <form onSubmit={handleLogin} className="grid gap-4">

          {/* EMAIL */}
          <div className="grid gap-2">
            <Label>Email or username</Label>
            <Input
              type="text"
              placeholder="ivan or ivan@mail.com"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value,
                })
              }
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password..."
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password: e.target.value,
                })
              }
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password}
              </span>
            )}
          </div>

          {/* ERROR */}
          {backendError && (
            <span className="text-red-500 text-sm">
              {backendError}
            </span>
          )}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="grid gap-4">

          {/* NAME */}
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input
              placeholder="John Doe"
              value={registerForm.names}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  names: e.target.value,
                })
              }
            />
            {errors.names && (
              <span className="text-red-500 text-sm">
                {errors.names}
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Email..."
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
                })
              }
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password..."
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  password: e.target.value,
                })
              }
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password}
              </span>
            )}
          </div>

          {/* ERROR */}
          {backendError && (
            <span className="text-red-500 text-sm">
              {backendError}
            </span>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      )}

      {/* FOOTER TOGGLE */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t mt-2">
        <Button
          variant={isLogin ? "default" : "outline"}
          onClick={() => setIsLogin(true)}
          type="button"
        >
          Login
        </Button>

        <Button
          variant={!isLogin ? "default" : "outline"}
          onClick={() => setIsLogin(false)}
          type="button"
        >
          Register
        </Button>
      </div>

    </div>
  </div>
)};
