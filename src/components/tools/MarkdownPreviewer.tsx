import { useState } from 'react';
import { Eye, Copy, Check } from 'lucide-react';

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => `<pre class="rounded-lg bg-slate-800 p-4 overflow-x-auto"><code class="text-sm text-slate-100">${code.trim()}</code></pre>`);
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-brand-700">$1</code>');
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-extrabold mt-6 mb-3">$1</h1>');
  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-600 underline" target="_blank" rel="noopener">$1</a>');
  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-brand-300 pl-4 italic text-slate-600">$1</blockquote>');
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>');
  // Line breaks
  html = html.replace(/\n/g, '<br/>');

  return html;
}

export default function MarkdownPreviewer() {
  const [text, setText] = useState('# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)\n\n> A quote');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">Markdown Previewer</h2>
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Markdown Input</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            className="input-field resize-y font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Live Preview</label>
          <div
            className="min-h-[400px] rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        </div>
      </div>
    </div>
  );
}
