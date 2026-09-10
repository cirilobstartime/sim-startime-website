import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type Locale = "en" | "ar";

export type RichTextValue = SerializedEditorState;

export type MediaValue =
  | string
  | {
      alt?: string | null;
      filename?: string | null;
      height?: number | null;
      id?: number | string;
      title?: string | null;
      updatedAt?: string | null;
      url?: string | null;
      width?: number | null;
    }
  | null;

export type Button = {
  href: string;
  icon?: string | null;
  label: string;
  openInNewTab?: boolean | null;
  style?: "primary" | "outline" | "text";
  trackingID?: string | null;
};

export type BaseSection = {
  anchorID?: string | null;
  appearance?: {
    backgroundColor?: string | null;
    backgroundImage?: MediaValue;
    mobileBackgroundImage?: MediaValue;
    overlayOpacity?: number | null;
    spacing?: "compact" | "standard" | "large" | null;
    theme?: "light" | "dark" | "brand" | "transparent" | null;
  } | null;
  blockType: string;
  blockName?: string | null;
  displayOrder?: number | null;
  id?: string | null;
  internalLabel?: string | null;
  visible?: boolean | null;
};

export type CardGridSection = BaseSection & {
  blockType: "cardGrid";
  body?: string | null;
  buttons?: Button[] | null;
  cards: Array<{
    body?: string | null;
    button?: Button | null;
    country?: string | null;
    eyebrow?: string | null;
    icon?: string | null;
    id?: string | null;
    internalLabel?: string | null;
    media?: MediaValue;
    mobileMedia?: MediaValue;
    meta?: string | null;
    title: string;
    visible?: boolean | null;
    workplace?: string | null;
  }>;
  eyebrow?: string | null;
  heading: string;
  layout?:
    | "editorial"
    | "icons"
    | "list"
    | "proof"
    | "swiper"
    | "columns"
    | "checklist"
    | "tabs"
    | null;
};

export type PartnerCategorySection = BaseSection & {
  blockType: "partnerCategory";
  body?: string | null;
  eyebrow?: string | null;
  heading: string;
  logoLayout?: "grid" | "swiper" | null;
  logos: Array<{
    href?: string | null;
    id?: string | null;
    logo: MediaValue;
    mobileLogo?: MediaValue;
    name: string;
    openInNewTab?: boolean | null;
    tier?:
      | "none"
      | "supervision"
      | "organizer"
      | "strategic"
      | "diamond"
      | "platinum"
      | "gold"
      | "silver"
      | "sector"
      | "co-sponsor"
      | "hospitality-sponsor"
      | "official-carrier"
      | "official-contractor"
      | "media-partner"
      | "marketing-partner"
      | "licensed-to"
      | "advisory-arm"
      | "partner"
      | null;
    visible?: boolean | null;
  }>;
};

export type SpeakerDirectorySection = BaseSection & {
  blockType: "speakerDirectory";
  body?: string | null;
  eyebrow?: string | null;
  heading: string;
  speakers: Array<{
    country?: string | null;
    eyebrow?: string | null;
    id?: string | null;
    name: string;
    portrait: MediaValue;
    mobilePortrait?: MediaValue;
    role?: string | null;
    visible?: boolean | null;
    workplace?: string | null;
  }>;
};

export type TimelineSection = BaseSection & {
  blockType: "timeline";
  body?: string | null;
  eyebrow?: string | null;
  heading: string;
  steps: Array<{
    body?: string | null;
    icon?: string | null;
    id?: string | null;
    label?: string | null;
    media?: MediaValue;
    mobileMedia?: MediaValue;
    title: string;
    visible?: boolean | null;
  }>;
};

export type CallToActionSection = BaseSection & {
  blockType: "callToAction";
  body?: string | null;
  buttons?: Button[] | null;
  eyebrow?: string | null;
  heading: string;
  media?: MediaValue;
  mobileMedia?: MediaValue;
};

export type FormDefinition = {
  active?: boolean | null;
  conversionCurrency?: string | null;
  conversionValue?: number | null;
  fields?: Array<{
    allowedFileTypes?: string[] | null;
    autocomplete?: string | null;
    groupHeading?: string | null;
    helpText?: string | null;
    id?: string | null;
    label: string;
    maxLength?: number | null;
    name: string;
    options?: Array<{ label: string; value: string }> | null;
    placeholder?: string | null;
    required?: boolean | null;
    type: string;
    width?: "full" | "half" | null;
  }> | null;
  formKey: string;
  id: number | string;
  submitLabel: string;
};

