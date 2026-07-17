import { useState, useRef } from 'react';
import { Upload, Download, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setOriginalSize(f.size);
    setCompressedUrl(null);
    setCompressedSize(0);
  };

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const img = await loadImage(originalUrl!);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          }
          setLoading(false);
        },
        'image/jpeg',
        quality / 100,
      );
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const savings = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="card p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        id="compress-input"
      />
      {!file ? (
        <label
          htmlFor="compress-input"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
        >
          <Upload className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-600">Click to select an image</p>
          <p className="mt-1 text-xs text-slate-400">JPG or PNG</p>
        </label>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Original</p>
              {originalUrl && (
                <img src={originalUrl} alt="Original" className="w-full rounded-xl border border-slate-200" />
              )}
              <p className="mt-1 text-xs text-slate-500">{formatBytes(originalSize)}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Compressed</p>
              {compressedUrl ? (
                <>
                  <img src={compressedUrl} alt="Compressed" className="w-full rounded-xl border border-slate-200" />
                  <p className="mt-1 text-xs text-accent-600">
                    {formatBytes(compressedSize)} ({savings}% smaller)
                  </p>
                </>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-slate-700">
              Quality: {quality}%
            </label>
            <input
              id="quality"
              type="range"
              min={10}
              max={95}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-xl bg-slate-200 accent-brand-600"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={compress} disabled={loading} className="btn-primary flex-1">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>
            {compressedUrl && (
              <a href={compressedUrl} download="compressed.jpg" className="btn-primary">
                <Download className="h-5 w-5" />
                Download
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
