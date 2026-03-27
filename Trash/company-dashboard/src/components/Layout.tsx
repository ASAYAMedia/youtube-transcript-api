import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  CheckSquare,
  Bot,
  DollarSign,
  Brain,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
} from "lucide-react";
import { COMPANY } from "@/lib/company";

const NAV_ITEMS = [
  { path: "/", label: "Mission Control", icon: LayoutDashboard },
  { path: "/org", label: "Org Chart", icon: GitBranch },
  { path: "/tasks", label: "Task Queue", icon: CheckSquare },
  { path: "/agents", label: "Agents", icon: Bot },
  { path: "/budget", label: "Budget", icon: DollarSign },
  { path: "/memory", label: "Memory", icon: Brain },
  { path: "/reports", label: "Reports", icon: FileText },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-full z-50 flex flex-col glass border-r border-white/10 transition-all duration-300"
        style={{ width: collapsed ? 64 : 240 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-bold text-sm text-white truncate">ASAYA Media</div>
              <div className="text-xs text-zinc-500 truncate">{COMPANY.website}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`flex-shrink-0 ${active ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"}`}
                    />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {active && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mission */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-zinc-500 mb-1">Company Mission</div>
            <div className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
              {COMPANY.mission}
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/10 text-zinc-500 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Main content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <header className="sticky top-0 z-40 glass border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">
                {NAV_ITEMS.find(n => n.path === location.pathname)?.label ?? "Dashboard"}
              </h1>
              <p className="text-sm text-zinc-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Globe size={14} className="text-cyan-400" />
                <span>{COMPANY.website}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {COMPANY.ceo.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
