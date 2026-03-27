// Shared UI components for the dashboard

export function StatCard({
  label,
  value,
  sub,
  accent = "cyan",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "cyan" | "purple" | "pink" | "green" | "yellow" | "red";
  icon?: React.ElementType;
}) {
  const colors: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
    pink: "from-pink-500/20 to-pink-500/5 border-pink-500/20",
    green: "from-green-500/20 to-green-500/5 border-green-500/20",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
    red: "from-red-500/20 to-red-500/5 border-red-500/20",
  };

  const textColors: Record<string, string> = {
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };

  return (
    <div className={`glass rounded-2xl p-5 bg-gradient-to-br ${colors[accent]} border`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</div>
        {Icon && <Icon size={16} className={textColors[accent]} />}
      </div>
      <div className={`text-3xl font-bold ${textColors[accent]} mb-1`}>{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

export function StatusDot({ status }: { status: "green" | "yellow" | "red" | "gray" }) {
  const colors: Record<string, string> = {
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
    gray: "bg-zinc-600",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[status]} ${status === "green" ? "animate-pulse" : ""}`}
    />
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) {
  const variants: Record<string, string> = {
    default: "bg-white/10 text-zinc-300",
    cyan: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    pink: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    green: "bg-green-500/20 text-green-400 border border-green-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant] ?? variants.default}`}>
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  color = "cyan",
}: {
  value: number;
  max: number;
  color?: "cyan" | "purple" | "green" | "yellow" | "red";
}) {
  const pct = Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    cyan: "bg-cyan-400",
    purple: "bg-purple-400",
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
  };
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-zinc-500">{text}</p>
    </div>
  );
}

export function EmptyState({ message, icon: Icon }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {Icon && <Icon size={32} className="text-zinc-600" />}
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}
