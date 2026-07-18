import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://toolvers.vercel.app${path}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
        <Share2 className="h-4 w-4" /> Share
      </span>
      <button onClick={copy} className="btn-ghost !px-3 !py-2 text-xs">
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
