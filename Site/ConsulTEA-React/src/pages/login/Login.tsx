import React, { useState, type JSX } from "react";
import "./Login.css";

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

const fakeLogin = async (email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 900));
    if (email === "user@example.com" && password === "password") {
        return {
            token: "fake-jwt-token-123",
            user: { name: "Demo User", email },
        };
    }
    throw new Error("Invalid credentials");
};

export default function Login(): JSX.Element {
    const [form, setForm] = useState<LoginForm>({
        email: "",
        password: "",
        remember: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const onChange =
        (key: keyof LoginForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = key === "remember" ? e.target.checked : e.target.value;
            setForm((s) => ({ ...s, [key]: value }));
        };

    const validate = (): string | null => {
        if (!form.email.trim()) return "Email is required.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email.";
        if (!form.password) return "Password is required.";
        if (form.password.length < 4) return "Password must be at least 4 characters.";
        return null;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setLoading(true);
        try {
            const res = await fakeLogin(form.email.trim(), form.password);
            if (form.remember) {
                localStorage.setItem("auth_token", res.token);
            } else {
                sessionStorage.setItem("auth_token", res.token);
            }
            window.location.href = "/";
        } catch (err: any) {
            setError(err?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container" role="main" aria-labelledby="login-heading">
                <div id="login-heading" className="login-header">
                    <div className="title">Sign in</div>
                    <div className="subtitle">
                        Use <strong>user@example.com</strong> / <strong>password</strong> for demo
                    </div>
                </div>

                <form onSubmit={onSubmit} className="login-form" noValidate>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={onChange("email")}
                            className="input"
                            autoComplete="email"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-row">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                value={form.password}
                                onChange={onChange("password")}
                                className="input"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="password-toggle"
                                aria-pressed={showPassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="form-row">
                        <label className="remember">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                checked={form.remember}
                                onChange={onChange("remember")}
                                disabled={loading}
                            />
                            <span style={{ marginLeft: 8 }}>Remember me</span>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
