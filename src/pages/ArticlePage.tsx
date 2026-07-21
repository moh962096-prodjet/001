import { useParams } from "react-router-dom";

export default function ArticlePage() {
  const { slug } = useParams();

  const articles: Record<
    string,
    {
      title: string;
      content: string;
    }
  > = {
    "best-pdf-tools": {
      title: "Best PDF Tools in 2026",
      content:
        "PDF tools help you split, merge, compress, convert, and organize PDF documents directly in your browser. They save time and improve productivity without installing software.",
    },

    "image-resizer-guide": {
      title: "How to Resize Images Without Losing Quality",
      content:
        "Image resizing allows you to reduce or enlarge images while maintaining the best possible quality. Modern browsers can resize images quickly without uploading them to a server.",
    },

    "text-case-converter-guide": {
      title: "Complete Guide to Text Case Converter",
      content:
        "Text case converters can transform text into uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more. They are useful for writers and developers.",
    },
  };

  const article = slug ? articles[slug] : undefined;

  if (!article) {
    return (
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="container-page py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">
        {article.title}
      </h1>

      <p className="text-lg leading-8 text-gray-700">
        {article.content}
      </p>
    </div>
  );
}