import { useState } from 'react';
import { CaseSensitive, Copy, Check } from 'lucide-react';

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (mode: string) => {
    switch (mode) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      case 'sentence': return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()).toLowerCase();
      case 'capitalize': return text.replace(/\b\w/g, (c) => c.toUpperCase());
      case 'camel': return text.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toLowerCase());
      case 'snake': return text.trim().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
      case 'kebab': return text.trim().replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      case 'alternating': return text.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('');
      case 'inverse': return text.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
      default: return text;
    }
  };

  const [output, setOutput] = useState('');

  const modes = [
    { v: 'upper', l: 'UPPER CASE' },
    { v: 'lower', l: 'lower case' },
    { v: 'title', l: 'Title Case' },
    { v: 'sentence', l: 'Sentence case' },
    { v: 'capitalize', l: 'Capitalize Each Word' },
    { v: 'camel', l: 'camelCase' },
    { v: 'snake', l: 'snake_case' },
    { v: 'kebab', l: 'kebab-case' },
    { v: 'alternating', l: 'aLtErNaTiNg' },
    { v: 'inverse', l: 'iNVERSE cASE' },
  ];

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <CaseSensitive className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900">Text Case Converter</h2>
      </div>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setOutput(''); }}
        placeholder="Type or paste your text here..."
        rows={6}
        className="input-field resize-y font-mono text-sm"
      />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {modes.map((m) => (
          <button
            key={m.v}
            onClick={() => setOutput(convert(m.v))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50"
          >
            {m.l}
          </button>
        ))}
      </div>
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
