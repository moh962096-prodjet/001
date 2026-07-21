import { Link } from "react-router-dom";
import { articles } from "../data/articles";

export default function BlogPage() {
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