'use client';

import React, { useState } from 'react';
import { VisualLayoutType, QuestionCategory } from '@/app/utils/job-preparation/mock/interview';
import { 
  Code, 
  Table as TableIcon, 
  Layers, 
  Sparkles, 
  Terminal, 
  Copy,
  Check
} from 'lucide-react';

interface VisualLayoutRendererProps {
  visualLayout: VisualLayoutType;
  category: QuestionCategory;
  prompt: string;
  codeLanguage?: string;
  codeStarterSnippet?: string;
  supplementaryData?: {
    tableHeaders?: string[];
    tableRows?: string[][];
    diagramNodes?: string[];
    caseMetrics?: Record<string, string>;
  };
  submittedCode: string;
  onCodeChange: (code: string) => void;
  starResponse: { situation: string; task: string; action: string; result: string };
  onStarChange: (field: string, value: string) => void;
  isDark: boolean;
}

export const VisualLayoutRenderer: React.FC<VisualLayoutRendererProps> = ({
  visualLayout,
  prompt,
  codeLanguage = 'typescript',
  codeStarterSnippet = '',
  supplementaryData,
  submittedCode,
  onCodeChange,
  starResponse,
  onStarChange,
  isDark,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeStarTab, setActiveStarTab] = useState<'S' | 'T' | 'A' | 'R'>('S');

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(submittedCode || codeStarterSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // VS Code Dark+ Color Highlighting Helper
const highlightCode = (code: string): string => {
  if (!code) return '';

  // Escape raw HTML entities to prevent rendering bugs
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Token regex replacement maps
  return escaped
    // Comments (Green: #6A9955)
    .replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="text-[#6A9955] italic">$1</span>')
    // Strings (Orange/Brown: #CE9178)
    .replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, '<span class="text-[#CE9178]">$1</span>')
    // Control Keywords (Magenta: #C586C0)
    .replace(/\b(return|if|else|for|while|switch|case|break|try|catch|finally|throw|async|await|yield|import|export|from|default)\b/g, '<span class="text-[#C586C0] font-semibold">$1</span>')
    // Variable Declarations & Scope (Blue: #569CD6)
    .replace(/\b(const|let|var|function|class|interface|type|enum|extends|implements|new|public|private|protected|readonly|static|void|string|number|boolean|any|unknown)\b/g, '<span class="text-[#569CD6] font-semibold">$1</span>')
    // Booleans & Nullish (Blue: #569CD6)
    .replace(/\b(true|false|null|undefined|NaN)\b/g, '<span class="text-[#569CD6] font-bold">$1</span>')
    // Numbers (Light Green: #B5CEA8)
    .replace(/\b(\d+)\b/g, '<span class="text-[#B5CEA8]">$1</span>')
    // Functions & Methods Calls (Yellow: #DCDCAA)
    .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="text-[#DCDCAA]">$1</span>')
    // Class Names & Types (Teal: #4EC9B0)
    .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="text-[#4EC9B0]">$1</span>');
};

  return (
    <div className="space-y-6 w-full">
      {/* Primary Prompt Display */}
      <div className={`prose max-w-none text-base leading-relaxed ${isDark ? 'prose-invert text-slate-100' : 'text-slate-900'}`}>
        <p className="whitespace-pre-line font-medium text-sm max-sm:text-xs leading-snug">{prompt}</p>
      </div>

{visualLayout === 'CODE_EDITOR' && (
  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#1e1e1e] text-slate-100 shadow-2xl font-mono text-xs">
    {/* Editor Header Bar (VS Code Dark Titlebar) */}
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#333333] text-xs text-slate-400">
      <div className="flex items-center gap-3">
        {/* VS Code Window Control Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
        </div>

        <span className="flex items-center gap-2 pl-2 border-l border-[#3c3c3c]">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="font-semibold uppercase tracking-wider text-sky-400">
            {codeLanguage}
          </span>{' '}
          IDE Environment
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopySnippet}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#333333] hover:bg-[#444444] text-slate-200 transition-all cursor-pointer font-sans text-xs font-medium"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
        </button>
      </div>
    </div>

    {/* Code Editor Body with Line Numbers & Token Highlight Overlay */}
    <div className="relative flex min-h-[320px] max-h-[500px] overflow-auto bg-[#1e1e1e]">
      {/* Line Numbers Gutter */}
      <div className="shrink-0 py-4 px-3 bg-[#1e1e1e] text-[#5a5a5a] text-right font-mono text-xs select-none border-r border-[#2d2d2d] min-w-[42px]">
        {((submittedCode || codeStarterSnippet || '// Write your solution here...').split('\n')).map((_, i) => (
          <div key={i} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor Main Canvas */}
      <div className="relative flex-1 p-4 overflow-hidden">
        {/* Syntax Highlighted Render Layer */}
        <pre
          aria-hidden="true"
          className="m-0 font-mono text-xs leading-6 whitespace-pre-wrap break-words pointer-events-none select-none text-[#d4d4d4]"
          dangerouslySetInnerHTML={{
            __html: highlightCode(
              submittedCode || codeStarterSnippet || '// Write your solution here...'
            ),
          }}
        />

        {/* Transparent Interactive Textarea Overlay */}
        <textarea
          rows={14}
          value={submittedCode || codeStarterSnippet}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="// Write your solution here..."
          className="absolute inset-0 w-full h-full p-4 bg-transparent font-mono text-xs leading-6 text-transparent caret-indigo-400 resize-none focus:outline-none spellcheck-false border-none whitespace-pre-wrap break-words"
          spellCheck={false}
        />
      </div>
    </div>

    {/* VS Code Footer Status Bar */}
    <div className="flex items-center justify-between border-t px-4 py-1 text-white text-[11px] font-sans font-medium">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Ready
        </span>
        <span>UTF-8</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Ln {((submittedCode || codeStarterSnippet || '').split('\n')).length}, Col 1</span>
        <span className="uppercase">{codeLanguage}</span>
      </div>
    </div>
  </div>
)}

      {/* 2. STAR METHOD STRUCTURED INPUT LAYOUT */}
      {visualLayout === 'STAR_STRUCTURED' && (
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between border-b border-inherit pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Structured STAR Framework Response
            </span>
            <span className="text-[11px] text-slate-400">Address each component for full rubric points</span>
          </div>

          {/* STAR Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-inherit pb-2">
            {[
              { id: 'S', label: 'Situation (Context)' },
              { id: 'T', label: 'Task (Responsibility)' },
              { id: 'A', label: 'Action (Steps Taken)' },
              { id: 'R', label: 'Result (Impact & Data)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStarTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStarTab === tab.id
                    ? 'bg-indigo-600 text-white shadow'
                    : isDark
                    ? 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.id} • {tab.label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Tab Content Textarea Inputs */}
          {activeStarTab === 'S' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Situation: Describe the background, 
                complexity, or crisis</label>
              <textarea
                rows={4}
                value={starResponse.situation}
                onChange={(e) => onStarChange('situation', e.target.value)}
                placeholder="What was the background, system state, or business risk?"
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none 
                  focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}

          {activeStarTab === 'T' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Task: What was your specific goal 
                or responsibility?</label>
              <textarea
                rows={4}
                value={starResponse.task}
                onChange={(e) => onStarChange('task', e.target.value)}
                placeholder="What was your specific duty or objective as the lead/engineer?"
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none 
                  focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}

          {activeStarTab === 'A' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Action: What concrete steps did YOU take?</label>
              <textarea
                rows={4}
                value={starResponse.action}
                onChange={(e) => onStarChange('action', e.target.value)}
                placeholder="Detail the technical decisions, architecture choices, or team leadership steps you executed."
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' 
                  : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}

          {activeStarTab === 'R' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Result: What was the measurable impact?</label>
              <textarea
                rows={4}
                value={starResponse.result}
                onChange={(e) => onStarChange('result', e.target.value)}
                placeholder="Include data metrics: e.g., MTTR reduced by 40%, zero financial loss, 100% test coverage."
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none 
                  focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. WHITEBOARD & SYSTEM ARCHITECTURE LAYOUT */}
      {visualLayout === 'WHITEBOARD_DIAGRAM' && supplementaryData?.diagramNodes && (
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 
          border-b border-inherit pb-2">
            <Layers className="w-4 h-4" /> System Components & Architecture Nodes
          </div>
          <div className="flex flex-wrap gap-2">
            {supplementaryData.diagramNodes.map((node, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-sky-300'
                    : 'bg-sky-50 border-sky-200 text-sky-800'
                }`}
              >
                📦 {node}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. FINANCIAL / METRIC TABLE LAYOUT */}
      {visualLayout === 'METRIC_TABLE' && supplementaryData?.tableHeaders && (
        <div className={`overflow-x-auto rounded-2xl border shadow-sm ${
          isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-white'
        }`}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-inherit text-xs 
          font-bold text-indigo-500 uppercase tracking-wider">
            <TableIcon className="w-4 h-4" /> Financial Case / Metric Data Set
          </div>
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className={isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}>
                {supplementaryData.tableHeaders.map((header, idx) => (
                  <th key={idx} className="p-3 border-b border-inherit font-bold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supplementaryData.tableRows?.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={`border-b border-inherit ${
                    isDark ? 'hover:bg-slate-900/50 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
