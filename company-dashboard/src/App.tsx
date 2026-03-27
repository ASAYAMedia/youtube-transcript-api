import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/Layout";
import MissionControl from "@/pages/index";
import OrgChartPage from "@/pages/org";
import TasksPage from "@/pages/tasks";
import AgentsPage from "@/pages/agents";
import BudgetPage from "@/pages/budget";
import MemoryPage from "@/pages/memory";
import ReportsPage from "@/pages/reports";
import AgentDetailPage from "@/pages/agent-detail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MissionControl />} />
          <Route path="/org" element={<OrgChartPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:slug" element={<AgentDetailPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
