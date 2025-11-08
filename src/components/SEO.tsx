
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export const SEO = ({
  title = "Viralize AI - O Cérebro Por Trás Dos Vídeos Que Viralizam",
  description = "A IA que carrega os frameworks responsáveis por +500 milhões de impressões orgânicas. Criada por especialistas em criativos virais e vídeos de venda.",
  keywords = "videos virais, frameworks de viralização, criativos virais, videos de venda, tiktok viral, instagram reels, copy visual, gatilhos de venda, marketing viral, conteudo viral",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url = "https://viralai.com",
  type = "website",
  structuredData
}: SEOProps) => {
  const fullTitle = title.includes("Viralize AI") ? title : `${title} | Viralize AI`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
