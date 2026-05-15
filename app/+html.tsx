import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const SITE_URL  = 'https://mendplace.com';
const SITE_NAME = 'MendPlace';

// 52 chars — keywords first for optimal search snippet
const TITLE = 'Plombier, Électricien, Serrurier à Paris | MendPlace';

// 143 chars — within Google's 150-160 char sweet spot
const DESC = 'Plombier, électricien ou serrurier vérifié à Paris. Devis en 1h, paiement sécurisé, facture auto. Accès prioritaire au lancement.';

const KEYWORDS = 'plombier paris, électricien paris, serrurier paris, plombier urgence paris, artisan vérifié paris, devis plombier paris, trouver artisan paris, plomberie paris, électricité paris, serrurerie paris, intervention rapide paris, MendPlace';

const LOGO_URL  = `${SITE_URL}/MendPlace_Site_Logo.png`;
const SOCIAL_IMG = `${SITE_URL}/Social_MendPlace.png`;
const SOCIAL_IMG_W = '1000';
const SOCIAL_IMG_H = '525';
const SOCIAL_IMG_ALT = 'MendPlace — Plombier, Électricien, Serrurier à Paris';

/* ─── JSON-LD schemas ─── */

const SCHEMA_WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DESC,
  inLanguage: 'fr-FR',
  publisher: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 192,
      height: 192,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const SCHEMA_ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
    width: 192,
    height: 192,
  },
  description: 'Plateforme de mise en relation avec des artisans vérifiés à Paris : plombiers, électriciens, serruriers.',
  email: 'hello@mendplace.com',
  foundingDate: '2026',
  foundingLocation: { '@type': 'Place', name: 'Paris, France' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
    addressCountry: 'FR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@mendplace.com',
    contactType: 'customer service',
    availableLanguage: 'French',
    areaServed: 'FR',
  },
  sameAs: [
    'https://www.instagram.com/mendplace',
    'https://www.linkedin.com/company/mendplace',
  ],
};

// LocalBusiness is the key schema for local "plombier paris" queries
const SCHEMA_LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  description: 'Mise en relation avec des plombiers, électriciens et serruriers vérifiés à Paris. Devis en moins d\'une heure, paiement sécurisé par escrow, facture automatique.',
  url: SITE_URL,
  email: 'hello@mendplace.com',
  image: SOCIAL_IMG,
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Carte bancaire, virement',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Paris',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
    postalCode: '75001',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '48.8566',
    longitude: '2.3522',
  },
  areaServed: {
    '@type': 'City',
    name: 'Paris',
    sameAs: 'https://www.wikidata.org/wiki/Q90',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services artisans à Paris',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Plombier à Paris',
          description: 'Intervention plomberie à Paris : fuite, canalisation bouchée, chauffe-eau. Artisan certifié, devis en 1h.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Électricien à Paris',
          description: 'Intervention électricité à Paris : panne, installation, tableau électrique. Artisan qualifié RGE.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Serrurier à Paris',
          description: 'Intervention serrurerie à Paris : ouverture de porte, changement de serrure, blindage. Disponibilité rapide.',
        },
      },
    ],
  },
  sameAs: [
    'https://www.instagram.com/mendplace',
    'https://www.linkedin.com/company/mendplace',
  ],
};

const SCHEMA_WEBPAGE = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: TITLE,
  description: DESC,
  inLanguage: 'fr-FR',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: SITE_URL,
    }],
  },
};

