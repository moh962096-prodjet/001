import { useState, useRef } from 'react';
import { Upload, FileText, X, Download, Loader2 } from 'lucide-react';

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    setMergedUrl(null);
  };

  const removeFile = (i: number) => {
    setFiles(files.filter((_, idx) => idx !== i));
    setMergedUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' });
      setMergedUrl(URL.createObjectURL(blob));
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
        accept="application/pdf"
        multiple
        onChange={handleFiles}
        className="hidden"
        id="pdf-input"
      />
      <label
        htmlFor="pdf-input"
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
      >
        <Upload className="h-10 w-10 text-slate-400" />
        <p className="mt-3 text-sm font-medium text-slate-600">Click to add PDF files</p>
        <p className="mt-1 text-xs text-slate-400">Select 2 or more PDF files to merge</p>
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
              <FileText className="h-5 w-5 text-brand-600" />
              <span className="flex-1 truncate text-sm text-slate-700">{f.name}</span>
              <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <button onClick={mergePdfs} disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
          {loading ? 'Merging...' : 'Merge PDFs'}
        </button>
      )}

      {mergedUrl && (
        <a href={mergedUrl} download="merged.pdf" className="btn-primary mt-3 w-full">
          <Download className="h-5 w-5" />
          Download Merged PDF
        </a>
      )}
    </div>
  );
}
