import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const process = () => {
    let lines = text.split('\n');
    if (trimWhitespace) lines = lines.map((l) => l.trim());
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    setOutput(result.join('\n'));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removedCount = text.split('\n').length - output.split('\n').length;

  return (
    <div className="card p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Remove Duplicate Lines</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here. Each line will be checked for duplicates..."
        rows={8}
        className="input-field resize-y font-mono text-sm"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={trimWhitespace} onChange={(e) => setTrimWhitespace(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Trim whitespace before comparing
        </label>
      </div>
      <button onClick={process} className="btn-primary mt-4">Remove Duplicates</button>
      {output && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">
              Result ({output.split('\n').length} lines, {removedCount > 0 ? `${removedCount} removed` : 'no duplicates'})
            </h3>
            <div className="flex gap-2">
              <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => { setText(''); setOutput(''); }} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>
          <textarea value={output} readOnly rows={8} className="input-field resize-y bg-slate-50 font-mono text-sm" />
        </div>
      )}
    </div>
  );
}
