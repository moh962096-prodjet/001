import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function TextSorter() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [sortMode, setSortMode] = useState('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const sortLines = () => {
    let lines = text.split('\n');
    lines = lines.filter((l) => l.trim() !== '' || true);
    lines.sort((a, b) => {
      const ca = caseSensitive ? a : a.toLowerCase();
      const cb = caseSensitive ? b : b.toLowerCase();
      const cmp = ca.localeCompare(cb);
      return sortMode === 'desc' ? -cmp : cmp;
    });
    if (sortMode === 'length') {
      lines.sort((a, b) => a.length - b.length);
    } else if (sortMode === 'lengthDesc') {
      lines.sort((a, b) => b.length - a.length);
    } else if (sortMode === 'shuffle') {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    } else if (sortMode === 'reverse') {
      lines.reverse();
    }
    setOutput(lines.join('\n'));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { v: 'asc', l: 'A → Z' },
    { v: 'desc', l: 'Z → A' },
    { v: 'length', l: 'Shortest first' },
    { v: 'lengthDesc', l: 'Longest first' },
    { v: 'shuffle', l: 'Shuffle' },
    { v: 'reverse', l: 'Reverse order' },
  ];

  return (
    <div className="card p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Text Sorter</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here. Each line will be sorted..."
        rows={8}
        className="input-field resize-y font-mono text-sm"
      />
      <div className="mt-4 space-y-3">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Sort by</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {modes.map((m) => (
              <button
                key={m.v}
                onClick={() => setSortMode(m.v)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${sortMode === m.v ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300'}`}
              >
                {m.l}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Case sensitive
        </label>
      </div>
      <button onClick={sortLines} className="btn-primary mt-4">Sort Text</button>
      {output && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Result</h3>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea value={output} readOnly rows={8} className="input-field resize-y bg-slate-50 font-mono text-sm" />
        </div>
      )}
    </div>
  );
}