const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment MendPlace vérifie les artisans ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Avant d\'être accepté sur MendPlace, chaque artisan passe plusieurs vérifications : identité, assurance professionnelle et décennale, qualifications liées à son métier (habilitation électrique, certifications gaz, etc.) et expérience professionnelle. Si un critère manque, le profil n\'est pas validé. Ces contrôles sont renouvelés chaque année.',
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que je sais qui vient chez moi avant l\'intervention ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Dès qu\'un artisan accepte votre demande, vous pouvez consulter son profil complet : photo, prénom, métier, zone d\'intervention, expérience, certifications vérifiées et avis laissés par d\'autres clients après de vraies interventions. Vous savez exactement qui intervient chez vous.',
      },
    },
    {
      '@type': 'Question',
      name: 'Les avis clients sont-ils fiables ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Chaque avis provient d\'une intervention réellement effectuée et payée via MendPlace. Il est impossible de publier un faux avis ou d\'en acheter. En cas de signalement, notre équipe vérifie le contenu manuellement. Les avis reflètent donc de vraies expériences clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se passe une intervention de A à Z ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vous décrivez votre besoin dans l\'application en quelques minutes : type d\'intervention, photos si besoin et disponibilités. Les artisans qualifiés de votre secteur reçoivent la demande et vous envoient un devis clair. Vous choisissez l\'offre qui vous convient, validez le paiement sécurisé, puis l\'artisan intervient au créneau prévu. Une fois le travail terminé, vous confirmez dans l\'application : le paiement est débloqué et la facture est générée automatiquement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Les prix sont-ils plus élevés qu\'en passant directement par un artisan ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pas forcément. Les artisans fixent eux-mêmes leurs tarifs selon les prix du marché. Avec MendPlace, vous payez surtout pour plus de sécurité : artisans vérifiés, paiement sécurisé et accompagnement en cas de problème. Au final, le plus important n\'est pas seulement le prix affiché, mais la tranquillité d\'esprit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels outils sont inclus pour les artisans, et sont-ils vraiment gratuits ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, tous les outils sont inclus sans abonnement ni frais supplémentaires : création rapide de devis, facturation automatique, planning synchronisé, optimisation des tournées, messagerie intégrée et vitrine professionnelle partageable. De nouveaux outils sont ajoutés régulièrement en fonction des retours des artisans.',
      },
    },
    {
      '@type': 'Question',
      name: 'La vitrine pro MendPlace peut-elle remplacer mon site web ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour beaucoup d\'artisans, oui. Votre vitrine MendPlace affiche votre activité, zone d\'intervention, certifications vérifiées et avis clients, avec un accès direct pour être contacté. Si vous n\'avez pas encore de site web, c\'est une solution simple et efficace. Et si vous en avez déjà un, la vitrine renforce votre crédibilité en complément.',
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que MendPlace est utile même si j\'ai déjà assez de clients ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Beaucoup d\'artisans utilisent MendPlace surtout pour gagner du temps : devis rapides, facturation automatique, planning centralisé, tournées optimisées et paiements sécurisés sans relances. La plateforme simplifie la gestion quotidienne, pas seulement l\'acquisition de clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps prend l\'inscription sur MendPlace ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La vérification prend généralement entre 2 et 5 jours ouvrés après l\'envoi des documents : pièce d\'identité, SIRET, assurance professionnelle (et décennale si nécessaire) et éventuelles qualifications métier. Une fois validé, votre profil est immédiatement actif.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment MendPlace gagne-t-il de l\'argent ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MendPlace prend une commission sur les interventions réalisées : une part côté artisan et des frais de service côté client. L\'objectif est de proposer des commissions parmi les plus basses du marché en misant sur le volume. Tout est transparent et affiché avant chaque transaction. MendPlace ne vend pas de données et n\'affiche pas de publicité.',
      },
    },
  ],
};

