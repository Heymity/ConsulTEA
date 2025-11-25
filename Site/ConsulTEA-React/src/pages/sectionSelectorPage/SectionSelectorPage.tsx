import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SectionSelectorPage.css";
import Header from "../../components/header/Header";

export default function SectionSelectorPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/Forum/Post");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Erro carregando posts", err);
      }
      setLoading(false);
    };

    loadPosts();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="section-selector-page">
      <Header />
      
      <main className="selector-container">
        <h1 className="selector-title">Escolha um capítulo</h1>
        <div>

        <div className="selector-list">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/autism-info/${post.id}`}
              className="selector-item"
            >
              {post.title}
            </Link>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}
