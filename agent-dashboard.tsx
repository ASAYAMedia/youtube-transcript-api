'use client';
import { useState } from 'react';

interface Agent {
  id: string; title: string; model: string; active: boolean;
  rrule: string; next_run: string; last_run: string | null; delivery_method: string;
}
interface ReportFile {
  date: string; agentId: string; agentTitle: string;
  summary: string; severity: string; file: string;
}
const SAMPLE_AGENTS: Agent[] = [
  {id:'1',title:'Blog Writer Agent',model:'kimi-k2.5',active:true,rrule:'Daily 9am',next_run:'2026-03-24T09:00',last_run:'2026-03-23T09:01',delivery_method:'file'},
  {id:'2',title:'Tool Creator Agent',model:'minimax-m2.7',active:true,rrule:'Daily 9am',next_run:'2026-03-24T09:00',last_run:'2026-03-23T09:05',delivery_method:'file'},
  {id:'3',title:'QA Maintenance Agent',model:'kimi-k2.5',active:true,rrule:'Daily 9am & 9pm',next_run:'2026-03-23T21:00',last_run:'2026-03-23T08:45',delivery_method:'file'},
  {id:'4',title:'Monetization Scout',model:'minimax-m2.7',active:true,rrule:'Daily 9am',next_run:'2026-03-24T09:00',last_run:'2026-03-23T09:12',delivery_method:'file'},
  {id:'5',title:'SEO & Traffic Agent',model:'minimax-m2.7',active:true,rrule:'Weekly Mon 10am',next_run:'2026-03-30T10:00',last_run:'2026-03-23T09:20',delivery_method:'file'},
  {id:'6',title:'Competitor Watch',model:'minimax-m2.7',active:true,rrule:'Weekly Wed 2pm',next_run:'2026-03-25T14:00',last_run:'2026-03-22T14:00',delivery_method:'file'},
  {id:'7',title:'Social Distribution',model:'minimax-m2.7',active:true,rrule:'Daily 11am',next_run:'2026-03-24T11:00',last_run:'2026-03-23T11:02',delivery_method:'file'},
  {id:'8',title:'User Feedback Monitor',model:'minimax-m2.7',active:true,rrule:'Daily 4pm',next_run:'2026-03-23T16:00',last_run:null,delivery_method:'file'},
  {id:'9',title:'Performance Monitor',model:'minimax-m2.7',active:true,rrule:'Daily 8am & 8pm',next_run:'2026-03-24T08:00',last_run:'2026-03-23T08:00',delivery_method:'file'},
  {id:'10',title:'Translation Audit',model:'minimax-m2.7',active:true,rrule:'Hourly',next_run:'2026-03-23T15:00',last_run:'2026-03-23T14:00',delivery_method:'file'},
  {id:'11',title:'Report Supervisor',model:'minimax-m2.7',active:true,rrule:'Daily 6:30pm',next_run:'2026-03-23T18:30',last_run:null,delivery_method:'email'},
];
const SAMPLE_REPORTS: ReportFile[] = [
  {date:'2026-03-23',agentId:'8',agentTitle:'User Feedback Monitor',summary:'Zero social engagement. 3 reviews found with positive sentiment about speed and privacy.',severity:'medium',file:'user-feedback_2026-03-23.md'},
  {date:'2026-03-23',agentId:'4',agentTitle:'Monetization Scout',summary:'No AdSense revenue yet. Affiliate opportunities identified in developer tools.',severity:'low',file:'monetization_2026-03-23.md'},
  {date:'2026-03-23',agentId:'9',agentTitle:'Performance Monitor',summary:'Site is fast. LCP 1.8s, no console errors, all routes responding.',severity:'low',file:'performance_2026-03-23.md'},
  {date:'2026-03-22',agentId:'8',agentTitle:'User Feedback Monitor',summary:'Social accounts not connected. LinkedIn profile ready.',severity:'high',file:'user-feedback_2026-03-22.md'},
];

