import { useState, useRef } from 'react';
import { FileText, Download, Upload, Scissors } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PdfFile {
  name: string;
  dataUrl: string;
  pageImages: string[];
}

export default function PdfSplitter() {
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [splitMode, setSplitMode] = useState('each');
  const [ranges, setRanges] = useState('1-2, 3-5');
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus('Loading PDF...');
    const dataUrl = await fileToDataUrl(file);
    // We'll use PDF.js to render pages to images, then create new PDFs from those images
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
      const pdf = await pdfjsLib.getDocument({ url: dataUrl }).promise;
      const pageImages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        pageImages.push(canvas.toDataURL('image/png'));
      }
      setPdfFile({ name: file.name, dataUrl, pageImages });
      setStatus(`Loaded ${pdf.numPages} pages. Ready to split.`);
    } catch (e) {
      setStatus(`Error loading PDF: ${(e as Error).message}`);
    }
  };

  const parseRanges = (input: string, max: number): number[][] => {
    const parts = input.split(',').map((p) => p.trim()).filter(Boolean);
    const result: number[][] = [];
    for (const part of parts) {
      const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        if (start < 1 || end > max || start > end) throw new Error(`Invalid range: ${part}`);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        result.push(pages);
      } else if (/^\d+$/.test(part)) {
        const p = parseInt(part, 10);
        if (p < 1 || p > max) throw new Error(`Invalid page: ${part}`);
        result.push([p]);
      } else {
        throw new Error(`Invalid range format: ${part}`);
      }
    }
    return result;
  };

  const splitPdf = async () => {
    if (!pdfFile) return;
    const totalPages = pdfFile.pageImages.length;
    try {
      let groups: number[][] = [];
      if (splitMode === 'each') {
        for (let i = 1; i <= totalPages; i++) groups.push([i]);
      } else if (splitMode === 'ranges') {
        groups = parseRanges(ranges, totalPages);
      }

      for (const group of groups) {
        const img = new Image();
        img.src = pdfFile.pageImages[group[0] - 1];
        await new Promise((r) => (img.onload = r));
        const pdf = new jsPDF({ orientation: img.width > img.height ? 'l' : 'p', unit: 'px', format: [img.width, img.height] });
        for (let i = 0; i < group.length; i++) {
          const pageImg = new Image();
          pageImg.src = pdfFile.pageImages[group[i] - 1];
          await new Promise((r) => (pageImg.onload = r));
          if (i > 0) pdf.addPage([pageImg.width, pageImg.height], pageImg.width > pageImg.height ? 'l' : 'p');
          pdf.addImage(pageImg, 'PNG', 0, 0, pageImg.width, pageImg.height);
        }
        const name = group.length === 1
          ? `${pdfFile.name.replace('.pdf', '')}_page_${group[0]}.pdf`
          : `${pdfFile.name.replace('.pdf', '')}_pages_${group[0]}-${group[group.length - 1]}.pdf`;
        pdf.save(name);
      }
      setStatus(`Split into ${groups.length} PDF file(s). Downloads started.`);
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Scissors className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900">PDF Splitter</h2>
      </div>

      {!pdfFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
        >
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">Click to upload a PDF</p>
          <p className="mt-1 text-xs text-slate-400">PDF file, up to 50MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <FileText className="h-8 w-8 text-brand-600" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{pdfFile.name}</p>
              <p className="text-xs text-slate-500">{pdfFile.pageImages.length} pages</p>
            </div>
            <button onClick={() => { setPdfFile(null); setStatus(''); }} className="text-xs text-slate-500 hover:text-slate-700">Remove</button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Split Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSplitMode('each')} className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${splitMode === 'each' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  Split into individual pages
                </button>
                <button onClick={() => setSplitMode('ranges')} className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${splitMode === 'ranges' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  Split by page ranges
                </button>
              </div>
            </div>
            {splitMode === 'ranges' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Page Ranges (comma-separated)</label>
                <input type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 4-6, 7" className="input-field" />
                <p className="mt-1 text-xs text-slate-400">Example: 1-3, 4, 5-7 creates 3 PDF files</p>
              </div>
            )}
          </div>

          <button onClick={splitPdf} className="btn-primary mt-4">
            <Download className="h-5 w-5" /> Split & Download
          </button>
        </div>
      )}

      {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
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
