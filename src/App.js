import { useState, useEffect, useCallback, useRef } from "react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════
   CONFIG
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
   GLOBAL STYLES — fully responsive with media queries
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
      --sidebar-width: 240px;
    }

    html { font-size: 16px; }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
      -webkit-font-smoothing: antialiased;
    }

    ::selection { background: var(--accent-glow); color: var(--accent); }

    input, textarea, select {
      font-family: 'Outfit', sans-serif;
      color: var(--text-primary);
      background: var(--bg-input);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      font-size: 15px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
      appearance: none;
      min-height: 44px; /* touch target */
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }
    select option { background: var(--bg-secondary); }

    button {
      font-family: 'Outfit', sans-serif;
      cursor: pointer;
      border: none;
      outline: none;
      transition: all 0.18s ease;
      min-height: 44px; /* touch target */
      touch-action: manipulation;
    }

    .btn-primary {
      background: var(--accent);
      color: #fff;
      padding: 11px 22px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: var(--shadow); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      border: 1.5px solid var(--border);
    }
    .btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--border-focus); }

    .btn-danger {
      background: rgba(248,113,113,0.15);
      color: var(--danger);
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      border: 1.5px solid rgba(248,113,113,0.25);
      min-height: 44px;
    }
    .btn-danger:hover { background: rgba(248,113,113,0.25); }

    .btn-icon {
      background: transparent;
      color: var(--text-muted);
      padding: 9px;
      border-radius: var(--radius-sm);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      min-width: 40px;
    }
    .btn-icon:hover { background: var(--bg-hover); color: var(--text-primary); }

    .card {
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .card:hover { border-color: var(--border-focus); box-shadow: var(--shadow); }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: flex-end; /* mobile: sheet from bottom */
      justify-content: center;
      padding: 0;
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: var(--bg-secondary);
      border: 1.5px solid var(--border);
      border-radius: var(--radius) var(--radius) 0 0;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 100%;
      animation: slideUp 0.28s ease;
      max-height: 92vh;
      overflow-y: auto;
    }

    @media (min-width: 600px) {
      .modal-overlay {
        align-items: center;
        padding: 20px;
      }
      .modal-box {
        max-width: 560px;
        border-radius: var(--radius);
      }
    }

    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes slideUp  { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes fadeInLeft { from{transform:translateX(-12px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes toastIn  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    .skeleton {
      background: linear-gradient(90deg,var(--border) 25%,var(--bg-hover) 50%,var(--border) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }
    .spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    /* Sidebar nav link */
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.18s ease;
      border: 1.5px solid transparent;
      user-select: none;
      min-height: 46px;
    }
    .sidebar-link:hover  { background: var(--bg-hover); color: var(--text-primary); }
    .sidebar-link.active { background: var(--accent-glow); color: var(--accent); border-color: var(--border-focus); }

    /* Task card */
    .task-card {
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 16px 18px;
      transition: all 0.22s ease;
      position: relative;
      overflow: hidden;
    }
    .task-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--accent);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .task-card:hover { border-color: var(--border-focus); transform: translateY(-2px); box-shadow: var(--shadow); }
    .task-card:hover::before { opacity: 1; }
    .task-card.completed { opacity: 0.62; }
    .task-card.completed .task-title { text-decoration: line-through; }
    .task-card[data-priority="high"]::before   { background: var(--danger); }
    .task-card[data-priority="medium"]::before { background: var(--warning); }
    .task-card[data-priority="low"]::before    { background: var(--success); }

    .checkbox {
      width: 22px; height: 22px;
      border: 2px solid var(--border);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.18s ease;
      min-width: 22px;
    }
    .checkbox.checked { background: var(--accent); border-color: var(--accent); }
    .checkbox:hover   { border-color: var(--accent); }

    .search-input {
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 11px 14px 11px 42px;
      color: var(--text-primary);
      font-size: 14px;
      width: 100%;
      transition: all 0.2s;
    }
    .search-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-glow); }

    .stat-card {
      background: var(--bg-card);
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .stat-card .glow {
      position: absolute; top: -20px; right: -20px;
      width: 80px; height: 80px;
      border-radius: 50%;
      filter: blur(25px);
      opacity: 0.25;
    }

    .theme-card {
      border: 2px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .theme-card:hover    { border-color: var(--border-focus); transform: translateY(-2px); }
    .theme-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

    .tag {
      display: inline-flex;
      align-items: center;
      padding: 2px 9px;
      background: var(--bg-hover);
      color: var(--text-secondary);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
      border: 1px solid var(--border);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 20px;
      color: var(--text-muted);
      text-align: center;
      gap: 12px;
    }

    .err-box {
      background: rgba(248,113,113,0.1);
      border: 1.5px solid rgba(248,113,113,0.3);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      color: var(--danger);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 100px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

    /* ── Bottom nav (mobile) ── */
    .bottom-nav {
      display: none;
    }

    /* ── Sidebar overlay (mobile) ── */
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 199;
      backdrop-filter: blur(2px);
    }
    .sidebar-overlay.visible { display: block; }

    /* ── App shell layout ── */
    .app-shell {
      display: flex;
      height: 100dvh;
      overflow: hidden;
    }

    .app-sidebar {
      width: var(--sidebar-width);
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-right: 1.5px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 20px 14px;
      gap: 4px;
      overflow-y: auto;
      transition: transform 0.3s ease;
      z-index: 200;
    }

    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .app-topbar {
      background: var(--bg-secondary);
      border-bottom: 1.5px solid var(--border);
      padding: 0 20px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      gap: 12px;
    }

    .app-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px 20px;
    }

    /* ── Responsive: Mobile (< 768px) ── */
    @media (max-width: 767px) {
      :root { --sidebar-width: 260px; }

      .app-sidebar {
        position: fixed;
        top: 0; left: 0; bottom: 0;
        transform: translateX(-100%);
        border-right: 1.5px solid var(--border);
        box-shadow: var(--shadow-lg);
      }
      .app-sidebar.open { transform: translateX(0); }

      .app-content { padding: 16px 14px 90px; } /* pb for bottom nav */

      .bottom-nav {
        display: flex;
        position: fixed;
        bottom: 0; left: 0; right: 0;
        background: var(--bg-secondary);
        border-top: 1.5px solid var(--border);
        z-index: 100;
        padding: 6px 0 env(safe-area-inset-bottom, 6px);
      }

      .bottom-nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 6px 0;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.18s;
        color: var(--text-muted);
        font-size: 11px;
        font-weight: 600;
      }
      .bottom-nav-item.active { color: var(--accent); }
      .bottom-nav-item span.icon { font-size: 20px; line-height: 1; }

      .topbar-title { font-size: 15px !important; }

      /* Stack analytics charts */
      .analytics-grid { grid-template-columns: 1fr !important; }
      .stat-grid { grid-template-columns: 1fr 1fr !important; }

      /* Pie + legend stacked */
      .pie-row { flex-direction: column !important; align-items: center !important; }

      /* Filters row wraps */
      .filters-row { flex-wrap: wrap !important; }
      .filters-row .search-wrap { width: 100% !important; }
      .filters-row select { flex: 1 !important; min-width: 120px !important; }

      .task-actions { gap: 2px !important; }

      .auth-card { border-radius: var(--radius) !important; }
    }

    /* ── Responsive: Tablet (768px – 1023px) ── */
    @media (min-width: 768px) and (max-width: 1023px) {
      :root { --sidebar-width: 200px; }
      .app-content { padding: 20px 18px; }
      .stat-grid { grid-template-columns: 1fr 1fr !important; }
      .analytics-grid { grid-template-columns: 1fr 1fr !important; }
    }

    /* Toast */
    .toast-stack {
      position: fixed;
      bottom: 80px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: calc(100vw - 32px);
    }
    @media (min-width: 600px) {
      .toast-stack { bottom: 24px; right: 24px; max-width: 340px; }
    }

    /* Settings grid */
    .settings-wrap { max-width: 640px; }

    /* Theme grid */
    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
      gap: 12px;
      padding: 20px;
    }
    @media (max-width: 480px) {
      .theme-grid { grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════════════════════ */
const ToastContainer = ({ toasts, removeToast }) => (
    <div className="toast-stack">
        {toasts.map(t => (
            <div key={t.id} onClick={() => removeToast(t.id)} style={{
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                borderLeft: `4px solid ${t.type === "success" ? "var(--success)" : t.type === "error" ? "var(--danger)" : "var(--accent)"}`,
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                boxShadow: "var(--shadow-lg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                animation: "toastIn 0.3s ease",
                fontSize: 14,
            }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
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
   AUTH PAGE — auto-login after signup
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

            if (mode === "signup") {
                // Step 1: create account
                await api("/signup", { method: "POST", body: JSON.stringify(payload) });
                // Step 2: immediately log in — no second prompt needed
                const loginData = await api("/login", { method: "POST", body: JSON.stringify(payload) });
                localStorage.setItem("tm_token", loginData.token);
                localStorage.setItem("tm_username", form.username.trim());
                toast(`Welcome to TaskFlow, ${form.username.trim()}! 🎉`, "success");
                onLogin({ username: form.username.trim(), token: loginData.token });
            } else {
                const data = await api("/login", { method: "POST", body: JSON.stringify(payload) });
                localStorage.setItem("tm_token", data.token);
                localStorage.setItem("tm_username", form.username.trim());
                toast(`Welcome back, ${form.username.trim()}! 👋`, "success");
                onLogin({ username: form.username.trim(), token: data.token });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100dvh",
            background: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 16px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* BG blobs */}
            <div style={{ position: "absolute", top: "8%", left: "10%", width: 320, height: 320, borderRadius: "50%", background: "var(--accent)", opacity: 0.05, filter: "blur(90px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 260, height: 260, borderRadius: "50%", background: "var(--info)", opacity: 0.04, filter: "blur(80px)", pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: 420, animation: "slideUp 0.4s ease" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 56, height: 56, background: "var(--accent)", borderRadius: 16,
                        fontSize: 26, marginBottom: 16, boxShadow: "0 8px 28px var(--accent-glow)",
                    }}>⚡</div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>TaskFlow</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 5 }}>Your intelligent productivity workspace</p>
                </div>

                {/* Card */}
                <div className="auth-card" style={{
                    background: "var(--bg-card)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "28px 24px",
                    boxShadow: "var(--shadow-lg)",
                }}>
                    {/* Mode toggle */}
                    <div style={{
                        display: "flex", background: "var(--bg-primary)", borderRadius: "var(--radius-sm)",
                        padding: 4, marginBottom: 24, border: "1px solid var(--border)",
                    }}>
                        {["login", "signup"].map(m => (
                            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                                flex: 1, padding: "9px 0", borderRadius: "calc(var(--radius-sm) - 2px)",
                                background: mode === m ? "var(--accent)" : "transparent",
                                color: mode === m ? "#fff" : "var(--text-secondary)",
                                fontWeight: 600, fontSize: 14, transition: "all 0.2s", minHeight: "auto",
                            }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
                        ))}
                    </div>

                    {error && (
                        <div className="err-box" style={{ marginBottom: 16 }}>
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>Username</label>
                            <input
                                placeholder="your_email.gmail.com"
                                value={form.username}
                                autoComplete="username"
                                autoCapitalize="none"
                                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>Password</label>
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
                            style={{ width: "100%", justifyContent: "center", marginTop: 4, height: 48, fontSize: 15 }}
                            disabled={loading}
                        >
                            {loading ? <span className="spinner" /> : mode === "login" ? "Sign In →" : "Create Account →"}
                        </button>
                    </form>

                    <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
                        {mode === "login" ? "Don't have an account? " : "Already have one? "}
                        <span
                            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }}
                        >
                            {mode === "login" ? "Sign up free" : "Sign in"}
                        </span>
                    </div>
                </div>

                <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 18 }}>
                    Connected to <code style={{ fontFamily: "'JetBrains Mono',monospace" }}>{BASE_URL}</code>
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
            <div style={{ padding: "20px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h2 style={{ fontSize: 17, fontWeight: 700 }}>🎨 Choose Theme</h2>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Personalize your workspace</p>
                </div>
                <button className="btn-icon" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
            </div>
            <div className="theme-grid">
                {Object.entries(THEMES).map(([key, theme]) => (
                    <div key={key} className={`theme-card ${currentTheme === key ? "selected" : ""}`} onClick={() => { onSelect(key); onClose(); }}>
                        <div style={{ height: 52, borderRadius: 8, marginBottom: 10, overflow: "hidden", display: "flex" }}>
                            {theme.preview.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{theme.name}</div>
                                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>{theme.label}</div>
                            </div>
                            {currentTheme === key && <span style={{ color: "var(--accent)", fontSize: 15 }}>✓</span>}
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
                {/* Drag handle pill for mobile */}
                <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
                    <div style={{ width: 36, height: 4, borderRadius: 100, background: "var(--border)" }} />
                </div>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700 }}>{isEdit ? "✏️ Edit Task" : "➕ New Task"}</h2>
                    <button className="btn-icon" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
                </div>
                <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>Task Title *</label>
                        <input placeholder="What needs to be done?" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>Description</label>
                        <textarea rows={3} placeholder="Add more details…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: "vertical" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isEdit ? "1fr 1fr" : "1fr", gap: 14 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>Priority</label>
                            <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                                <option value="high">🔴 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">🟢 Low</option>
                            </select>
                        </div>
                        {isEdit && (
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>Status</label>
                                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="completed">✅ Completed</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                    <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                    <button
                        className="btn-primary"
                        style={{ flex: 2, justifyContent: "center" }}
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
            <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
                <div className={`checkbox ${isComplete ? "checked" : ""}`} onClick={() => onToggle(task)}>
                    {isComplete && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <h3 className="task-title" style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, wordBreak: "break-word" }}>
                            {task.title}
                        </h3>
                        <div className="task-actions" style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                            <button className="btn-icon" style={{ fontSize: 14 }} onClick={() => onEdit(task)}>✏️</button>
                            <button className="btn-icon" style={{ fontSize: 14, color: "var(--danger)" }} onClick={() => onDelete(task._id)}>🗑️</button>
                        </div>
                    </div>

                    {task.description && (
                        <p style={{
                            fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5,
                            overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        }}>
                            {task.description}
                        </p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                        <span className="badge" style={{ background: PRIORITY_BG[priority], color: PRIORITY_COLORS[priority] }}>{priority}</span>
                        <span className="tag">{isComplete ? "✅ Done" : "⏳ Pending"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
                            {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   TASKS VIEW
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

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api("/tasks", { method: "GET" }, token);
            setTasks(data.tasks || []);
        } catch (err) { toast(err.message, "error"); }
        finally { setLoading(false); }
    }, [token, toast]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

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

    const toggleTask = async task => {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        try {
            const data = await api(`/tasks/${task._id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) }, token);
            setTasks(p => p.map(t => t._id === task._id ? data.task : t));
        } catch (err) { toast(err.message, "error"); }
    };

    const deleteTask = async id => {
        try {
            await api(`/tasks/${id}`, { method: "DELETE" }, token);
            setTasks(p => p.filter(t => t._id !== id));
            toast("Task deleted", "info");
        } catch (err) { toast(err.message, "error"); }
    };

    const handleSave = form => { editTask ? updateTask(editTask._id, form) : createTask(form); };

    const filtered = tasks
        .filter(t => {
            if (filter === "completed") return t.status === "completed";
            if (filter === "pending") return t.status === "pending";
            if (filter === "high") return t.priority === "high";
            return true;
        })
        .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.description || "").toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === "priority") { const o = { high: 0, medium: 1, low: 2 }; return (o[a.priority] ?? 1) - (o[b.priority] ?? 1); }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const pendingCount = tasks.filter(t => t.status === "pending").length;
    const completedCount = tasks.filter(t => t.status === "completed").length;

    return (
        <div style={{ animation: "fadeInLeft 0.3s ease" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>My Tasks</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>
                        {loading ? "Loading…" : `${pendingCount} pending · ${completedCount} completed`}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
                    <span className="btn-label">New Task</span>
                </button>
            </div>

            {/* Controls */}
            <div className="filters-row" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <div className="search-wrap" style={{ position: "relative", flex: "1 1 200px", minWidth: 150 }}>
                    <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                    <input className="search-input" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: "auto", flex: "0 1 140px" }}>
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="high">High Priority</option>
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: "auto", flex: "0 1 140px" }}>
                    <option value="newest">Newest First</option>
                    <option value="priority">By Priority</option>
                </select>
                <button className="btn-ghost" onClick={fetchTasks} style={{ flexShrink: 0 }}>↻</button>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ background: "var(--bg-card)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: 18 }}>
                            <div style={{ display: "flex", gap: 13 }}>
                                <div className="skeleton" style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: 15, width: "60%", marginBottom: 10 }} />
                                    <div className="skeleton" style={{ height: 12, width: "80%", marginBottom: 12 }} />
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <div className="skeleton" style={{ height: 18, width: 55 }} />
                                        <div className="skeleton" style={{ height: 18, width: 65 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div style={{ fontSize: 48 }}>{search ? "🔍" : filter !== "all" ? "🎯" : "📭"}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-secondary)" }}>
                        {search ? "No tasks found" : filter !== "all" ? "No tasks here" : "No tasks yet"}
                    </h3>
                    <p style={{ fontSize: 13, maxWidth: 260 }}>
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
   ANALYTICS
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
            <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>
                {loading ? <span className="skeleton" style={{ display: "inline-block", width: 38, height: 30 }} /> : value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>}
        </div>
    );

    return (
        <div style={{ animation: "fadeInLeft 0.3s ease" }}>
            <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Analytics</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>Your productivity at a glance</p>
            </div>

            <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 20 }}>
                <StatCard icon="📋" label="Total Tasks" value={total} color="var(--accent)" />
                <StatCard icon="✅" label="Completed" value={completed} color="var(--success)" sub={`${rate}% rate`} />
                <StatCard icon="⏳" label="Pending" value={pending} color="var(--warning)" />
                <StatCard icon="🚨" label="High Priority" value={highPrio} color="var(--danger)" sub="Needs attention" />
            </div>

            <div className="analytics-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div className="card">
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Daily Activity</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={dayData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} width={25} />
                            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12 }} />
                            <Bar dataKey="completed" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Completion Rate</h3>
                    <div className="pie-row" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={total ? pieData : [{ name: "None", value: 1, color: "var(--border)" }]}
                                    cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}
                                >
                                    {(total ? pieData : [{ color: "var(--border)" }]).map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: 34, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{rate}%</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>Complete</div>
                            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                                {pieData.map(d => (
                                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                                        <span style={{ color: "var(--text-secondary)" }}>{d.name}: <strong style={{ color: "var(--text-primary)" }}>{d.value}</strong></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Weekly Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={dayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} width={25} />
                        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12 }} />
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
        <div style={{ animation: "fadeInLeft 0.3s ease" }} className="settings-wrap">
            <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Settings</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>Manage your account and preferences</p>
            </div>

            {/* Profile */}
            <div className="card" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>👤 Profile</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {user.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>@{user.username}</div>
                        <div style={{ fontSize: 12, color: "var(--success)", marginTop: 2 }}>● Connected to MongoDB</div>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="card" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎨 Appearance</h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Current: <span style={{ color: "var(--accent)" }}>{THEMES[currentTheme]?.name}</span></div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{THEMES[currentTheme]?.label}</div>
                    </div>
                    <button className="btn-primary" onClick={() => setThemeModal(true)}>Change Theme</button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    {THEMES[currentTheme]?.preview.map((c, i) => (
                        <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid var(--border)" }} />
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="card" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🔔 Notifications</h3>
                {[
                    { key: "email", label: "Email notifications", desc: "Requires email field in backend" },
                    { key: "deadline", label: "Deadline reminders", desc: "Alert when tasks are due soon" },
                    { key: "reminders", label: "Missed deadline alerts", desc: "Alert on overdue tasks" },
                ].map(n => (
                    <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ flex: 1, marginRight: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{n.desc}</div>
                        </div>
                        <div
                            onClick={() => { setNotifs(p => ({ ...p, [n.key]: !p[n.key] })); toast(`${n.label} ${notifs[n.key] ? "disabled" : "enabled"}`, "info"); }}
                            style={{ width: 44, height: 24, borderRadius: 100, cursor: "pointer", position: "relative", background: notifs[n.key] ? "var(--accent)" : "var(--border)", transition: "background 0.2s", flexShrink: 0 }}
                        >
                            <div style={{ position: "absolute", top: 3, left: notifs[n.key] ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Backend */}
            <div className="card" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🔌 Backend</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                    {[
                        ["API URL", <code style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--accent)", fontSize: 11, wordBreak: "break-all" }}>{BASE_URL}</code>],
                        ["Auth", <span style={{ color: "var(--success)" }}>JWT Bearer Token</span>],
                        ["Database", <span style={{ color: "var(--success)" }}>MongoDB Atlas</span>],
                        ["Token expires", <span style={{ color: "var(--warning)" }}>1 hour</span>],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ color: "var(--text-muted)" }}>{k}</span>
                            {v}
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger */}
            <div className="card" style={{ borderColor: "rgba(248,113,113,0.3)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "var(--danger)" }}>⚠️ Danger Zone</h3>
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
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("tm_token");
        const username = localStorage.getItem("tm_username");
        return token && username ? { token, username } : null;
    });
    const [theme, setTheme] = useState(() => localStorage.getItem("tm_theme") || "obsidian");
    const [page, setPage] = useState("tasks");
    const [themeModal, setThemeModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toasts, toast, removeToast } = useToast();

    // Apply theme CSS variables
    useEffect(() => {
        const vars = THEMES[theme]?.vars || THEMES.obsidian.vars;
        Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
        localStorage.setItem("tm_theme", theme);
    }, [theme]);

    // Close sidebar on page change (mobile)
    const handlePageChange = (p) => {
        setPage(p);
        setSidebarOpen(false);
    };

    const applyTheme = key => { setTheme(key); toast(`Theme → ${THEMES[key].name} ✨`, "success"); };
    const handleLogin = ({ username, token }) => setAuth({ username, token });
    const handleLogout = () => {
        localStorage.removeItem("tm_token");
        localStorage.removeItem("tm_username");
        setAuth(null);
        setPage("tasks");
        toast("Signed out", "info");
    };

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

    const PAGE_TITLES = { tasks: "📋 Tasks", analytics: "📊 Analytics", settings: "⚙️ Settings" };

    return (
        <>
            <GlobalStyles />
            <div className="app-shell">

                {/* Mobile sidebar overlay */}
                <div className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

                {/* ── SIDEBAR ── */}
                <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingLeft: 4 }}>
                        <div style={{ width: 34, height: 34, background: "var(--accent)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 12px var(--accent-glow)", flexShrink: 0 }}>⚡</div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>TaskFlow</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}>v2.0</div>
                        </div>
                    </div>

                    {/* User chip */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-card)", borderRadius: "var(--radius-sm)", marginBottom: 18, border: "1.5px solid var(--border)" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                            {auth.username[0].toUpperCase()}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{auth.username}</div>
                            <div style={{ fontSize: 10, color: "var(--success)" }}>● Live</div>
                        </div>
                    </div>

                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: 4, marginBottom: 6 }}>Navigation</div>

                    {NAV.map(item => (
                        <div key={item.id} className={`sidebar-link ${page === item.id ? "active" : ""}`} onClick={() => handlePageChange(item.id)}>
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}

                    <div style={{ flex: 1 }} />

                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
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

                {/* ── MAIN ── */}
                <div className="app-main">

                    {/* Topbar */}
                    <header className="app-topbar">
                        {/* Hamburger (mobile only) */}
                        <button
                            className="btn-icon"
                            style={{ display: "none", fontSize: 20 }}
                            id="hamburger"
                            onClick={() => setSidebarOpen(o => !o)}
                        >☰</button>
                        <style>{`@media (max-width: 767px) { #hamburger { display: inline-flex !important; } }`}</style>

                        <h2 className="topbar-title" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>
                            {PAGE_TITLES[page]}
                        </h2>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                            <button className="btn-icon" style={{ fontSize: 17 }} onClick={() => setThemeModal(true)}>🎨</button>

                            {/* Live badge */}
                            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 100 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
                                <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600 }}>Live</span>
                            </div>

                            {/* Avatar */}
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px var(--accent-glow)" }}>
                                {auth.username[0].toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="app-content">
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

            {/* ── BOTTOM NAV (mobile) ── */}
            <nav className="bottom-nav">
                {NAV.map(item => (
                    <div
                        key={item.id}
                        className={`bottom-nav-item ${page === item.id ? "active" : ""}`}
                        onClick={() => handlePageChange(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
                <div
                    className="bottom-nav-item"
                    onClick={() => setThemeModal(true)}
                >
                    <span className="icon">🎨</span>
                    <span>Theme</span>
                </div>
            </nav>

            {themeModal && <ThemeModal currentTheme={theme} onSelect={applyTheme} onClose={() => setThemeModal(false)} />}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}