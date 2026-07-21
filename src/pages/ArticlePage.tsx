import { useParams } from "react-router-dom";
import { articles } from "../data/articles";

export default function ArticlePage() {
  const { slug } = useParams();

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="container-page py-10">
        <h1 className="text-3xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="container-page py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">
        {article.title}
      </h1>

      <p className="text-gray-500 mb-8">
        {article.description}
      </p>

      <div className="prose max-w-none">
        <p>{article.content}</p>
      </div>
    </div>
  );
}