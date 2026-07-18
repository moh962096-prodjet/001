import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Download, Upload, Maximize2 } from 'lucide-react';

interface ImageData {
  name: string;
  type: string;
  dataUrl: string;
  width: number;
  height: number;
}

export default function ImageResizer() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState('png');
  const [outputUrl, setOutputUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRef = useRef(1);

  useEffect(() => {
    if (image) {
      setWidth(image.width);
      setHeight(image.height);
      aspectRef.current = image.width / image.height;
    }
  }, [image]);

  const handleFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);
    setImage({ name: file.name, type: file.type, dataUrl, width: img.naturalWidth, height: img.naturalHeight });
    setOutputUrl('');
  };

  const onWidthChange = (w: number) => {
    setWidth(w);
    if (maintainAspect && w > 0) setHeight(Math.round(w / aspectRef.current));
  };

  const onHeightChange = (h: number) => {
    setHeight(h);
    if (maintainAspect && h > 0) setWidth(Math.round(h * aspectRef.current));
  };

  const resize = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      setOutputUrl(canvas.toDataURL(mimeType, quality / 100));
    };
    img.src = image.dataUrl;
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `${image!.name.replace(/\.[^.]+$/, '')}_resized.${format}`;
    a.click();
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Maximize2 className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900">Image Resizer</h2>
      </div>

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
        >
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">Click to upload an image</p>
          <p className="mt-1 text-xs text-slate-400">PNG, JPG, or WEBP</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <img src={image.dataUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{image.name}</p>
              <p className="text-xs text-slate-500">Original: {image.width} × {image.height}px</p>
            </div>
            <button onClick={() => { setImage(null); setOutputUrl(''); }} className="text-xs text-slate-500 hover:text-slate-700">Remove</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Width (px)</label>
              <input type="number" value={width} onChange={(e) => onWidthChange(parseInt(e.target.value, 10) || 0)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Height (px)</label>
              <input type="number" value={height} onChange={(e) => onHeightChange(parseInt(e.target.value, 10) || 0)} className="input-field" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            Maintain aspect ratio
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Output Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field">
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Quality: {quality}%</label>
              <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-xl bg-slate-200 accent-brand-600" />
            </div>
          </div>

          <button onClick={resize} className="btn-primary">Resize Image</button>

          {outputUrl && (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">Resized: {width} × {height}px</p>
              <img src={outputUrl} alt="Resized" className="mx-auto max-h-64 rounded-lg object-contain" />
              <button onClick={download} className="btn-primary mt-3">
                <Download className="h-5 w-5" /> Download
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
