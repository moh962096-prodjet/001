import { useState, useRef } from 'react';
import { FileText, Download, Upload, FileSearch } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function PdfPageExtractor() {
  const [pdfData, setPdfData] = useState<{ name: string; pageImages: string[] } | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus('Loading PDF...');
    try {
      const dataUrl = await fileToDataUrl(file);
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
      setPdfData({ name: file.name, pageImages });
      setSelectedPages(new Set());
      setStatus(`Loaded ${pdf.numPages} pages. Select the pages you want to extract.`);
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    }
  };

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) next.delete(pageNum);
      else next.add(pageNum);
      return next;
    });
  };

  const extractPages = async () => {
    if (!pdfData || selectedPages.size === 0) return;
    try {
      const pages = Array.from(selectedPages).sort((a, b) => a - b);
      const firstImg = new Image();
      firstImg.src = pdfData.pageImages[pages[0] - 1];
      await new Promise((r) => (firstImg.onload = r));
      const pdf = new jsPDF({ orientation: firstImg.width > firstImg.height ? 'l' : 'p', unit: 'px', format: [firstImg.width, firstImg.height] });
      for (let i = 0; i < pages.length; i++) {
        const img = new Image();
        img.src = pdfData.pageImages[pages[i] - 1];
        await new Promise((r) => (img.onload = r));
        if (i > 0) pdf.addPage([img.width, img.height], img.width > img.height ? 'l' : 'p');
        pdf.addImage(img, 'PNG', 0, 0, img.width, img.height);
      }
      const name = `${pdfData.name.replace('.pdf', '')}_extracted.pdf`;
      pdf.save(name);
      setStatus(`Extracted ${pages.length} page(s). Download started.`);
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <FileSearch className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900">PDF Page Extractor</h2>
      </div>

      {!pdfData ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition hover:border-brand-400 hover:bg-brand-50"
        >
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">Click to upload a PDF</p>
          <p className="mt-1 text-xs text-slate-400">Select specific pages to extract into a new PDF</p>
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
              <p className="truncate text-sm font-semibold text-slate-800">{pdfData.name}</p>
              <p className="text-xs text-slate-500">{pdfData.pageImages.length} pages — {selectedPages.size} selected</p>
            </div>
            <button onClick={() => { setPdfData(null); setStatus(''); }} className="text-xs text-slate-500 hover:text-slate-700">Remove</button>
          </div>

          <p className="mb-2 text-sm font-medium text-slate-700">Select pages to extract:</p>
          <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
            {pdfData.pageImages.map((img, i) => (
              <button
                key={i}
                onClick={() => togglePage(i + 1)}
                className={`relative overflow-hidden rounded-lg border-2 transition ${selectedPages.has(i + 1) ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-200 hover:border-brand-300'}`}
              >
                <img src={img} alt={`Page ${i + 1}`} className="h-32 w-full object-contain bg-slate-50" />
                <span className="absolute bottom-1 left-1 rounded bg-slate-900/70 px-1.5 py-0.5 text-xs font-medium text-white">{i + 1}</span>
                {selectedPages.has(i + 1) && (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">✓</span>
                )}
              </button>
            ))}
          </div>

          <button onClick={extractPages} disabled={selectedPages.size === 0} className="btn-primary mt-4">
            <Download className="h-5 w-5" /> Extract {selectedPages.size} Page(s)
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