const MEMORY = {
  openIssues: [
    {id:'ISS-003',issue:'Zero social engagement on launch post',priority:'MEDIUM',status:'Open',notes:'Launch post has 0 likes/retweets',age:'1d'},
    {id:'ISS-004',issue:'Brand confusion risk (lookalike domains)',priority:'LOW',status:'Open',notes:'.co.uk, .io variants owned by others',age:'1d'},
  ],
  pendingActions: [
    {id:'ACT-004',action:'Submit to Product Hunt',recommendedBy:'User Feedback Agent',status:'Pending',created:'2026-03-23',outcome:''},
    {id:'ACT-005',action:'Submit to AlternativeTo directory',recommendedBy:'User Feedback Agent',status:'Pending',created:'2026-03-23',outcome:''},
    {id:'ACT-006',action:'Boost launch post',recommendedBy:'User Feedback Agent',status:'Pending',created:'2026-03-23',outcome:''},
  ],
  stats:{totalAgents:11,activeAgents:11,reportsToday:3,openIssues:2,pendingActions:3},
};
function Badge({children,variant='default'}:{children:React.ReactNode;variant?:string}){
  const m:Record<string,string>={default:'bg-slate-700/60 text-zinc-300',green:'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',red:'bg-red-500/20 text-red-400 border border-red-500/40',amber:'bg-amber-500/20 text-amber-400 border border-amber-500/40',purple:'bg-purple-500/20 text-purple-400 border border-purple-500/40',blue:'bg-blue-500/20 text-blue-400 border border-blue-500/40',};
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${m[variant]||m.default}`}>{children}</span>;
}

function StatCard({label,value,sub,color='cyan'}:{label:string;value:string|number;sub?:string;color?:string}){
  const c:Record<string,string>={cyan:'from-cyan-500/15 to-cyan-600/5 border-cyan-500/25',purple:'from-purple-500/15 to-purple-600/5 border-purple-500/25',emerald:'from-emerald-500/15 to-emerald-600/5 border-emerald-500/25',amber:'from-amber-500/15 to-amber-600/5 border-amber-500/25',red:'from-red-500/15 to-red-600/5 border-red-500/25',};
  return <div className={`bg-gradient-to-br ${c[color]||c.cyan} rounded-2xl p-5 border backdrop-blur-sm`}><div className='text-3xl font-bold text-white mb-1'>{value}</div><div className='text-sm text-zinc-400'>{label}</div>{sub&&<div className='text-xs text-zinc-500 mt-1'>{sub}</div>}</div>;
}

function PDot({p}:{p:string}){
  const c:Record<string,string>={HIGH:'bg-red-400',MEDIUM:'bg-amber-400',LOW:'bg-emerald-400',CRITICAL:'bg-red-600 animate-pulse',};
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c[p]||'bg-slate-400'}`}/>;
}
function AgentRow({agent}:{agent:Agent}){
  const[exp,setExp]=useState(false);
  const nr=agent.next_run?new Date(agent.next_run):null;
  const lr=agent.last_run?new Date(agent.last_run):null;
  return <div className='bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden'>
    <button onClick={()=>setExp(!exp)} className='w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-800/60 transition-colors'>
      <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${agent.active?'bg-emerald-400 shadow-lg shadow-emerald-400/40':'bg-slate-600'}`}/>
      <div className='flex-1 min-w-0'><div className='text-white font-medium text-sm'>{agent.title}</div><div className='text-xs text-zinc-500 mt-0.5 font-mono'>{agent.model}</div></div>
      <div className='hidden sm:block text-right flex-shrink-0'>
        <Badge variant={agent.active?'green':'default'}>{agent.active?'Active':'Paused'}</Badge>
        <div className='text-xs text-zinc-500 mt-1'>{agent.rrule}</div>
      </div>
      <svg className={`w-4 h-4 text-zinc-500 transition-transform flex-shrink-0 ${exp?'rotate-180':''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7'/></svg>
    </button>
    {exp&&<div className='px-5 pb-4 border-t border-slate-700/40 pt-3 space-y-3'>
      <div className='grid grid-cols-2 gap-3 text-xs'>
        <div className='bg-slate-900/60 rounded-lg p-3'><div className='text-zinc-500 mb-1'>Schedule</div><div className='text-white font-mono'>{agent.rrule}</div></div>
        <div className='bg-slate-900/60 rounded-lg p-3'><div className='text-zinc-500 mb-1'>Next Run</div><div className='text-white'>{nr?nr.toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'N/A'}</div></div>
        <div className='bg-slate-900/60 rounded-lg p-3'><div className='text-zinc-500 mb-1'>Last Run</div><div className='text-white'>{lr?lr.toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'Never'}</div></div>
        <div className='bg-slate-900/60 rounded-lg p-3'><div className='text-zinc-500 mb-1'>Report Output</div><div className='text-white'>{agent.delivery_method}</div></div>
      </div>
    </div>}
  </div>;
}
function ReportRow({report}:{report:ReportFile}){
  const sc:Record<string,string>={critical:'border-red-500/50 bg-red-500/5',high:'border-orange-500/50 bg-orange-500/5',medium:'border-amber-500/50 bg-amber-500/5',low:'border-emerald-500/50 bg-emerald-500/5',};
  return <div className={`rounded-xl border p-4 ${sc[report.severity]||sc.low}`}>
    <div className='flex items-start gap-3'>
      <PDot p={report.severity.toUpperCase()}/>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'><span className='text-white text-sm font-medium'>{report.agentTitle}</span><span className='text-xs text-zinc-500'>{report.date}</span></div>
        <div className='text-xs text-zinc-300 leading-relaxed'>{report.summary}</div>
      </div>
    </div>
  </div>;
}

function TabBtn({active,onClick,children}:{active:boolean;onClick:()=>void;children:React.ReactNode}){
  return <button onClick={onClick} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active?'bg-purple-500/30 text-white border border-purple-500/50':'text-zinc-400 hover:text-white'}`}>{children}</button>;
}
export default function Dashboard(){
  const[tab,setTab]=useState<'overview'|'fleet'|'reports'|'memory'>('overview');
  const[agents]=useState<Agent[]>(SAMPLE_AGENTS);
  const[reports]=useState<ReportFile[]>(SAMPLE_REPORTS);
  const tabs=[{id:'overview',label:'Overview'},{id:'fleet',label:'Fleet'},{id:'reports',label:'Reports'},{id:'memory',label:'Memory'}] as const;
  return <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white'>
    <div className='border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-sm'>AI</div>
            <div><h1 className='text-white font-semibold text-sm'>Agent Fleet</h1><p className='text-zinc-500 text-xs'>TinyToolbox Operations</p></div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-zinc-500 hidden sm:block'>Last compiled: Mar 23, 6:30 PM</span>
            <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'/><span className='text-xs text-emerald-400 font-medium'>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6'>
      <div className='flex gap-1 bg-slate-800/40 rounded-xl p-1.5 border border-slate-700/50 w-fit'>
        {tabs.map(t=><TabBtn key={t.id} active={tab===t.id} onClick={()=>setTab(t.id)}>{t.label}</TabBtn>)}
      </div>

      {tab==='overview' && <div className='space-y-6'>
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-4'>
          <StatCard label='Total Agents' value={MEMORY.stats.totalAgents} color='cyan'/>
          <StatCard label='Active' value={MEMORY.stats.activeAgents} color='emerald' sub='all running'/>
          <StatCard label='Reports Today' value={MEMORY.stats.reportsToday} color='purple'/>
          <StatCard label='Open Issues' value={MEMORY.stats.openIssues} color={MEMORY.stats.openIssues>0?'amber':'emerald'}/>
          <StatCard label='Pending Actions' value={MEMORY.stats.pendingActions} color='amber'/>
        </div>
        <div className='grid lg:grid-cols-2 gap-5'>
          <div className='bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5'>
            <h3 className='text-white font-semibold mb-4 flex items-center gap-2'><span>🚨</span> Open Issues</h3>
            {MEMORY.openIssues.length===0?<div className='text-center py-8 text-zinc-500'>No open issues</div>:
              <div className='space-y-2'>{MEMORY.openIssues.map(i=><div key={i.id} className='flex items-center gap-3 bg-slate-900/50 rounded-xl px-4 py-3'>
                <PDot p={i.priority}/>
                <div className='flex-1 min-w-0'><div className='text-sm text-white truncate'>{i.issue}</div><div className='text-xs text-zinc-500'>{i.age} old</div></div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i.priority==='HIGH'?'bg-red-500/20 text-red-400':i.priority==='MEDIUM'?'bg-amber-500/20 text-amber-400':'bg-slate-500/20 text-slate-400'}`}>{i.priority}</span>
              </div>)}</div>}
          </div>
          <div className='bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5'>
            <h3 className='text-white font-semibold mb-4 flex items-center gap-2'><span>⚡</span> Next Actions</h3>
            {MEMORY.pendingActions.length===0?<div className='text-center py-8 text-zinc-500'>No pending actions</div>:
              <div className='space-y-2'>{MEMORY.pendingActions.map(a=><div key={a.id} className='flex items-center gap-3 bg-slate-900/50 rounded-xl px-4 py-3'>
                <div className='w-5 h-5 rounded border border-slate-600 flex-shrink-0'/>
                <div className='flex-1 min-w-0'><div className='text-sm text-white truncate'>{a.action}</div><div className='text-xs text-zinc-500'>via {a.recommendedBy}</div></div>
              </div>)}</div>}
          </div>
        </div>
        <div className='bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5'>
          <h3 className='text-white font-semibold mb-4 flex items-center gap-2'><span>📊</span> Recent Reports</h3>
          <div className='space-y-2'>{reports.slice(0,4).map(r=><ReportRow key={r.file+r.date} report={r}/>)}</div>
        </div>
      </div>}

      {tab==='fleet' && <div className='space-y-2'>
        {agents.map(a=><AgentRow key={a.id} agent={a}/>)}
      </div>}

      {tab==='reports' && <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-white font-semibold'>All Reports</h3>
          <span className='text-xs text-zinc-500'>{reports.length} reports</span>
        </div>
        {reports.map(r=><ReportRow key={r.file+r.date} report={r}/>)}
      </div>}

      {tab==='memory' && <div className='space-y-6'>
        <div className='grid lg:grid-cols-2 gap-5'>
          <div className='bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5'>
            <h3 className='text-white font-semibold mb-4'>🚨 Open Issues ({MEMORY.openIssues.length})</h3>
            <div className='space-y-2'>
              {MEMORY.openIssues.map(i=><div key={i.id} className='bg-slate-900/50 rounded-xl px-4 py-3'>
                <div className='flex items-center gap-2 mb-1'><PDot p={i.priority}/><span className='text-white text-sm font-medium'>{i.id}</span><span className='text-xs text-zinc-500'>{i.age}</span></div>
                <div className='text-sm text-zinc-300'>{i.issue}</div>
                <div className='text-xs text-zinc-500 mt-1'>{i.notes}</div>
              </div>)}
            </div>
          </div>
          <div className='bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5'>
            <h3 className='text-white font-semibold mb-4'>⚡ Pending Actions ({MEMORY.pendingActions.length})</h3>
            <div className='space-y-2'>
              {MEMORY.pendingActions.map(a=><div key={a.id} className='bg-slate-900/50 rounded-xl px-4 py-3'>
                <div className='text-white text-sm font-medium'>{a.action}</div>
                <div className='text-xs text-zinc-500 mt-1'>via {a.recommendedBy} · {a.created}</div>
              </div>)}
            </div>
          </div>
        </div>
        <div className='bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5'>
          <h3 className='text-white font-semibold mb-2'>📁 Memory Files</h3>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3'>
            {['knowledge-base.md','issues-tracker.md','actions-log.md','trends.md'].map(f=>
              <div key={f} className='bg-slate-900/50 rounded-xl px-4 py-3 flex items-center gap-3'>
                <span className='text-lg'>📄</span><span className='text-sm text-zinc-300'>{f}</span>
              </div>)
            }
          </div>
        </div>
      </div>}
    </div>
  </div>;
}
