import React, { useState, type JSX } from "react";
import "./Login.css";

type LoginForm = {
    cpf: string;
    password: string;
    remember: boolean;
};

const isValidCPF = (value: string) => {
    return true; // Temporarily disable CPF validation

    const cpf = (value || "").replace(/\D/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false; // reject repeated digits
    const digits = cpf.split("").map((d) => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
    let rev = (sum * 10) % 11;
    if (rev === 10) rev = 0;
    if (rev !== digits[9]) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
    rev = (sum * 10) % 11;
    if (rev === 10) rev = 0;
    return rev === digits[10];
};

const fakeLogin = async (cpf: string, password: string) => {
    await new Promise((res) => setTimeout(res, 900));
    // demo credentials: CPF 12345678909 and password "password"
    if (cpf.replace(/\D/g, "") === "12345678909" && password === "password") {
        return {
            token: "fake-jwt-token-123",
            user: { name: "Demo User", cpf },
        };
    }
    throw new Error("Invalid credentials");
};

const apiLogin = async (cpf: string, password: string) => {
<<<<<<< HEAD
    const res = await fetch("https://localhost:52467/Doctor/post/login", {
=======
    const res = await fetch("https://localhost:52649/Doctor/post/login", { //mudar pra 5000 se der problem
>>>>>>> 51452479fbc6ae6d700b7f196391079e7d175295
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Cpf: cpf, Password: password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
};

export default function Login(): JSX.Element {
    const [form, setForm] = useState<LoginForm>({
        cpf: "",
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
        if (!form.cpf.trim()) return "CPF é obrigatório.";
        if (!isValidCPF(form.cpf)) return "CPF inválido.";
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
            const res = await apiLogin(form.cpf.trim(), form.password);
            if (form.remember) {
                localStorage.setItem("auth_token", res.token);
            } else {
                sessionStorage.setItem("auth_token", res.token);
            }
            // alert(`Welcome, ${res.token}!`);
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
                    <div className="title" style={{ fontSize: "2rem", fontWeight: "700" }}>Log in</div>
                    <div className="subtitle">
                        Insira seu CPF e senha para acessar sua conta.
                    </div>
                </div>

                <form onSubmit={onSubmit} className="login-form" noValidate>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            id="cpf"
                            name="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            value={form.cpf}
                            onChange={onChange("cpf")}
                            className="input"
                            autoComplete="off"
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
