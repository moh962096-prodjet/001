import { useState, useRef, useEffect } from 'react';
import { Crop as CropIcon, Download, Upload } from 'lucide-react';

interface ImageData {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export default function ImageCropper() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [outputUrl, setOutputUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const handleFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);
    setImage({ name: file.name, dataUrl, width: img.naturalWidth, height: img.naturalHeight });
    setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
    setOutputUrl('');
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const maxW = 500;
    const scale = Math.min(1, maxW / image.width);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Draw crop overlay
      const sx = crop.x * scale;
      const sy = crop.y * scale;
      const sw = crop.w * scale;
      const sh = crop.h * scale;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(sx, sy, sw, sh);
      ctx.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, sw, sh);
    };
    img.src = image.dataUrl;
  }, [image, crop]);

  const onCanvasDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = image.width / canvasRef.current.width;
    draggingRef.current = true;
    startRef.current = {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    };
    setCrop({ x: startRef.current.x, y: startRef.current.y, w: 0, h: 0 });
  };

  const onCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || !image || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = image.width / canvasRef.current.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    const w = x - startRef.current.x;
    const h = y - startRef.current.y;
    setCrop({
      x: w < 0 ? x : startRef.current.x,
      y: h < 0 ? y : startRef.current.y,
      w: Math.abs(w),
      h: Math.abs(h),
    });
  };

  const onCanvasUp = () => {
    draggingRef.current = false;
  };

  const applyAspect = (ratio: string) => {
    setAspectRatio(ratio);
    if (!ratio || !image) return;
    const [rw, rh] = ratio.split(':').map(Number);
    const targetH = (crop.w * rh) / rw;
    setCrop({ ...crop, h: targetH });
  };

  const doCrop = () => {
    if (!image || crop.w < 1 || crop.h < 1) return;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(crop.w);
    canvas.height = Math.round(crop.h);
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
      setOutputUrl(canvas.toDataURL('image/png'));
    };
    img.src = image.dataUrl;
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `${image!.name.replace(/\.[^.]+$/, '')}_cropped.png`;
    a.click();
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <CropIcon className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900">Image Cropper</h2>
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
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{image.name}</p>
              <p className="text-xs text-slate-500">{image.width} × {image.height}px — drag on image to select crop area</p>
            </div>
            <button onClick={() => { setImage(null); setOutputUrl(''); }} className="text-xs text-slate-500 hover:text-slate-700">Remove</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <canvas
              ref={canvasRef}
              onMouseDown={onCanvasDown}
              onMouseMove={onCanvasMove}
              onMouseUp={onCanvasUp}
              onMouseLeave={onCanvasUp}
              className="cursor-crosshair mx-auto block"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">X</label>
              <input type="number" value={Math.round(crop.x)} onChange={(e) => setCrop({ ...crop, x: parseInt(e.target.value, 10) || 0 })} className="input-field !py-2" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Y</label>
              <input type="number" value={Math.round(crop.y)} onChange={(e) => setCrop({ ...crop, y: parseInt(e.target.value, 10) || 0 })} className="input-field !py-2" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Width</label>
              <input type="number" value={Math.round(crop.w)} onChange={(e) => setCrop({ ...crop, w: parseInt(e.target.value, 10) || 0 })} className="input-field !py-2" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Height</label>
              <input type="number" value={Math.round(crop.h)} onChange={(e) => setCrop({ ...crop, h: parseInt(e.target.value, 10) || 0 })} className="input-field !py-2" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Aspect Ratio Preset</label>
            <div className="flex flex-wrap gap-2">
              {['', '1:1', '4:3', '16:9', '3:2', '2:3'].map((r) => (
                <button key={r || 'free'} onClick={() => applyAspect(r)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${aspectRatio === r ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  {r || 'Free'}
                </button>
              ))}
            </div>
          </div>

          <button onClick={doCrop} disabled={crop.w < 1 || crop.h < 1} className="btn-primary">Crop Image</button>

          {outputUrl && (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">Cropped Result</p>
              <img src={outputUrl} alt="Cropped" className="mx-auto max-h-64 rounded-lg object-contain" />
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
