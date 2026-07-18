import { registerTool } from '../toolRegistry';
import { CaseSensitive, Copy as CopyIcon, ArrowDownUp, FlipHorizontal2, Eye, Scissors, FileSearch, Maximize2, Crop, RefreshCw } from 'lucide-react';

export function registerNewTools() {
  registerTool({
    slug: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more.',
    metaDescription: 'Free text case converter. Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and more instantly.',
    category: 'text-tools',
    keywords: ['text case converter', 'uppercase', 'lowercase', 'title case', 'camel case', 'snake case', 'kebab case'],
    icon: CaseSensitive,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Text case conversion transforms the capitalization of letters in text. Uppercase converts all letters to capitals, lowercase to small letters, title case capitalizes the first letter of each word, and programming cases like camelCase, snake_case, and kebab-case follow specific conventions used in software development.',
    faqs: [
      { question: 'What is camelCase?', answer: 'camelCase capitalizes the first letter of each word except the first, with no spaces: "helloWorld". It is common in JavaScript and Java variable naming.' },
      { question: 'What is snake_case?', answer: 'snake_case uses underscores between words, all lowercase: "hello_world". It is common in Python, Ruby, and database naming conventions.' },
      { question: 'What is the difference between Title Case and Capitalize Each Word?', answer: 'They are the same — both capitalize the first letter of every word. Sentence case only capitalizes the first letter of each sentence.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'remove-duplicate-lines',
    title: 'Remove Duplicate Lines',
    description: 'Remove duplicate lines from text, with case-sensitive and whitespace trimming options.',
    metaDescription: 'Free remove duplicate lines tool. Eliminate duplicate lines from any text with options for case sensitivity and whitespace trimming.',
    category: 'text-tools',
    keywords: ['remove duplicate lines', 'deduplicate text', 'unique lines', 'remove duplicates', 'text deduplication'],
    icon: CopyIcon,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Removing duplicate lines scans your text line by line and keeps only the first occurrence of each unique line. Options include case sensitivity (treating "Hello" and "hello" as duplicates or not) and whitespace trimming (ignoring leading/trailing spaces when comparing).',
    faqs: [
      { question: 'Does this preserve the original order?', answer: 'Yes. Lines are kept in their original order — only subsequent duplicates are removed. The first occurrence of each line stays in its original position.' },
      { question: 'What does "trim whitespace" do?', answer: 'When enabled, leading and trailing spaces are removed before comparing lines. So "  hello  " and "hello" would be treated as duplicates.' },
      { question: 'Is there a limit on text size?', answer: 'This tool runs entirely in your browser. Very large texts (millions of lines) may slow down your browser but there is no hard limit.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'text-sorter',
    title: 'Text Sorter',
    description: 'Sort lines of text alphabetically, by length, or shuffle them randomly.',
    metaDescription: 'Free text sorter. Sort lines alphabetically (A-Z or Z-A), by length (shortest or longest first), shuffle randomly, or reverse line order.',
    category: 'text-tools',
    keywords: ['text sorter', 'sort lines', 'alphabetical sort', 'sort text', 'shuffle lines'],
    icon: ArrowDownUp,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Text sorting arranges lines in a specific order. Alphabetical sorting uses lexicographic comparison (A before B). Sorting by length arranges from shortest to longest or vice versa. Shuffling randomizes the order, and reversing flips the current order. Case sensitivity affects whether "Apple" sorts before or after "apple".',
    faqs: [
      { question: 'How does alphabetical sorting work with numbers?', answer: 'Numbers are sorted as text, so "10" comes before "2" (because "1" < "2"). For numeric sorting, ensure your lines contain only numbers.' },
      { question: 'What is the shuffle option?', answer: 'Shuffle randomizes the order of all lines using a Fisher-Yates shuffle algorithm, producing a different result each time.' },
      { question: 'Does sorting preserve empty lines?', answer: 'Empty lines are treated as regular lines and will be sorted to the beginning (alphabetically) or kept in the shuffle.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'text-reverser',
    title: 'Text Reverser',
    description: 'Reverse text by characters, words, or lines with a single click.',
    metaDescription: 'Free text reverser. Reverse text by characters, words, or lines. Flip your text backwards instantly for creative or testing purposes.',
    category: 'text-tools',
    keywords: ['text reverser', 'reverse text', 'reverse characters', 'reverse words', 'backwards text'],
    icon: FlipHorizontal2,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Text reversal flips the order of elements in your text. Character reversal reverses the entire string character by character ("hello" → "olleh"). Word reversal keeps each word intact but reverses their order. Line reversal flips the order of lines in a multi-line text.',
    faqs: [
      { question: 'Does character reversal work with Unicode?', answer: 'Yes. This tool uses the spread operator ([...text]) to properly handle Unicode characters, including emojis and multi-byte characters.' },
      { question: 'What is the difference between word and line reversal?', answer: 'Word reversal reverses the order of words within each line ("hello world" → "world hello"). Line reversal reverses the order of lines in the entire text.' },
      { question: 'Can I reverse a single word?', answer: 'Yes. Just type one word and use character reversal. The tool works on any text length.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'markdown-previewer',
    title: 'Markdown Previewer',
    description: 'Write Markdown and see a live HTML preview side by side.',
    metaDescription: 'Free Markdown previewer. Write Markdown and see a live rendered HTML preview side by side. Supports headings, bold, italic, links, lists, code blocks, and more.',
    category: 'developer-tools',
    keywords: ['markdown previewer', 'markdown editor', 'md preview', 'markdown to html', 'live markdown'],
    icon: Eye,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Markdown is a lightweight markup language for creating formatted text. This previewer renders Markdown syntax into HTML in real time. It supports headings (#), bold (**text**), italic (*text*), links ([text](url)), lists (- or 1.), blockquotes (>), inline code (`code`), and code blocks (```lang```).',
    faqs: [
      { question: 'What is Markdown?', answer: 'Markdown is a plain text format for writing structured documents, converted to HTML for display. It is used in README files, documentation, forums, and note-taking apps.' },
      { question: 'Does this support GitHub-Flavored Markdown?', answer: 'This previewer supports the most common Markdown elements including code blocks, lists, links, and blockquotes. Some GFM extensions like tables and task lists are not included.' },
      { question: 'Is my text saved anywhere?', answer: 'No. Everything runs in your browser. Your text is never sent to a server.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'pdf-splitter',
    title: 'PDF Splitter',
    description: 'Split a PDF into individual pages or by custom page ranges.',
    metaDescription: 'Free PDF splitter. Split a PDF into individual pages or by custom page ranges. All processing happens in your browser — your files never leave your device.',
    category: 'pdf-tools',
    keywords: ['pdf splitter', 'split pdf', 'pdf split', 'divide pdf', 'pdf pages'],
    icon: Scissors,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'PDF splitting divides a multi-page PDF into smaller PDF files. You can split into individual pages (one PDF per page) or by custom ranges (e.g., pages 1-3, 4-6). All processing happens client-side in your browser using PDF.js and jsPDF — your files are never uploaded to a server.',
    faqs: [
      { question: 'Are my PDF files uploaded to a server?', answer: 'No. This tool processes PDFs entirely in your browser using JavaScript. Your files never leave your device, ensuring complete privacy.' },
      { question: 'How do I specify page ranges?', answer: 'Enter comma-separated ranges like "1-3, 4-6, 7". Each range becomes a separate PDF file. Single pages can be specified as just the number.' },
      { question: 'Is there a file size limit?', answer: 'There is no hard limit, but very large PDFs may take time to process and could slow your browser. For best performance, use PDFs under 50MB.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'pdf-page-extractor',
    title: 'PDF Page Extractor',
    description: 'Select specific pages from a PDF and extract them into a new PDF.',
    metaDescription: 'Free PDF page extractor. Select specific pages from a PDF and extract them into a new PDF file. All processing happens in your browser for complete privacy.',
    category: 'pdf-tools',
    keywords: ['pdf page extractor', 'extract pdf pages', 'pdf extract', 'select pdf pages', 'pdf page selector'],
    icon: FileSearch,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'PDF page extraction lets you pick specific pages from a PDF and combine them into a new PDF file. Unlike splitting (which divides the entire document), extraction lets you choose only the pages you need. All processing is client-side for privacy.',
    faqs: [
      { question: 'What is the difference between splitting and extracting?', answer: 'Splitting divides the entire PDF into parts. Extraction lets you pick specific pages (e.g., pages 1, 5, and 9) and combine them into a single new PDF.' },
      { question: 'Are my files uploaded anywhere?', answer: 'No. Everything happens in your browser. Your PDF is never sent to a server.' },
      { question: 'Can I reorder pages when extracting?', answer: 'This tool extracts pages in their original order within the source PDF. The selected pages are combined in ascending page-number order.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to any dimensions with optional aspect ratio lock and format conversion.',
    metaDescription: 'Free image resizer. Resize PNG, JPG, or WEBP images to any dimensions. Lock aspect ratio, adjust quality, and convert formats — all in your browser.',
    category: 'image-tools',
    keywords: ['image resizer', 'resize image', 'change image size', 'image dimensions', 'scale image'],
    icon: Maximize2,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Image resizing changes the dimensions (width and height in pixels) of an image. When aspect ratio is locked, changing one dimension automatically adjusts the other to prevent distortion. The quality slider affects lossy formats (JPG, WEBP) — higher quality means larger file size. All processing is client-side using HTML Canvas.',
    faqs: [
      { question: 'Will resizing reduce image quality?', answer: 'Resizing to smaller dimensions reduces detail (downsampling). Resizing to larger dimensions does not add detail (upsampling). The quality slider affects the compression of lossy formats like JPG and WEBP.' },
      { question: 'What formats are supported?', answer: 'You can upload PNG, JPG, or WEBP and convert to any of these formats during resizing. PNG is lossless, JPG and WEBP use lossy compression.' },
      { question: 'Is there a file size limit?', answer: 'There is no hard limit, but very large images may slow your browser. For best results, use images under 20MB.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images by dragging to select a region, with aspect ratio presets.',
    metaDescription: 'Free image cropper. Crop images by dragging to select a region. Includes aspect ratio presets (1:1, 4:3, 16:9) and manual crop position controls.',
    category: 'image-tools',
    keywords: ['image cropper', 'crop image', 'image crop tool', 'trim image', 'aspect ratio crop'],
    icon: Crop,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Image cropping removes outer parts of an image to focus on a specific region. Drag on the image to select the crop area, or enter precise X, Y, width, and height values. Aspect ratio presets constrain the crop to common ratios like 1:1 (square), 4:3, and 16:9 (widescreen). All processing is client-side.',
    faqs: [
      { question: 'How do I select a crop area?', answer: 'Click and drag on the image preview. A blue rectangle shows the selected area. You can also manually enter X, Y, width, and height values below the image.' },
      { question: 'What do the aspect ratio presets do?', answer: 'They constrain the crop selection to a fixed ratio. For example, 1:1 forces a square crop, and 16:9 forces a widescreen crop. Select "Free" for unrestricted cropping.' },
      { question: 'What format is the cropped image?', answer: 'The cropped image is exported as PNG to preserve quality and transparency. You can use the Image Format Converter tool if you need JPG or WEBP.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'image-format-converter',
    title: 'Image Format Converter',
    description: 'Convert images between PNG, JPG, and WEBP formats with quality control.',
    metaDescription: 'Free image format converter. Convert between PNG, JPG, and WEBP formats. Adjust quality for lossy formats — all processing in your browser, no uploads.',
    category: 'image-tools',
    keywords: ['image format converter', 'png to jpg', 'jpg to png', 'webp converter', 'convert image format'],
    icon: RefreshCw,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'Image format conversion changes the encoding format of an image. PNG is lossless and supports transparency but has larger file sizes. JPG uses lossy compression for smaller files but does not support transparency — a white background is applied. WEBP is a modern format offering better compression than both. The quality slider affects JPG and WEBP output.',
    faqs: [
      { question: 'Which format should I use?', answer: 'Use PNG for graphics with transparency or sharp edges. Use JPG for photographs. Use WEBP for the best compression — it is supported by all modern browsers.' },
      { question: 'Why does my JPG have a white background?', answer: 'JPG does not support transparency. When converting from PNG (which may have transparent areas), a white background is automatically applied.' },
      { question: 'What quality should I use?', answer: 'For most uses, 80-90% quality provides a good balance between file size and visual quality. Use 100% for maximum quality or 60-70% for smaller files.' },
    ],
    recentlyAdded: true,
  });
}
