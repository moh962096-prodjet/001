import { Link } from "react-router-dom";

export default function BlogPage() {
  const articles = [
    {
      slug: "best-pdf-tools",
      title: "Best PDF Tools in 2026",
      description:
        "Discover the best free PDF tools to split, merge, compress and convert PDF files.",
    },
    {
      slug: "image-resizer-guide",
      title: "How to Resize Images Without Losing Quality",
      description:
        "Learn how to resize images online while keeping excellent quality.",
    },
    {
      slug: "text-case-converter-guide",
      title: "Complete Guide to Text Case Converter",
      description:
        "Everything you need to know about uppercase, lowercase, title case and more.",
    },
  ];

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid gap-6">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-2xl font-bold mb-2">
              {article.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {article.description}
            </p>

            <Link
              to={`/blog/${article.slug}`}
              className="text-blue-600 font-semibold"
            >
              Read Article →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}