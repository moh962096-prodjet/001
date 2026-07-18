import { useState, useRef } from 'react';
import { Download, Upload, RefreshCw } from 'lucide-react';

interface ImageData {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export default function ImageFormatConverter() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [outputUrl, setOutputUrl] = useState('');
  const [outputSize, setOutputSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);
    setImage({ name: file.name, dataUrl, width: img.naturalWidth, height: img.naturalHeight });
    setOutputUrl('');
    // Auto-detect format from file
    if (file.type === 'image/jpeg') setFormat('png');
    else if (file.type === 'image/png') setFormat('jpg');
    else if (file.type === 'image/webp') setFormat('png');
  };

  const convert = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    // For JPEG, fill white background (no transparency)
    if (format === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const result = canvas.toDataURL(mimeType, quality / 100);
      setOutputUrl(result);
      // Calculate size from base64
      const base64 = result.split(',')[1];
      setOutputSize(Math.round((base64.length * 3) / 4));
    };
    img.src = image.dataUrl;
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `${image!.name.replace(/\.[^.]+$/, '')}.${format}`;
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <RefreshCw className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900">Image Format Converter</h2>
      </div>

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
        >
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">Click to upload an image</p>
          <p className="mt-1 text-xs text-slate-400">Convert between PNG, JPG, and WEBP</p>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <img src={image.dataUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
              <p className="text-xs text-slate-500">{image.width} × {image.height}px</p>
            </div>
            <button onClick={() => { setImage(null); setOutputUrl(''); }} className="text-xs text-slate-500 hover:text-slate-700">Remove</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Convert To</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field">
                <option value="png">PNG (lossless, supports transparency)</option>
                <option value="jpg">JPG (small size, no transparency)</option>
                <option value="webp">WEBP (modern, best compression)</option>
              </select>
            </div>
            {format !== 'png' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Quality: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-xl bg-slate-200 accent-brand-600" />
              </div>
            )}
          </div>

          <button onClick={convert} className="btn-primary">Convert Image</button>

          {outputUrl && (
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Converted to {format.toUpperCase()}</p>
                <p className="text-xs text-slate-500">Size: {formatSize(outputSize)}</p>
              </div>
              <img src={outputUrl} alt="Converted" className="mx-auto max-h-64 rounded-lg object-contain" />
              <button onClick={download} className="btn-primary mt-3">
                <Download className="h-5 w-5" /> Download {format.toUpperCase()}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
