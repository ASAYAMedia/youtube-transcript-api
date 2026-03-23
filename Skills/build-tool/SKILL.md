---
name: build-tool
description: Builds a complete new TinyToolbox tool end-to-end — tool definition, React component, TOOL_MAP registration, SEO content entry, and GitHub commit.
compatibility: Created for Zo Computer
metadata:
  author: asayaagent1.zo.computer
allowed-tools: Bash,Read,Write
---

# Build Tool Skill

Builds a complete, production-ready TinyToolbox tool from description to deployment.

## Prerequisites

- Tool name, description, and category are provided
- This skill lives at `/home/workspace/Skills/build-tool/`
- Target repo: `/home/workspace/tinytoolbox-github`

## Step-by-Step Process

### 1. Read the Conventions Doc
Before writing any code, read the conventions:
`/home/workspace/tinytoolbox-github/CONVENTIONS.md`

### 2. Read the TOOL_MAP
Read the first 100 lines of `app/tools/[slug]/page.tsx` to see how tools are mapped.
`/home/workspace/tinytoolbox-github/app/tools/[slug]/page.tsx`

### 3. Determine the Tool's Functionality

If the user gives you a vague description, ask:
- What does the tool DO? (input → output)
- What category does it belong to?
- What icon from lucide-react should it use?
- What accent color (tailwind)?

### 4. Create the Tool Component

File: `components/tools/[slug].tsx`

Pattern:
```tsx
'use client';

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

export function ToolNamePascalCase() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleAction = () => {
    // implement logic here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-black/40 border border-white/5 p-4 rounded-2xl gap-4">
        <div className="flex gap-2">
          <button onClick={handleAction} className="flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all">
            Action
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
        <div className="bg-white/5 px-4 py-3 border-b border-white/5">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Input</span>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="..."
          className="w-full h-[500px] bg-transparent p-6 text-zinc-200 font-mono text-sm resize-none focus:outline-none"
          spellCheck="false"
        />
      </div>

      {/* Result (if applicable) */}
      {result && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-sm font-mono text-emerald-400">
          {result}
        </div>
      )}
    </div>
  );
}
```

### 5. Add to `lib/tools.ts`

Add at the END of the array:
```ts
{ slug: 'my-tool', name: 'My Tool', description: 'One punchy sentence.', category: 'Developer', icon: Code2, accent: 'emerald',
  metaTitle: 'Free Online My Tool | Best Developer Tool',
  h1: 'Interactive My Tool',
  targetKeyword: 'my tool' }
```

**Category must be one of:** `Developer | Text | Security | Color | SEO | Math | Finance | Health | Time | Converter | Utility | Social | Games`

### 6. Register in TOOL_MAP

In `app/tools/[slug]/page.tsx`, add to the `TOOL_MAP`:
```ts
'my-tool': dynamic(() => import('@/components/tools/my-tool').then(mod => mod.ToolNamePascalCase)),
```

### 7. Add SEO Content (optional but recommended)

In `lib/tool-content.ts`, add:
```ts
'my-tool': {
  howToUse: 'Brief paragraph about what this tool does and when to use it.',
  howToSteps: [
    { name: 'Step 1', text: '...' },
    { name: 'Step 2', text: '...' },
  ],
  faqs: [
    { question: 'Question?', answer: 'Answer.' },
  ],
}
```

### 8. Verify the Build

```bash
cd /home/workspace/tinytoolbox-github && npx tsc --noEmit
```

### 9. Commit + Push

```bash
cd /home/workspace/tinytoolbox-github
git add -A
git commit -m "feat: add [tool-name] tool"
git push
```

## Icon Cheatsheet (common lucide-react icons by category)

| Category | Icons |
|---|---|
| Developer | Code2, Code, Terminal, FileCode2, Database, GitCompare |
| Text | Type, AlignLeft, FileText, Hash, Search |
| Security | Lock, Shield, ShieldCheck, Key, Fingerprint |
| Color | Palette, Pipette, Blend, Eye, Droplets |
| SEO | Tags, Share2, Bot, BarChart3, Globe |
| Math | Calculator, Percent, Scale, Gauge |
| Finance | DollarSign, Coins, Briefcase, TrendingUp |
| Health | HeartPulse, Stethoscope, Baby, Activity |
| Time | Clock, Calendar, Timer, CalendarDays |
| Converter | ArrowLeftRight, Ruler, Thermometer, Gauge |
| Utility | Sparkles, Zap, Star, Settings, Wrench |
| Social | Instagram, Twitter, Youtube, Linkedin, Send |
| Games | Gamepad2, Target, Dice5, Trophy |

## Accent Colors (Tailwind)

`rose | amber | emerald | cyan | sky | blue | indigo | violet | purple | fuchsia | pink | zinc`
