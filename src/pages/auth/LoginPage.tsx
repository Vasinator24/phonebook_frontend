import { useState } from "react";
import { z } from "zod";
import sdk from "../../sdk";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const registerSchema = z.object({
  names: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function LoginPage() {
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = loginSchema.safeParse(loginForm);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const data = await sdk.auth.login(
        loginForm.email,
        loginForm.password
      );

      localStorage.setItem("token", data.token);

      window.location.href = "/phones";
    } catch (err: any) {
      setError(err?.response?.data || "Login failed");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = registerSchema.safeParse(registerForm);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await sdk.users.create({
        names: registerForm.names,
        email: registerForm.email,
        password: registerForm.password,
      });

      setSuccess("Account created successfully");

      setRegisterForm({
        names: "",
        email: "",
        password: "",
      });

      setIsLogin(true);
    } catch (err: any) {
      setError(err?.response?.data || "Register failed");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 400,
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>
          PhoneBook
        </h1>

        <div
          style={{
            display: "flex",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: 10,
              background: isLogin ? "#222" : "#ddd",
              color: isLogin ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: 10,
              background: !isLogin ? "#222" : "#ddd",
              color: !isLogin ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  password: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: 12,
                background: "#222",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              placeholder="Full Name"
              value={registerForm.names}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  names: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  password: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: 12,
                background: "#222",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create Account
            </button>
          </form>
        )}

        {error && (
          <p
            style={{
              color: "red",
              marginTop: 15,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            style={{
              color: "green",
              marginTop: 15,
              textAlign: "center",
            }}
          >
            {success}
          </p>
        )}
      </div>
    </div>
  );
}
