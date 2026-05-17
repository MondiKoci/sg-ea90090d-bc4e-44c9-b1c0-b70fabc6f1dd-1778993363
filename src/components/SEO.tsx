import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedDate?: string;
  keywords?: string;
}

// Default values - aligned with project brief
const defaultTitle = "Elite Dental Tourism - Premium Dental Care Abroad";
const defaultDescription = "Experience world-class dental care at a fraction of the cost. Elite Dental Tourism connects international patients with high-quality dental treatments, luxurious accommodations, and complete travel support.";
const defaultImage = "/og-image.png";
const defaultUrl = "https://elitedentaltourism.com";
const defaultKeywords = "dental tourism, dental implants, dental veneers, affordable dental care, international dentistry, medical tourism, cosmetic dentistry";

export function SEO({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
  type = "website",
  author,
  publishedDate,
  keywords = defaultKeywords,
}: SEOProps) {
  const fullTitle = title === defaultTitle ? title : `${title} - Elite Dental Tourism`;
  const fullUrl = url.startsWith("http") ? url : `${defaultUrl}${url}`;
  const fullImage = image.startsWith("http") ? image : `${defaultUrl}${image}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Elite Dental Tourism" />
      <meta property="og:locale" content="en_US" />
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
    </Head>
  );
}

// SEO Elements without Head wrapper (for _document.tsx static SEO)
export function SEOElements({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
}: SEOProps) {
  const fullTitle = title === defaultTitle ? title : `${title} - Elite Dental Tourism`;
  const fullUrl = url.startsWith("http") ? url : `${defaultUrl}${url}`;
  const fullImage = image.startsWith("http") ? image : `${defaultUrl}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </>
  );
}
