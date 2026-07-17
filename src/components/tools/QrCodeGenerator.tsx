import { useState } from 'react';
import { QrCode, Download } from 'lucide-react';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://toolvers.vercel.app');
  const [size, setSize] = useState(300);

  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=10`
    : '';

  return (
    <div className="card p-6">
      <div className="space-y-5">
        <div>
          <label htmlFor="qr-text" className="block text-sm font-medium text-slate-700">
            Text or URL to encode
          </label>
          <input
            id="qr-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL or text..."
            className="input-field mt-1.5"
          />
        </div>
        <div>
          <label htmlFor="qr-size" className="block text-sm font-medium text-slate-700">
            Size: {size}px
          </label>
          <input
            id="qr-size"
            type="range"
            min={150}
            max={500}
            step={50}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-xl bg-slate-200 accent-brand-600"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        {qrUrl ? (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <img src={qrUrl} alt="Generated QR code" width={size} height={size} className="h-auto w-full max-w-xs" />
            </div>
            <a href={qrUrl} download="qr-code.png" className="btn-primary">
              <Download className="h-5 w-5" />
              Download QR Code
            </a>
          </>
        ) : (
          <div className="flex h-48 w-full max-w-xs items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
            <QrCode className="h-12 w-12" />
          </div>
        )}
      </div>
    </div>
  );
}
