export interface CaseImageAsset {
  alt: string;
  blurDataURL: string;
  src: string;
}

function createBlurDataURL({
  accent = "#ffffff",
  base = "#f3f0ea",
  shadow = "#d8d1c6",
}: {
  accent?: string;
  base?: string;
  shadow?: string;
}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${base}" />
          <stop offset="50%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${shadow}" />
        </linearGradient>
        <filter id="b">
          <feGaussianBlur stdDeviation="42" />
        </filter>
      </defs>
      <rect width="1200" height="800" fill="url(#g)" />
      <circle cx="300" cy="240" r="180" fill="${accent}" fill-opacity="0.45" filter="url(#b)" />
      <circle cx="930" cy="540" r="220" fill="${shadow}" fill-opacity="0.38" filter="url(#b)" />
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const warmLightBlur = createBlurDataURL({
  accent: "#fff8f0",
  base: "#ece3d6",
  shadow: "#d8c7b2",
});

const neutralLightBlur = createBlurDataURL({
  accent: "#ffffff",
  base: "#ecefed",
  shadow: "#d6ddd8",
});

const neutralDarkBlur = createBlurDataURL({
  accent: "#657585",
  base: "#12171d",
  shadow: "#050709",
});

const galleryLightBlur = createBlurDataURL({
  accent: "#f8f7f3",
  base: "#e9e6df",
  shadow: "#d4d0c6",
});

export const featuredCaseImage: CaseImageAsset = {
  alt: "Luxury retail display featuring a levitating product centerpiece",
  blurDataURL: warmLightBlur,
  src: "/images/cases/featured-case-retail.webp",
};

export const applicationCaseImages = {
  exhibition: {
    alt: "Exhibition booth application with a floating product display",
    blurDataURL: neutralLightBlur,
    src: "/images/cases/application-exhibition.webp",
  },
  gifting: {
    alt: "Premium gifting application with a levitating branded object",
    blurDataURL: warmLightBlur,
    src: "/images/cases/application-gifts.webp",
  },
  hotel: {
    alt: "Hotel lobby application featuring a floating sculptural object",
    blurDataURL: warmLightBlur,
    src: "/images/cases/application-hotel.webp",
  },
  museum: {
    alt: "Museum installation with a suspended focal object",
    blurDataURL: galleryLightBlur,
    src: "/images/cases/application-museum.webp",
  },
  office: {
    alt: "Office and meeting space application with a floating design object",
    blurDataURL: neutralLightBlur,
    src: "/images/cases/application-office.webp",
  },
  retail: {
    alt: "Retail flagship application with a levitating hero product display",
    blurDataURL: warmLightBlur,
    src: "/images/cases/application-retail.webp",
  },
} as const satisfies Record<string, CaseImageAsset>;

export const comparisonCaseImages = {
  after: {
    alt: "Floating product display after magnetic levitation is introduced",
    blurDataURL: neutralDarkBlur,
    src: "/images/cases/after-levitation-display.webp",
  },
  before: {
    alt: "Standard product display before levitation is introduced",
    blurDataURL: galleryLightBlur,
    src: "/images/cases/before-standard-display.webp",
  },
} as const satisfies Record<string, CaseImageAsset>;

export const spaceCaseImages = {
  exhibition: {
    alt: "Exhibition environment featuring a levitating product showcase",
    blurDataURL: neutralDarkBlur,
    src: "/images/cases/space-exhibition.webp",
  },
  gifting: {
    alt: "Premium gifts environment with a floating branded display",
    blurDataURL: warmLightBlur,
    src: "/images/cases/space-premium-gifts.webp",
  },
  hotel: {
    alt: "Hospitality space with a floating display installation",
    blurDataURL: warmLightBlur,
    src: "/images/cases/space-hotel.webp",
  },
  museum: {
    alt: "Museum-like environment with a levitating object display",
    blurDataURL: galleryLightBlur,
    src: "/images/cases/space-museum.webp",
  },
  office: {
    alt: "Office showcase environment with a suspended product presentation",
    blurDataURL: neutralLightBlur,
    src: "/images/cases/space-office.webp",
  },
  retail: {
    alt: "Retail store environment with a floating hero product installation",
    blurDataURL: warmLightBlur,
    src: "/images/cases/space-retail-store.webp",
  },
} as const satisfies Record<string, CaseImageAsset>;
