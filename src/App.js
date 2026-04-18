import { useState, useEffect, useCallback } from "react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════
   CONFIG — change BASE_URL to match your backend
═══════════════════════════════════════════════════════════════════════ */
const BASE_URL = "https://taskflow-backend-t0g7.onrender.com";

const api = async (path, options = {}, token = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
};

/* ═══════════════════════════════════════════════════════════════════════
   THEMES
═══════════════════════════════════════════════════════════════════════ */
const THEMES = {
    obsidian: {
        name: "Obsidian", label: "Dark & Focused",
        preview: ["#0f0f13", "#1a1a24", "#7c6aff"],
        vars: {
            "--bg-primary": "#0f0f13", "--bg-secondary": "#1a1a24", "--bg-card": "#1e1e2e",
            "--bg-hover": "#252538", "--bg-input": "#12121a", "--border": "#2a2a3d",
            "--border-focus": "#7c6aff", "--text-primary": "#e8e8f0", "--text-secondary": "#8888aa",
            "--text-muted": "#555570", "--accent": "#7c6aff", "--accent-dim": "#3d3580",
            "--accent-glow": "rgba(124,106,255,0.15)", "--success": "#34d399", "--warning": "#fbbf24",
            "--danger": "#f87171", "--info": "#60a5fa", "--shadow": "0 4px 24px rgba(0,0,0,0.4)",
            "--shadow-lg": "0 8px 48px rgba(0,0,0,0.6)", "--radius": "14px", "--radius-sm": "8px",
        }
    },
    aurora: {
        name: "Aurora", label: "Light & Fresh",
        preview: ["#f8f7ff", "#eeeeff", "#6366f1"],
        vars: {
            "--bg-primary": "#f8f7ff", "--bg-secondary": "#eeeeff", "--bg-card": "#ffffff",
            "--bg-hover": "#f0efff", "--bg-input": "#f4f3ff", "--border": "#e0dfff",
            "--border-focus": "#6366f1", "--text-primary": "#1e1b4b", "--text-secondary": "#4c4694",
            "--text-muted": "#9d9abf", "--accent": "#6366f1", "--accent-dim": "#c7d2fe",
            "--accent-glow": "rgba(99,102,241,0.12)", "--success": "#059669", "--warning": "#d97706",
            "--danger": "#dc2626", "--info": "#2563eb", "--shadow": "0 4px 24px rgba(99,102,241,0.1)",
            "--shadow-lg": "0 8px 48px rgba(99,102,241,0.18)", "--radius": "14px", "--radius-sm": "8px",
        }
    },
    ember: {
        name: "Ember", label: "Warm & Bold",
        preview: ["#1a0f0a", "#2d1810", "#ff6b35"],
        vars: {
            "--bg-primary": "#1a0f0a", "--bg-secondary": "#2d1810", "--bg-card": "#251510",
            "--bg-hover": "#321c14", "--bg-input": "#1a0e0a", "--border": "#4a2515",
            "--border-focus": "#ff6b35", "--text-primary": "#fde8d8", "--text-secondary": "#c4825a",
            "--text-muted": "#7a4830", "--accent": "#ff6b35", "--accent-dim": "#7a2e10",
            "--accent-glow": "rgba(255,107,53,0.15)", "--success": "#4ade80", "--warning": "#facc15",
            "--danger": "#f87171", "--info": "#67e8f9", "--shadow": "0 4px 24px rgba(0,0,0,0.5)",
            "--shadow-lg": "0 8px 48px rgba(255,107,53,0.15)", "--radius": "14px", "--radius-sm": "8px",
        }
    },
    arctic: {
        name: "Arctic", label: "Cool & Minimal",
        preview: ["#f0f4f8", "#e2e8f0", "#0ea5e9"],
        vars: {
            "--bg-primary": "#f0f4f8", "--bg-secondary": "#e2e8f0", "--bg-card": "#ffffff",
            "--bg-hover": "#dde6f0", "--bg-input": "#edf2f7", "--border": "#cbd5e0",
            "--border-focus": "#0ea5e9", "--text-primary": "#0f172a", "--text-secondary": "#334155",
            "--text-muted": "#94a3b8", "--accent": "#0ea5e9", "--accent-dim": "#bae6fd",
            "--accent-glow": "rgba(14,165,233,0.12)", "--success": "#10b981", "--warning": "#f59e0b",
            "--danger": "#ef4444", "--info": "#6366f1", "--shadow": "0 4px 24px rgba(15,23,42,0.08)",
            "--shadow-lg": "0 8px 48px rgba(14,165,233,0.12)", "--radius": "14px", "--radius-sm": "8px",
        }
    },
    midnight: {
        name: "Midnight", label: "Deep Blue",
        preview: ["#060d1f", "#0d1b38", "#38bdf8"],
        vars: {
            "--bg-primary": "#060d1f", "--bg-secondary": "#0d1b38", "--bg-card": "#0f2044",
            "--bg-hover": "#162b55", "--bg-input": "#071025", "--border": "#1e3a6e",
            "--border-focus": "#38bdf8", "--text-primary": "#e0f2fe", "--text-secondary": "#7dd3fc",
            "--text-muted": "#2b619c", "--accent": "#38bdf8", "--accent-dim": "#0c4a6e",
            "--accent-glow": "rgba(56,189,248,0.15)", "--success": "#34d399", "--warning": "#fbbf24",
            "--danger": "#fb7185", "--info": "#a78bfa", "--shadow": "0 4px 24px rgba(0,0,0,0.6)",
            "--shadow-lg": "0 8px 48px rgba(56,189,248,0.15)", "--radius": "14px", "--radius-sm": "8px",
        }
    },
    sakura: {
        name: "Sakura", label: "Soft & Elegant",
        preview: ["#fff5f7", "#ffe4ea", "#e879a0"],
        vars: {
            "--bg-primary": "#fff5f7", "--bg-secondary": "#ffe4ea", "--bg-card": "#ffffff",
            "--bg-hover": "#ffd6e0", "--bg-input": "#fff0f3", "--border": "#ffc5d3",
            "--border-focus": "#e879a0", "--text-primary": "#4a0520", "--text-secondary": "#9d2551",
            "--text-muted": "#d4899f", "--accent": "#e879a0", "--accent-dim": "#fbb6ce",
            "--accent-glow": "rgba(232,121,160,0.15)", "--success": "#059669", "--warning": "#d97706",
            "--danger": "#dc2626", "--info": "#7c3aed", "--shadow": "0 4px 24px rgba(232,121,160,0.12)",
            "--shadow-lg": "0 8px 48px rgba(232,121,160,0.2)", "--radius": "14px", "--radius-sm": "8px",
        }
    },
};

