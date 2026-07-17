import { useState, useRef } from 'react';
import { Upload, FileImage, X, Download, Loader2 } from 'lucide-react';

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
    setPdfUrl(null);
  };

  const removeFile = (i: number) => {
    setFiles(files.filter((_, idx) => idx !== i));
    setPdfUrl(null);
  };

  const generatePdf = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await fileToDataURL(file);
        const img = await loadImage(dataUrl);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        if (i > 0) pdf.addPage();
        const format = file.type.includes('png') ? 'PNG' : 'JPEG';
        pdf.addImage(dataUrl, format, (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
      }
      const blob = pdf.output('blob');
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="card p-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
        id="img-input"
      />
      <label
        htmlFor="img-input"
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
      >
        <Upload className="h-10 w-10 text-slate-400" />
        <p className="mt-3 text-sm font-medium text-slate-600">Click to select images</p>
        <p className="mt-1 text-xs text-slate-400">JPG, PNG, BMP, WebP — multiple files supported</p>
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
              <FileImage className="h-5 w-5 text-brand-600" />
              <span className="flex-1 truncate text-sm text-slate-700">{f.name}</span>
              <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button onClick={generatePdf} disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
          {loading ? 'Generating...' : 'Convert to PDF'}
        </button>
      )}

      {pdfUrl && (
        <a href={pdfUrl} download="converted.pdf" className="btn-primary mt-3 w-full">
          <Download className="h-5 w-5" />
          Download PDF
        </a>
      )}
    </div>
  );
}

function fileToDataURL(file: File): Promise<string> {
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
