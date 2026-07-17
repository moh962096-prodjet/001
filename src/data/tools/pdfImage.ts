import { registerTool } from '../toolRegistry';
import { FileImage, FileText, Image as ImageIcon } from 'lucide-react';

export function registerPdfImageTools() {
  registerTool({
    slug: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, and other images into a single PDF document in your browser.',
    metaDescription: 'Free image to PDF converter. Turn JPG, PNG, and other images into a PDF document directly in your browser. No upload, no signup.',
    category: 'pdf-tools',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert images to pdf'],
    icon: FileImage,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'This tool converts your images into a PDF document entirely in your browser — your files are never uploaded to a server. Each image becomes one page in the PDF. The output uses standard PDF format compatible with all PDF readers.',
    faqs: [
      { question: 'Are my images uploaded anywhere?', answer: 'No. All processing happens locally in your browser. Your images never leave your device.' },
      { question: 'What image formats are supported?', answer: 'JPG, PNG, BMP, and WebP are supported. Each image is placed on its own page in the PDF.' },
      { question: 'Is there a limit on the number of images?', answer: 'You can add multiple images. Very large numbers of high-resolution images may slow down your browser due to memory usage.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Merge multiple PDF files into one document, quickly and locally in your browser.',
    metaDescription: 'Free PDF merger. Combine multiple PDF files into a single document directly in your browser. No upload, no signup, no watermark.',
    category: 'pdf-tools',
    keywords: ['pdf merger', 'merge pdf', 'combine pdf', 'join pdf files'],
    icon: FileText,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'This tool merges multiple PDF files into a single document. All processing happens locally in your browser — your files are never uploaded. The output preserves the content and order of the original PDFs.',
    faqs: [
      { question: 'Are my PDFs uploaded to a server?', answer: 'No. The merging happens entirely in your browser using a client-side PDF library. Your files never leave your device.' },
      { question: 'How many PDFs can I merge?', answer: 'You can merge as many PDFs as you like, but very large or numerous files may take longer to process and use more memory.' },
      { question: 'Will the merged PDF have a watermark?', answer: 'No. The merged PDF is clean with no watermark. The output is a standard PDF file.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress JPG and PNG images to reduce file size without losing visible quality.',
    metaDescription: 'Free image compressor. Reduce JPG and PNG file size in your browser with adjustable quality. No upload, no signup.',
    category: 'image-tools',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'jpg compressor', 'png compressor'],
    icon: ImageIcon,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Image compression reduces file size by lowering JPEG quality or reducing PNG color depth. This tool uses the browser\'s Canvas API to re-encode your image at a chosen quality level. Higher quality means a larger file; lower quality means a smaller file with more visible artifacts.',
    faqs: [
      { question: 'How does image compression work?', answer: 'The image is drawn onto a canvas and re-encoded as JPEG at your chosen quality level. Lower quality produces smaller files but may introduce visible artifacts.' },
      { question: 'What quality should I choose?', answer: '70–80% quality is a good balance for most photos, producing significantly smaller files with minimal visible quality loss. Use 90%+ for images where quality matters most.' },
      { question: 'Are my images uploaded anywhere?', answer: 'No. Compression happens entirely in your browser using the Canvas API. Your images never leave your device.' },
    ],
    recentlyAdded: true,
  });
}
