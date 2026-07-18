import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function TextReverser() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('chars');

  const reverse = () => {
    if (mode === 'chars') {
      setOutput([...text].reverse().join(''));
    } else if (mode === 'words') {
      setOutput(text.split(/(\s+)/).reverse().join(''));
    } else if (mode === 'lines') {
      setOutput(text.split('\n').reverse().join('\n'));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { v: 'chars', l: 'Reverse Characters' },
    { v: 'words', l: 'Reverse Words' },
    { v: 'lines', l: 'Reverse Lines' },
  ];

  return (
    <div className="card p-6">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Text Reverser</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to reverse..."
        rows={6}
        className="input-field resize-y font-mono text-sm"
      />
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {modes.map((m) => (
          <button
            key={m.v}
            onClick={() => setMode(m.v)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${mode === m.v ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300'}`}
          >
            {m.l}
          </button>
        ))}
      </div>
      <button onClick={reverse} className="btn-primary mt-4">Reverse Text</button>
      {output && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Result</h3>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea value={output} readOnly rows={6} className="input-field resize-y bg-slate-50 font-mono text-sm" />
        </div>
      )}
    </div>
  );
}
