import { useState, useEffect } from "react";
import { AGENTS } from "@/lib/company";
import { getTrends } from "@/lib/reports";
import { StatCard, ProgressBar, Badge } from "@/components/ui";
import { Coins, TrendingUp, DollarSign } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function getMockAgentSpend() {
  return AGENTS.map(a => ({
    agent: a.name,
    color: a.color,
    today: Math.floor(Math.random() * 8000) + 1000,
    limit: 15000,
    tasks: Math.floor(Math.random() * 8) + 1,
  }));
}

export default function BudgetPage() {
  const [agentSpend, setAgentSpend] = useState(() => getMockAgentSpend());
  const [trendData, setTrendData] = useState<{ date: string; tokens: number }[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function load() {
      const trends = await getTrends();
      setTrendData(trends.dates.map((d, i) => ({ date: d.slice(5), tokens: trends.dailyTokens[i] })));
      setTotalSpent(trends.totalSpend);
      setAgentSpend(getMockAgentSpend());
    }
    load();
  }, []);

  const totalLimit = agentSpend.reduce((a, b) => a + b.limit, 0);
  const totalUsed = agentSpend.reduce((a, b) => a + b.today, 0);
  const budgetPct = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

  const chartData = trendData.length > 0 ? trendData : Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { date: d.toISOString().split("T")[0].slice(5), tokens: Math.floor(Math.random() * 50000) + 10000 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Token Budget</h2>
        <p className="text-sm text-zinc-500">Daily token spend across all agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Spent Today"
          value={`${(totalUsed / 1000).toFixed(1)}k`}
          sub={`${totalUsed.toLocaleString()} tokens`}
          accent={budgetPct > 80 ? "red" : budgetPct > 60 ? "yellow" : "cyan"}
          icon={Coins}
        />
        <StatCard
          label="Daily Limit"
          value={`${(totalLimit / 1000).toFixed(0)}k`}
          sub="Across all agents"
          accent="purple"
          icon={TrendingUp}
        />
        <StatCard
          label="Budget Used"
          value={`${budgetPct.toFixed(0)}%`}
          sub={budgetPct > 80 ? "Near limit — caution" : "On track"}
          accent={budgetPct > 80 ? "red" : budgetPct > 60 ? "yellow" : "green"}
          icon={DollarSign}
        />
        <StatCard
          label="Est. Monthly Cost"
          value={`$${((totalUsed / 1000) * 0.01).toFixed(2)}`}
          sub="@ $0.01 / 1k tokens"
          accent="pink"
          icon={Coins}
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Daily Budget Utilization</h3>
          <Badge variant={budgetPct > 80 ? "red" : budgetPct > 60 ? "yellow" : "green"}>
            {budgetPct.toFixed(0)}% used
          </Badge>
        </div>
        <ProgressBar
          value={totalUsed}
          max={totalLimit}
          color={budgetPct > 80 ? "red" : budgetPct > 60 ? "yellow" : "cyan"}
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>{totalUsed.toLocaleString()} used</span>
          <span>{totalLimit.toLocaleString()} limit</span>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">7-Day Token Spend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={v => `${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#06b6d4" }}
              />
              <Bar dataKey="tokens" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Per-Agent Breakdown</h3>
        <div className="space-y-3">
          {agentSpend.sort((a, b) => b.today - a.today).map(spend => {
            const pct = spend.limit > 0 ? (spend.today / spend.limit) * 100 : 0;
            const barColor = pct > 80 ? "red" : pct > 60 ? "yellow" : "cyan";
            return (
              <div key={spend.agent} className="flex items-center gap-4">
                <div className="w-32 text-xs text-zinc-300 truncate">{spend.agent}</div>
                <div className="flex-1">
                  <ProgressBar value={spend.today} max={spend.limit} color={barColor as "cyan" | "yellow" | "red"} />
                </div>
                <div className="w-20 text-xs text-right">
                  <span className={pct > 80 ? "text-red-400" : pct > 60 ? "text-yellow-400" : "text-zinc-400"}>
                    {(spend.today / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="w-12 text-xs text-right text-zinc-600">{pct.toFixed(0)}%</div>
                <div className="w-12 text-xs text-right text-zinc-500">{spend.tasks}t</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