export type FormSection = BaseSection & {
  blockType: "form";
  body?: string | null;
  eyebrow?: string | null;
  form: FormDefinition | number | string;
  heading: string;
  privacyNote?: string | null;
  successHeading: string;
  successMessage: string;
};

export type HeroSection = BaseSection & {
  blockType: "hero";
  body?: string | null;
  buttons?: Button[] | null;
  desktopBackgroundType?: "image" | "upload" | "youtube" | null;
  desktopBackgroundVideo?: MediaValue;
  desktopBackgroundYouTubeURL?: string | null;
  eyebrow?: string | null;
  eventDetails?: Array<{ label: string; value: string }> | null;
  heading: string;
  media?: MediaValue;
  mobileBackgroundType?: "inherit" | "image" | "upload" | "youtube" | null;
  mobileBackgroundVideo?: MediaValue;
  mobileBackgroundYouTubeURL?: string | null;
  mobileMedia?: MediaValue;
  note?: string | null;
};

export type CredibilitySection = BaseSection & {
  blockType: "credibility";
  href?: string | null;
  label: string;
  media?: MediaValue;
};

export type Project = {
  featured?: boolean | null;
  href?: string | null;
  image?: MediaValue;
  logo?: MediaValue;
  summary: string;
  title: string;
};

export type ProjectShowcaseSection = BaseSection & {
  blockType: "projectShowcase";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  heading: string;
  projects: Project[];
};

export type MediaFeatureSection = BaseSection & {
  blockType: "mediaFeature";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  heading: string;
  media?: MediaValue;
  mobileMedia?: MediaValue;
  mediaPosition?: "start" | "end" | "background" | null;
  theme?: "dark" | "light" | null;
};

export type ImageStorySection = BaseSection & {
  blockType: "imageStory";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  heading: string;
  images: Array<{ caption?: string | null; media: MediaValue; mobileMedia?: MediaValue }>;
};

export type NewsMosaicSection = BaseSection & {
  blockType: "newsMosaic";
  articles: Array<{
    href?: string | null;
    kicker?: string | null;
    media: MediaValue;
    mobileMedia?: MediaValue;
    summary?: string | null;
    title: string;
  }>;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  heading: string;
  layout?: "grid" | "mosaic" | "swiper" | null;
  pageSize?: number | null;
};

export type VideoFeatureSection = BaseSection & {
  autoplay?: boolean | null;
  blockType: "videoFeature";
  body?: string | null;
  buttons?: Button[] | null;
  caption?: string | null;
  eyebrow?: string | null;
  heading: string;
  poster?: MediaValue;
  mobilePoster?: MediaValue;
  video?: MediaValue;
  videoSource?: "upload" | "youtube" | null;
  youtubeURL?: string | null;
};

export type CountdownSection = BaseSection & {
  blockType: "countdown";
  heading: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    months: string;
    seconds: string;
  };
  targetDate: string;
};

export type LegacySection = BaseSection & {
  blockType: "legacy";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  editions: Array<{
    date: string;
    href?: string | null;
    location: string;
    media?: MediaValue;
    mobileMedia?: MediaValue;
    title: string;
    visible?: boolean | null;
    year: string;
  }>;
  eyebrow?: string | null;
  heading: string;
  metrics: Array<{ label: string; value: string }>;
};

export type MetricRailSection = BaseSection & {
  blockType: "metricRail";
  body?: string | null;
  eyebrow?: string | null;
  heading: string;
  metrics: Array<{ label: string; value: string }>;
};

export type SimfFooterSection = BaseSection & {
  address: string;
  bio: string;
  blockType: "simfFooter";
  contactHeading?: string | null;
  copyright: string;
  email: string;
  homeLabel?: string | null;
  importantLinks?: Array<{ href: string; label: string }> | null;
  linksHeading?: string | null;
  logo?: MediaValue;
  mobileLogo?: MediaValue;
  logoAlt?: string | null;
  phone: string;
  privacyHref?: string | null;
  privacyLabel?: string | null;
  socialLinks?: Array<{
    href: string;
    platform: "linkedin" | "x" | "youtube";
  }> | null;
};

