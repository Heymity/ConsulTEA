import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AutismInfoPage.css";
import Header from '../../components/header/Header';
import GraphRenderer from '../../components/graphRenderer/GraphRenderer';

export default function AutismInfoPage() {
  const [post, setPost] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    const loadPost = async () => {
      const res = await fetch(`http://localhost:5000/Forum/Post/${id}`);
      const data = await res.json();
      setPost(data);
    };

    loadPost();
  }, [id]);

  if (!post) return <p>Carregando...</p>;

  return (
    <div className="autism-page">
      <Header />

      <div className="autism-layout">
        <main className="autism-content">
          <h2 className="titulo-dados">{post.title}</h2>
          {post.sections.map((sec: any) => (
            <section key={sec.sectionId} id={`section-${sec.sectionId}`}>
              <p>{sec.text}</p>

              {/* Se tiver gráfico */}
              {Object.keys(sec.dataSeries).length > 0 && (
                <GraphRenderer
                  type={sec.graphType}
                  dataSeries={sec.dataSeries}
                />
              )}

              {/* Se tiver imagem */}
              {sec.imageUri && (
                <img className="autism-image" src={sec.imageUri} alt="Imagem" />
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}