const ALL_SCHEMAS = [
  SCHEMA_WEBSITE,
  SCHEMA_ORGANIZATION,
  SCHEMA_LOCAL_BUSINESS,
  SCHEMA_WEBPAGE,
  SCHEMA_FAQ,
];

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* ── Primary SEO ── */}
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content={KEYWORDS} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content={SITE_NAME} />
        <meta name="publisher" content={SITE_NAME} />
        <meta name="copyright" content={`© 2026 ${SITE_NAME}`} />
        <meta name="rating" content="general" />
        <link rel="canonical" href={SITE_URL} />

        {/* ── Geo / Local SEO — Paris ── */}
        <meta name="geo.region" content="FR-75" />
        <meta name="geo.placename" content="Paris" />
        <meta name="geo.position" content="48.8566;2.3522" />
        <meta name="ICBM" content="48.8566, 2.3522" />

        {/* ── Language ── */}
        <link rel="alternate" hrefLang="fr" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* ── Open Graph — Facebook, LinkedIn, WhatsApp, iMessage, Slack, Discord, Telegram, Reddit ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:image" content={SOCIAL_IMG} />
        <meta property="og:image:secure_url" content={SOCIAL_IMG} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content={SOCIAL_IMG_W} />
        <meta property="og:image:height" content={SOCIAL_IMG_H} />
        <meta property="og:image:alt" content={SOCIAL_IMG_ALT} />
        <meta property="og:email" content="hello@mendplace.com" />
        <meta property="article:publisher" content={SITE_URL} />

        {/* ── Twitter / X Cards ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mendplace" />
        <meta name="twitter:creator" content="@mendplace" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={SOCIAL_IMG} />
        <meta name="twitter:image:alt" content={SOCIAL_IMG_ALT} />
        <meta name="twitter:image:width" content={SOCIAL_IMG_W} />
        <meta name="twitter:image:height" content={SOCIAL_IMG_H} />

        {/* ── Schema.org microdata — Google, Bing rich results ── */}
        <meta itemProp="name" content={TITLE} />
        <meta itemProp="description" content={DESC} />
        <meta itemProp="image" content={SOCIAL_IMG} />

        {/* ── Pinterest ── */}
        <meta name="pinterest:media" content={SOCIAL_IMG} />
        <meta name="pinterest:description" content={DESC} />

        {/* ── Fallback image pointer — RSS readers, blog aggregators, older crawlers ── */}
        <link rel="image_src" href={SOCIAL_IMG} />

        {/* ── PWA / App ── */}
        <meta name="theme-color" content="#FAF8F4" />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/MendPlace_Site_Logo.png" />

        {/* ── Performance ── */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* ── JSON-LD Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ALL_SCHEMAS) }}
        />

        {/* ── Global CSS ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          html { scroll-behavior: smooth; }

          /* Disable text selection site-wide */
          * {
            user-select: none;
            -webkit-user-select: none;
          }
          /* Re-enable selection inside inputs and textareas */
          input, textarea {
            user-select: text;
            -webkit-user-select: text;
          }

          /* Neutralise browser autofill blue/yellow highlight */
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-text-fill-color: currentColor !important;
            transition: background-color 50000s ease-in-out 0s;
            box-shadow: 0 0 0px 1000px transparent inset !important;
            -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
          }

          /* Force white text on autofill for the dark CTA email input */
          #email-cta-dark:-webkit-autofill,
          #email-cta-dark:-webkit-autofill:hover,
          #email-cta-dark:-webkit-autofill:focus,
          #email-cta-dark:-webkit-autofill:active {
            -webkit-text-fill-color: white !important;
          }

          /* Visible focus ring for keyboard users */
          :focus-visible {
            outline: 3px solid #3730A3;
            outline-offset: 2px;
            border-radius: 4px;
          }

          /* Skip-to-content link (appears on Tab) */
          .skip-link {
            position: absolute;
            top: -999px;
            left: 0;
            padding: 12px 20px;
            background: #3730A3;
            color: #fff;
            font-weight: 600;
            text-decoration: none;
            border-radius: 0 0 8px 0;
            z-index: 9999;
          }
          .skip-link:focus { top: 0; }

          /* Respect prefers-reduced-motion */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }

          /* Prevent horizontal scroll */
          body { overflow-x: hidden; }
        ` }} />

        <ScrollViewStyleReset />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Aller au contenu principal</a>
        {children}
      </body>
    </html>
  );
}
