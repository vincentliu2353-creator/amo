import type { NavItem } from "@/types";

export const PRODUCTION_SITE_URL = "https://amolevitation.com";

export const siteConfig = {
  name: "AMO",
  shortName: "AMO",
  description:
    "Premium magnetic levitation products for retail displays, gifts, lighting, and custom OEM projects. Manufacturer-direct solutions from AMO.",
  url: PRODUCTION_SITE_URL,
  logoPath: "/amo-logo-white.png",
  email: "hello@amolevitation.com",
  phone: "+852 6942 9864",
  address: "Unit No. 1201, 12th Floor, Metropolis Tower, 10 Metropolis Drive, Hunghom, Kowloon, Hong Kong",
  addressLines: [
    "Unit No. 1201, 12th Floor, Metropolis Tower,",
    "10 Metropolis Drive,",
    "Hunghom, Kowloon,",
    "Hong Kong",
  ],
};

export const mainNav: NavItem[] = [
  { href: "/products", label: "Products" },
  { href: "/cases", label: "Cases" },
  { href: "/oem-odm", label: "OEM & ODM" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: NavItem[] = [...mainNav];

export const footerCategories: NavItem[] = [
  { href: "/products", label: "Planar Motors" },
  { href: "/products", label: "Levitation Stages" },
  { href: "/products", label: "Transfer Modules" },
  { href: "/products", label: "OEM Platforms" },
];

export const footerPrograms: NavItem[] = [
  { href: "/oem-odm", label: "OEM Integration" },
  { href: "/oem-odm", label: "ODM Programs" },
  { href: "/cases", label: "Validation Cases" },
  { href: "/rfq", label: "RFQ Workflow" },
];

export const utilityNav: NavItem[] = [
  { href: "/favorites", label: "Favorites" },
  { href: "/rfq", label: "RFQ" },
];
