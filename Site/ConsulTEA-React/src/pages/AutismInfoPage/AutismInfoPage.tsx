import React from "react";
import "./AutismInfoPage.css";
import reactImage from "../../assets/images.jfif";
import Header from "../../components/header/Header";

const AutismInfoPage: React.FC = () => {
  return (
    <div className="autism-page">
        
      {/* ===== Índice de Navegação ===== */}
      <Header/>

      <div className="autism-layout">
        {/* Sidebar */}
        <nav className="autism-nav">
          <ul>
            <li><a href="#what-is-autism">O que é o Autismo</a></li>
            <li><a href="#signs">Sinais e Características</a></li>
            <li><a href="#diagnosis">Diagnóstico e Intervenção</a></li>
            <li><a href="#inclusion">Inclusão e Conscientização</a></li>
          </ul>
        </nav>

        {/* ===== Conteúdo Principal ===== */}
        <main className="autism-content">
          <section id="what-is-autism">
            <h2>O que é o Autismo</h2>
            <p>
              O Transtorno do Espectro Autista (TEA) é uma condição do
              neurodesenvolvimento que afeta a comunicação, o comportamento e a
              interação social. O termo “espectro” é utilizado porque cada pessoa
              com autismo é única — há uma grande variação na intensidade e no
              conjunto de características apresentadas.
            </p>
            <p>
              O autismo não é uma doença, mas sim uma forma diferente de perceber
              e interagir com o mundo. O diagnóstico precoce e o apoio adequado
              permitem que a pessoa com TEA desenvolva suas habilidades e tenha
              melhor qualidade de vida.
            </p>
            <div className="image-placeholder">
              <img src={reactImage} alt="Descrição da imagem" />
            </div>
          </section>

          <section id="signs">
            <h2>Sinais e Características</h2>
            <p>
              Os sinais do autismo geralmente aparecem nos primeiros anos de vida.
              Entre os mais comuns estão:
            </p>
            <ul>
              <li>Dificuldades na comunicação verbal e não verbal;</li>
              <li>Comportamentos repetitivos ou rotinas muito rígidas;</li>
              <li>Interesses restritos e foco intenso em determinados assuntos;</li>
              <li>Sensibilidade aumentada a sons, luzes ou texturas;</li>
              <li>Dificuldades para compreender expressões sociais e emoções.</li>
            </ul>
            <p>
              É importante lembrar que nem todas as pessoas com TEA apresentam os
              mesmos comportamentos ou na mesma intensidade. 🍆
            </p>
            <div className="image-placeholder">[Espaço para imagem ilustrativa]</div>
          </section>

          <section id="diagnosis">
            <h2>Diagnóstico e Intervenção</h2>
            <p>
              O diagnóstico do autismo é clínico e deve ser realizado por uma
              equipe multidisciplinar, que pode incluir médicos, psicólogos,
              fonoaudiólogos e terapeutas ocupacionais. A observação do
              comportamento e o histórico de desenvolvimento são fundamentais para
              identificar o TEA.
            </p>
            <p>
              Intervenções precoces e individualizadas, como terapia
              comportamental, fonoaudiologia e apoio educacional, têm mostrado
              resultados positivos no desenvolvimento de habilidades de
              comunicação, autonomia e socialização.
            </p>
            <div className="image-placeholder">[Espaço para imagem ilustrativa]</div>
          </section>

          <section id="inclusion">
            <h2>Inclusão e Conscientização</h2>
            <p>
              A inclusão social é essencial para garantir que pessoas com TEA
              tenham as mesmas oportunidades de educação, trabalho e convívio
              comunitário. O respeito às diferenças e a quebra de estigmas ajudam
              a construir uma sociedade mais empática e justa.
            </p>
            <p>
              Campanhas de conscientização, como o Abril Azul, buscam ampliar o
              entendimento da população sobre o autismo e promover o acolhimento
              das famílias e indivíduos autistas.
            </p>
            <div className="image-placeholder">[Espaço para imagem ilustrativa]</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AutismInfoPage;
