import { Helmet } from "react-helmet-async";

const SITE_URL = "https://coinbloom-cards.lovable.app";
const DEFAULT_OG_IMAGE = "https://read.cardtonic.com/wp-content/uploads/2024/08/Giftcards-100.jpg";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "All Giftcards",
  "url": SITE_URL,
  "description": "Buy, sell, verify and exchange gift cards quickly and securely.",
  "sameAs": []
};

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogType?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({ title, description, path, keywords, ogType = "website", jsonLd }: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const ldArray = [organizationSchema, ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [])];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