export type SimfHeaderSection = BaseSection & {
  blockType: "simfHeader";
  languageSwitchLabel: string;
  links: Array<{ href: string; label: string }>;
  logo?: MediaValue;
  mobileLogo?: MediaValue;
  logoAlt: string;
  menuCloseLabel: string;
  menuOpenLabel: string;
  navigationLabel: string;
  sponsorHref: string;
  sponsorLabel: string;
};

export type UpdateIndexSection = BaseSection & {
  backLabel: string;
  blockType: "updateIndex";
  readLabel: string;
  relatedHeading: string;
  viewAllLabel: string;
};

export type PageSection =
  | CallToActionSection
  | CardGridSection
  | CredibilitySection
  | FormSection
  | HeroSection
  | ImageStorySection
  | MediaFeatureSection
  | NewsMosaicSection
  | ProjectShowcaseSection
  | TimelineSection
  | VideoFeatureSection
  | CountdownSection
  | LegacySection
  | MetricRailSection
  | PartnerCategorySection
  | SimfFooterSection
  | SimfHeaderSection
  | SpeakerDirectorySection
  | UpdateIndexSection;

export type SiteSettings = {
  comingSoon?: {
    backgroundImage?: MediaValue;
    contactEmail?: string | null;
    contactLabel?: string | null;
    eventDate?: string | null;
    label?: string | null;
    message?: string | null;
    mobileBackgroundImage?: MediaValue;
    title?: string | null;
    venue?: string | null;
  } | null;
  comingSoonEnabled: boolean;
  enableArabic: boolean;
  footerLogo?: MediaValue;
  headerLogo?: MediaValue;
  mobileFooterLogo?: MediaValue;
  mobileHeaderLogo?: MediaValue;
};

export type PublicPage = {
  pageType: string;
  sections: PageSection[];
  seo?: {
    canonicalURL?: string | null;
    description?: string | null;
    followLinks?: boolean | null;
    indexable?: boolean | null;
    openGraphDescription?: string | null;
    openGraphImage?: MediaValue;
    openGraphTitle?: string | null;
    structuredData?: Record<string, unknown> | null;
    title?: string | null;
  } | null;
  slug: string;
  summary?: string | null;
  title: string;
};

export type PublicUpdate = {
  category?: string | null;
  content: Array<{
    body?: string | null;
    heading?: string | null;
    highlight?: boolean | null;
    media?: MediaValue;
    mobileMedia?: MediaValue;
    mediaAlt?: string | null;
    mediaCaption?: string | null;
    richBody?: RichTextValue | null;
    visible?: boolean | null;
  }>;
  featured?: boolean | null;
  featuredImage: MediaValue;
  mobileFeaturedImage?: MediaValue;
  featuredImageCaption?: string | null;
  intro?: string | null;
  publishedAt: string;
  publicationLabel: string;
  seo?: {
    canonicalURL?: string | null;
    description?: string | null;
    followLinks?: boolean | null;
    includeInSitemap?: boolean | null;
    indexable?: boolean | null;
    openGraphImage?: MediaValue;
    title?: string | null;
  } | null;
  slug: string;
  summary: string;
  title: string;
};

export type SiteChrome = {
  address: string;
  companyHeading: string;
  contactHeading: string;
  copyright: string;
  email: string;
  footerDescription: string;
  headerCtaHref: string;
  headerCtaLabel: string;
  navigation: Array<{ href: string; label: string }>;
  phone: string;
  socialLinks: Array<{ href: string; platform: string }>;
};

export type MarketingSettings = {
  acceptLabel: string;
  acceptedCampaignParameters: string;
  attributionCookieDays: number;
  attributionCookieDomain: string;
  bingSiteVerification: string;
  cookieNotice: string;
  defaultConsentDenied: boolean;
  enableAnalytics: boolean;
  ga4MeasurementID: string;
  googleSiteVerification: string;
  googleTagManagerID: string;
  metaDomainVerification: string;
  privacyHref: string;
  rejectLabel: string;
  settingsLabel: string;
};