/* ═══════════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════════ */
const generateId = () => Math.random().toString(36).slice(2, 11);
const PRIORITY_COLORS = { high: "var(--danger)", medium: "var(--warning)", low: "var(--success)" };
const PRIORITY_BG = { high: "rgba(248,113,113,0.12)", medium: "rgba(251,191,36,0.12)", low: "rgba(52,211,153,0.12)" };
const getDayData = () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({
    day: d,
    completed: Math.floor(Math.random() * 8) + 1,
    created: Math.floor(Math.random() * 5) + 1,
}));

/* ═══════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-primary:#0f0f13; --bg-secondary:#1a1a24; --bg-card:#1e1e2e; --bg-hover:#252538;
      --bg-input:#12121a; --border:#2a2a3d; --border-focus:#7c6aff; --text-primary:#e8e8f0;
      --text-secondary:#8888aa; --text-muted:#555570; --accent:#7c6aff; --accent-dim:#3d3580;
      --accent-glow:rgba(124,106,255,0.15); --success:#34d399; --warning:#fbbf24;
      --danger:#f87171; --info:#60a5fa; --shadow:0 4px 24px rgba(0,0,0,0.4);
      --shadow-lg:0 8px 48px rgba(0,0,0,0.6); --radius:14px; --radius-sm:8px;
    }

    body { font-family:'Outfit',sans-serif; background:var(--bg-primary); color:var(--text-primary); line-height:1.6; overflow-x:hidden; transition:background 0.3s,color 0.3s; }
    ::selection { background:var(--accent-glow); color:var(--accent); }

    input, textarea, select {
      font-family:'Outfit',sans-serif; color:var(--text-primary); background:var(--bg-input);
      border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px;
      font-size:14px; width:100%; outline:none; transition:border-color 0.2s,box-shadow 0.2s;
    }
    input:focus, textarea:focus, select:focus { border-color:var(--border-focus); box-shadow:0 0 0 3px var(--accent-glow); }
    input::placeholder, textarea::placeholder { color:var(--text-muted); }
    select option { background:var(--bg-secondary); }

    button { font-family:'Outfit',sans-serif; cursor:pointer; border:none; outline:none; transition:all 0.18s ease; }

    .btn-primary { background:var(--accent); color:#fff; padding:10px 20px; border-radius:var(--radius-sm); font-weight:600; font-size:14px; display:inline-flex; align-items:center; gap:8px; }
    .btn-primary:hover { opacity:0.88; transform:translateY(-1px); box-shadow:var(--shadow); }
    .btn-primary:active { transform:translateY(0); }
    .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

    .btn-ghost { background:transparent; color:var(--text-secondary); padding:8px 14px; border-radius:var(--radius-sm); font-size:14px; border:1.5px solid var(--border); }
    .btn-ghost:hover { background:var(--bg-hover); color:var(--text-primary); border-color:var(--border-focus); }

    .btn-danger { background:rgba(248,113,113,0.15); color:var(--danger); padding:8px 14px; border-radius:var(--radius-sm); font-size:13px; border:1.5px solid rgba(248,113,113,0.25); }
    .btn-danger:hover { background:rgba(248,113,113,0.25); }

    .btn-icon { background:transparent; color:var(--text-muted); padding:7px; border-radius:var(--radius-sm); display:inline-flex; align-items:center; justify-content:center; }
    .btn-icon:hover { background:var(--bg-hover); color:var(--text-primary); }

    .card { background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius); padding:20px; transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s; }
    .card:hover { border-color:var(--border-focus); box-shadow:var(--shadow); }

    .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; }

    .modal-overlay { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.2s ease; }
    .modal-box { background:var(--bg-secondary); border:1.5px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow-lg); width:100%; max-width:560px; animation:slideUp 0.25s ease; max-height:90vh; overflow-y:auto; }

    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes slideUp  { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes fadeInLeft { from{transform:translateX(-12px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes toastIn  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    .skeleton { background:linear-gradient(90deg,var(--border) 25%,var(--bg-hover) 50%,var(--border) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:var(--radius-sm); }
    .spinner  { width:17px; height:17px; border:2px solid rgba(255,255,255,0.35); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }

    .sidebar-link { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:var(--radius-sm); color:var(--text-secondary); cursor:pointer; font-size:14px; font-weight:500; transition:all 0.18s ease; border:1.5px solid transparent; user-select:none; }
    .sidebar-link:hover  { background:var(--bg-hover); color:var(--text-primary); }
    .sidebar-link.active { background:var(--accent-glow); color:var(--accent); border-color:var(--border-focus); }

    .task-card { background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius); padding:18px 20px; transition:all 0.22s ease; position:relative; overflow:hidden; }
    .task-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--accent); opacity:0; transition:opacity 0.2s; }
    .task-card:hover { border-color:var(--border-focus); transform:translateY(-2px); box-shadow:var(--shadow); }
    .task-card:hover::before { opacity:1; }
    .task-card.completed { opacity:0.62; }
    .task-card.completed .task-title { text-decoration:line-through; }
    .task-card[data-priority="high"]::before   { background:var(--danger); }
    .task-card[data-priority="medium"]::before { background:var(--warning); }
    .task-card[data-priority="low"]::before    { background:var(--success); }

    .checkbox { width:20px; height:20px; border:2px solid var(--border); border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.18s ease; }
    .checkbox.checked { background:var(--accent); border-color:var(--accent); }
    .checkbox:hover   { border-color:var(--accent); }

    .search-input { background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px 10px 40px; color:var(--text-primary); font-size:14px; width:260px; transition:all 0.2s; }
    .search-input:focus { border-color:var(--border-focus); box-shadow:0 0 0 3px var(--accent-glow); width:300px; }

    .stat-card { background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius); padding:22px; position:relative; overflow:hidden; transition:transform 0.2s,box-shadow 0.2s; }
    .stat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-lg); }
    .stat-card .glow { position:absolute; top:-20px; right:-20px; width:80px; height:80px; border-radius:50%; filter:blur(25px); opacity:0.25; }

    .theme-card { border:2px solid var(--border); border-radius:var(--radius); padding:16px; cursor:pointer; transition:all 0.2s; }
    .theme-card:hover    { border-color:var(--border-focus); transform:translateY(-2px); }
    .theme-card.selected { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }

    .tag { display:inline-flex; align-items:center; padding:2px 9px; background:var(--bg-hover); color:var(--text-secondary); border-radius:100px; font-size:11px; font-weight:500; border:1px solid var(--border); }

    .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; color:var(--text-muted); text-align:center; gap:12px; }

    .tooltip-wrapper { position:relative; }
    .tooltip { position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:var(--bg-primary); color:var(--text-primary); padding:5px 10px; border-radius:var(--radius-sm); font-size:12px; white-space:nowrap; border:1px solid var(--border); pointer-events:none; opacity:0; transition:opacity 0.15s; z-index:100; }
    .tooltip-wrapper:hover .tooltip { opacity:1; }

    .err-box { background:rgba(248,113,113,0.1); border:1.5px solid rgba(248,113,113,0.3); border-radius:var(--radius-sm); padding:10px 14px; color:var(--danger); font-size:13px; display:flex; align-items:center; gap:8px; }
    .info-box { background:rgba(251,191,36,0.08); border:1.5px solid rgba(251,191,36,0.25); border-radius:var(--radius-sm); padding:10px 14px; color:var(--warning); font-size:13px; }

    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--border); border-radius:100px; }
    ::-webkit-scrollbar-thumb:hover { background:var(--text-muted); }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════════════════════ */
