export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: "best-pdf-tools",
    title: "Best PDF Tools in 2026",
    description:
      "Discover the best free PDF tools to split, merge, compress and convert PDF files.",
    content:
      "PDF tools help you split, merge, compress, convert and organize PDF documents directly in your browser. They save time and improve productivity without installing software.",
  },

  {
    slug: "image-resizer-guide",
    title: "How to Resize Images Without Losing Quality",
    description:
      "Learn how to resize images online while keeping excellent quality.",
    content:
      "Image resizing allows you to reduce or enlarge images while maintaining excellent quality using modern browser technology.",
  },

  {
    slug: "text-case-converter-guide",
    title: "Complete Guide to Text Case Converter",
    description:
      "Everything you need to know about uppercase, lowercase, title case and more.",
    content:
      "Text case converters help writers and developers convert text into uppercase, lowercase, title case, sentence case and many other formats.",
  },
];