const ToastContainer = ({ toasts, removeToast }) => (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => (
            <div key={t.id} onClick={() => removeToast(t.id)} style={{
                background: "var(--bg-card)", border: "1.5px solid var(--border)",
                borderLeft: `4px solid ${t.type === "success" ? "var(--success)" : t.type === "error" ? "var(--danger)" : "var(--accent)"}`,
                borderRadius: "var(--radius-sm)", padding: "12px 18px", minWidth: 290,
                boxShadow: "var(--shadow-lg)", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                animation: "toastIn 0.3s ease", fontSize: 14,
            }}>
                <span style={{ fontSize: 18 }}>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
                <span style={{ color: "var(--text-primary)", flex: 1 }}>{t.message}</span>
            </div>
        ))}
    </div>
);

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const toast = useCallback((message, type = "info") => {
        const id = generateId();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);
    const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
    return { toasts, toast, removeToast };
};

/* ═══════════════════════════════════════════════════════════════════════
   AUTH PAGE  (username + password — matches your backend exactly)
═══════════════════════════════════════════════════════════════════════ */
const AuthPage = ({ onLogin, toast }) => {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handle = async e => {
        e.preventDefault();
        setError("");
        if (!form.username.trim() || !form.password.trim()) {
            setError("Username and password are required");
            return;
        }
        setLoading(true);
        try {
            const payload = { username: form.username.trim(), password: form.password };
            const data = await api(`/${mode}`, { method: "POST", body: JSON.stringify(payload) });

            if (mode === "signup") {
                toast("Account created! Please sign in.", "success");
                setMode("login");
                setForm(p => ({ ...p, password: "" }));
            } else {
                // { message, token }
                localStorage.setItem("tm_token", data.token);
                localStorage.setItem("tm_username", form.username.trim());
                toast(`Welcome back, ${form.username}! 🎉`, "success");
                onLogin({ username: form.username.trim(), token: data.token });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
            {/* BG blobs */}
            <div style={{ position: "absolute", top: "10%", left: "15%", width: 300, height: 300, borderRadius: "50%", background: "var(--accent)", opacity: 0.04, filter: "blur(80px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "var(--info)", opacity: 0.04, filter: "blur(80px)", pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: 420, animation: "slideUp 0.4s ease" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, background: "var(--accent)", borderRadius: 14, fontSize: 24, marginBottom: 16, boxShadow: "0 8px 24px var(--accent-glow)" }}>⚡</div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>TaskFlow</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Your intelligent productivity workspace</p>
                </div>

                {/* Card */}
                <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "32px", boxShadow: "var(--shadow-lg)" }}>
                    {/* Mode toggle */}
                    <div style={{ display: "flex", background: "var(--bg-primary)", borderRadius: "var(--radius-sm)", padding: 4, marginBottom: 28, border: "1px solid var(--border)" }}>
                        {["login", "signup"].map(m => (
                            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                                flex: 1, padding: "8px 0", borderRadius: "calc(var(--radius-sm) - 2px)",
                                background: mode === m ? "var(--accent)" : "transparent",
                                color: mode === m ? "#fff" : "var(--text-secondary)",
                                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                            }}>{m === "login" ? "Sign In" : "Create Account"}</button>
                        ))}
                    </div>

                    {error && (
                        <div className="err-box" style={{ marginBottom: 16 }}>
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Username</label>
                            <input
                                placeholder="user@gmail.com"
                                value={form.username}
                                autoComplete="username"
                                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            type="submit"
                            style={{ width: "100%", justifyContent: "center", marginTop: 4, height: 44, fontSize: 15 }}
                            disabled={loading}
                        >
                            {loading ? <span className="spinner" /> : mode === "login" ? "Sign In →" : "Create Account →"}
                        </button>
                    </form>

                    <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
                        {mode === "login" ? "Don't have an account? " : "Already have one? "}
                        <span
                            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
                        >
                            {mode === "login" ? "Sign up free" : "Sign in"}
                        </span>
                    </div>
                </div>

                <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
                    Connected to your Express + MongoDB backend at <code style={{ fontFamily: "'JetBrains Mono',monospace" }}>{BASE_URL}</code>
                </p>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   THEME MODAL
═══════════════════════════════════════════════════════════════════════ */
const ThemeModal = ({ currentTheme, onSelect, onClose }) => (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box" style={{ maxWidth: 680 }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>🎨 Choose Theme</h2>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Personalize your workspace</p>
                </div>
                <button className="btn-icon" onClick={onClose} style={{ fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 14 }}>
                {Object.entries(THEMES).map(([key, theme]) => (
                    <div key={key} className={`theme-card ${currentTheme === key ? "selected" : ""}`} onClick={() => { onSelect(key); onClose(); }}>
                        <div style={{ height: 64, borderRadius: 8, marginBottom: 12, overflow: "hidden", display: "flex" }}>
                            {theme.preview.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{theme.name}</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{theme.label}</div>
                            </div>
                            {currentTheme === key && <span style={{ color: "var(--accent)", fontSize: 16 }}>✓</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   TASK MODAL
═══════════════════════════════════════════════════════════════════════ */
const TaskModal = ({ task, onSave, onClose, saving }) => {
    const [form, setForm] = useState(
        task
            ? { title: task.title, description: task.description || "", priority: task.priority || "medium", status: task.status || "pending" }
            : { title: "", description: "", priority: "medium", status: "pending" }
    );
    const isEdit = !!task;

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div style={{ padding: "22px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: 17, fontWeight: 700 }}>{isEdit ? "✏️ Edit Task" : "➕ New Task"}</h2>
                    <button className="btn-icon" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Task Title *</label>
                        <input placeholder="What needs to be done?" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Description</label>
                        <textarea rows={3} placeholder="Add more details…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: "vertical" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Priority</label>
                            <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                                <option value="high">🔴 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>
                        </div>
                        {isEdit && (
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Status</label>
                                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="completed">✅ Completed</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button className="btn-ghost" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-primary"
                        disabled={saving || !form.title.trim()}
                        onClick={() => form.title.trim() && onSave(form)}
                    >
                        {saving ? <span className="spinner" /> : isEdit ? "Save Changes" : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   TASK CARD
═══════════════════════════════════════════════════════════════════════ */
const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
    const priority = task.priority || "medium";
    const isComplete = task.status === "completed";

    return (
        <div className={`task-card ${isComplete ? "completed" : ""}`} data-priority={priority}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>

                {/* Checkbox */}
                <div className={`checkbox ${isComplete ? "checked" : ""}`} onClick={() => onToggle(task)}>
                    {isComplete && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                        <h3 className="task-title" style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, wordBreak: "break-word" }}>
                            {task.title}
                        </h3>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <button className="btn-icon" style={{ fontSize: 13 }} onClick={() => onEdit(task)}>✏️</button>
                            <button className="btn-icon" style={{ fontSize: 13, color: "var(--danger)" }} onClick={() => onDelete(task._id)}>🗑️</button>
                        </div>
                    </div>

                    {task.description && (
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {task.description}
                        </p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                        <span className="badge" style={{ background: PRIORITY_BG[priority], color: PRIORITY_COLORS[priority] }}>{priority}</span>
                        <span className="tag">{isComplete ? "✅ Done" : "⏳ Pending"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
                            {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   TASKS VIEW — all CRUD wired in backend
═══════════════════════════════════════════════════════════════════════ */
const TasksView = ({ token, toast }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("newest");

    /* ── GET /tasks ── */
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api("/tasks", { method: "GET" }, token);
            setTasks(data.tasks || []);
        } catch (err) {
            toast(err.message, "error");
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    /* ── POST /tasks ── */
    const createTask = async form => {
        setSaving(true);
        try {
            const data = await api("/tasks", { method: "POST", body: JSON.stringify(form) }, token);
            setTasks(p => [data.task, ...p]);
            toast("Task created! 🎉", "success");
            setShowModal(false);
        } catch (err) { toast(err.message, "error"); }
        finally { setSaving(false); }
    };

    /* ── PUT /tasks/:id ── */
    const updateTask = async (id, updates) => {
        setSaving(true);
        try {
            const data = await api(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(updates) }, token);
            setTasks(p => p.map(t => t._id === id ? data.task : t));
            toast("Task updated!", "success");
            setShowModal(false); setEditTask(null);
        } catch (err) { toast(err.message, "error"); }
        finally { setSaving(false); }
    };

    /* ── toggle via PUT ── */
    const toggleTask = async task => {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        try {
            const data = await api(`/tasks/${task._id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) }, token);
            setTasks(p => p.map(t => t._id === task._id ? data.task : t));
        } catch (err) { toast(err.message, "error"); }
    };

    /* ── DELETE /tasks/:id ── */
    const deleteTask = async id => {
        try {
            await api(`/tasks/${id}`, { method: "DELETE" }, token);
            setTasks(p => p.filter(t => t._id !== id));
            toast("Task deleted", "error");
        } catch (err) { toast(err.message, "error"); }
    };

    const handleSave = form => {
        if (editTask) updateTask(editTask._id, form);
        else createTask(form);
    };

    /* ── filter + sort ── */
    const filtered = tasks
        .filter(t => {
            if (filter === "completed") return t.status === "completed";
            if (filter === "pending") return t.status === "pending";
            if (filter === "high") return t.priority === "high";
            return true;
        })
        .filter(t => !search ||
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.description || "").toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sort === "priority") { const o = { high: 0, medium: 1, low: 2 }; return (o[a.priority] ?? 1) - (o[b.priority] ?? 1); }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const pendingCount = tasks.filter(t => t.status === "pending").length;
    const completedCount = tasks.filter(t => t.status === "completed").length;

    return (
        <div style={{ animation: "fadeInLeft 0.3s ease" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>My Tasks</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
                        {loading ? "Loading from database…" : `${pendingCount} pending · ${completedCount} completed`}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Task
                </button>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                    <input className="search-input" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: "auto" }}>
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="high">High Priority</option>
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: "auto" }}>
                    <option value="newest">Newest First</option>
                    <option value="priority">By Priority</option>
                </select>
                <button className="btn-ghost" onClick={fetchTasks} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    ↻ Refresh
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
                            <div style={{ display: "flex", gap: 14 }}>
                                <div className="skeleton" style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: 16, width: "55%", marginBottom: 10 }} />
                                    <div className="skeleton" style={{ height: 12, width: "80%", marginBottom: 12 }} />
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <div className="skeleton" style={{ height: 20, width: 60 }} />
                                        <div className="skeleton" style={{ height: 20, width: 70 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div style={{ fontSize: 56 }}>{search ? "🔍" : filter !== "all" ? "🎯" : "📭"}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-secondary)" }}>
                        {search ? "No tasks found" : filter !== "all" ? "No tasks here" : "No tasks yet"}
                    </h3>
                    <p style={{ fontSize: 14, maxWidth: 280 }}>
                        {search ? `No match for "${search}"` : "Create your first task to get started!"}
                    </p>
                    {!search && (
                        <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => setShowModal(true)}>+ Create Task</button>
                    )}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filtered.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onToggle={toggleTask}
                            onEdit={t => { setEditTask(t); setShowModal(true); }}
                            onDelete={deleteTask}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <TaskModal
                    task={editTask}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditTask(null); }}
                    saving={saving}
                />
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   ANALYTICS — reads real tasks from backend
═══════════════════════════════════════════════════════════════════════ */
const Analytics = ({ token, toast }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dayData] = useState(getDayData);

    useEffect(() => {
        api("/tasks", { method: "GET" }, token)
            .then(d => setTasks(d.tasks || []))
            .catch(e => toast(e.message, "error"))
            .finally(() => setLoading(false));
    }, [token]);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const rate = total ? Math.round((completed / total) * 100) : 0;
    const highPrio = tasks.filter(t => t.priority === "high" && t.status === "pending").length;

    const pieData = [
        { name: "Completed", value: completed || 0, color: "var(--success)" },
        { name: "Pending", value: pending || 0, color: "var(--accent)" },
    ];

    const StatCard = ({ icon, label, value, color, sub }) => (
        <div className="stat-card">
            <div className="glow" style={{ background: color }} />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>
                {loading ? <span className="skeleton" style={{ display: "inline-block", width: 40, height: 32 }} /> : value}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
        </div>
    );

    return (
        <div style={{ animation: "fadeInLeft 0.3s ease" }}>
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Analytics Dashboard</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Your productivity at a glance</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard icon="📋" label="Total Tasks" value={total} color="var(--accent)" />
                <StatCard icon="✅" label="Completed" value={completed} color="var(--success)" sub={`${rate}% rate`} />
                <StatCard icon="⏳" label="Pending" value={pending} color="var(--warning)" />
                <StatCard icon="🚨" label="High Priority" value={highPrio} color="var(--danger)" sub="Needs attention" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Daily Activity (Sample)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={dayData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
                            <Bar dataKey="completed" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Completion Rate</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={total ? pieData : [{ name: "None", value: 1, color: "var(--border)" }]}
                                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}
                                >
                                    {(total ? pieData : [{ color: "var(--border)" }]).map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{rate}%</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Complete</div>
                            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                                {pieData.map(d => (
                                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                                        <span style={{ color: "var(--text-secondary)" }}>{d.name}: <strong style={{ color: "var(--text-primary)" }}>{d.value}</strong></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Weekly Trend (Sample)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
                        <Line type="monotone" dataKey="completed" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: "var(--accent)", r: 4 }} />
                        <Line type="monotone" dataKey="created" stroke="var(--info)" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: "var(--info)", r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════════════════ */
const Settings = ({ user, currentTheme, onTheme, toast, onLogout }) => {
    const [notifs, setNotifs] = useState({ email: true, deadline: true, reminders: false });
    const [themeModal, setThemeModal] = useState(false);

    return (
        <div style={{ animation: "fadeInLeft 0.3s ease", maxWidth: 620 }}>
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Settings</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Manage your account and preferences</p>
            </div>

            {/* Profile */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>👤 Profile</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {user.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>@{user.username}</div>
                        <div style={{ fontSize: 13, color: "var(--success)", marginTop: 2 }}>● Connected to MongoDB</div>
                    </div>
                </div>
            </div>

            {/* Theme */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>🎨 Appearance</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Current: <span style={{ color: "var(--accent)" }}>{THEMES[currentTheme]?.name}</span></div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{THEMES[currentTheme]?.label}</div>
                    </div>
                    <button className="btn-primary" onClick={() => setThemeModal(true)}>Change Theme</button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    {THEMES[currentTheme]?.preview.map((c, i) => (
                        <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid var(--border)" }} />
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>🔔 Notifications</h3>
                {[
                    { key: "email", label: "Email notifications", desc: "Requires email field in backend (coming soon)" },
                    { key: "deadline", label: "Deadline reminders", desc: "Alert when tasks are due soon" },
                    { key: "reminders", label: "Missed deadline alerts", desc: "Alert on overdue tasks" },
                ].map(n => (
                    <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{n.label}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{n.desc}</div>
                        </div>
                        <div
                            onClick={() => { setNotifs(p => ({ ...p, [n.key]: !p[n.key] })); toast(`${n.label} ${notifs[n.key] ? "disabled" : "enabled"}`, "info"); }}
                            style={{ width: 44, height: 24, borderRadius: 100, cursor: "pointer", position: "relative", background: notifs[n.key] ? "var(--accent)" : "var(--border)", transition: "background 0.2s" }}
                        >
                            <div style={{ position: "absolute", top: 3, left: notifs[n.key] ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Backend info */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🔌 Backend Connection</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>API Base URL</span>
                        <code style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--accent)", fontSize: 12 }}>{BASE_URL}</code>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Auth</span>
                        <span style={{ color: "var(--success)" }}>JWT Bearer Token</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Database</span>
                        <span style={{ color: "var(--success)" }}>MongoDB Atlas</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Token expires</span>
                        <span style={{ color: "var(--warning)" }}>1 hour</span>
                    </div>
                </div>
            </div>

            {/* Danger zone */}
            <div className="card" style={{ borderColor: "rgba(248,113,113,0.3)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "var(--danger)" }}>⚠️ Danger Zone</h3>
                <button className="btn-danger" onClick={onLogout}>Sign Out</button>
            </div>

            {themeModal && <ThemeModal currentTheme={currentTheme} onSelect={onTheme} onClose={() => setThemeModal(false)} />}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
    // Rehydrate auth from localStorage on mount
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("tm_token");
        const username = localStorage.getItem("tm_username");
        return token && username ? { token, username } : null;
    });
    const [theme, setTheme] = useState(() => localStorage.getItem("tm_theme") || "obsidian");
    const [page, setPage] = useState("tasks");
    const [themeModal, setThemeModal] = useState(false);
    const { toasts, toast, removeToast } = useToast();

    // Apply CSS custom properties whenever theme changes
    useEffect(() => {
        const vars = THEMES[theme]?.vars || THEMES.obsidian.vars;
        Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
        localStorage.setItem("tm_theme", theme);
    }, [theme]);

    const applyTheme = key => { setTheme(key); toast(`Theme → ${THEMES[key].name} ✨`, "success"); };
    const handleLogin = ({ username, token }) => setAuth({ username, token });
    const handleLogout = () => {
        localStorage.removeItem("tm_token");
        localStorage.removeItem("tm_username");
        setAuth(null);
        setPage("tasks");
        toast("Signed out", "info");
    };

    /* ── NOT LOGGED IN ── */
    if (!auth) return (
        <>
            <GlobalStyles />
            <AuthPage onLogin={handleLogin} toast={toast} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );

    const NAV = [
        { id: "tasks", icon: "✅", label: "Tasks" },
        { id: "analytics", icon: "📊", label: "Analytics" },
        { id: "settings", icon: "⚙️", label: "Settings" },
    ];

    /* ── LOGGED IN ── */
    return (
        <>
            <GlobalStyles />
            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

                {/* ────── SIDEBAR ────── */}
                <aside style={{
                    width: 240, flexShrink: 0,
                    background: "var(--bg-secondary)", borderRight: "1.5px solid var(--border)",
                    display: "flex", flexDirection: "column",
                    padding: "20px 16px", gap: 4, overflowY: "auto",
                }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingLeft: 4 }}>
                        <div style={{ width: 34, height: 34, background: "var(--accent)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 12px var(--accent-glow)" }}>⚡</div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>TaskFlow</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}>v2.0</div>
                        </div>
                    </div>

                    {/* User card */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-card)", borderRadius: "var(--radius-sm)", marginBottom: 20, border: "1.5px solid var(--border)" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                            {auth.username[0].toUpperCase()}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{auth.username}</div>
                            <div style={{ fontSize: 10, color: "var(--success)" }}>● Live</div>
                        </div>
                    </div>

                    {/* Nav label */}
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 4, marginBottom: 6 }}>Navigation</div>

                    {NAV.map(item => (
                        <div key={item.id} className={`sidebar-link ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}

                    <div style={{ flex: 1 }} />

                    {/* Bottom */}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div className="sidebar-link" onClick={() => setThemeModal(true)}>
                            <span style={{ fontSize: 16 }}>🎨</span>
                            <span>Themes</span>
                            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>{THEMES[theme]?.name}</span>
                        </div>
                        <div className="sidebar-link" onClick={handleLogout}>
                            <span style={{ fontSize: 16 }}>🚪</span>
                            <span style={{ color: "var(--danger)" }}>Sign Out</span>
                        </div>
                    </div>
                </aside>

                {/* ────── MAIN ────── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    {/* Topbar */}
                    <header style={{ background: "var(--bg-secondary)", borderBottom: "1.5px solid var(--border)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                        <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>
                            {page === "tasks" ? "📋 Tasks" : page === "analytics" ? "📊 Analytics" : "⚙️ Settings"}
                        </h2>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="tooltip-wrapper">
                                <button className="btn-icon" style={{ fontSize: 18 }} onClick={() => setThemeModal(true)}>🎨</button>
                                <span className="tooltip">Change Theme</span>
                            </div>
                            {/* Live indicator */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 100 }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)" }} />
                                <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600 }}>Live</span>
                            </div>
                            {/* Avatar */}
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px var(--accent-glow)" }}>
                                {auth.username[0].toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main style={{ flex: 1, overflow: "auto", padding: "28px" }}>
                        {page === "tasks" && <TasksView token={auth.token} toast={toast} />}
                        {page === "analytics" && <Analytics token={auth.token} toast={toast} />}
                        {page === "settings" && (
                            <Settings
                                user={{ username: auth.username }}
                                currentTheme={theme}
                                onTheme={applyTheme}
                                toast={toast}
                                onLogout={handleLogout}
                            />
                        )}
                    </main>
                </div>
            </div>

            {themeModal && <ThemeModal currentTheme={theme} onSelect={applyTheme} onClose={() => setThemeModal(false)} />}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}