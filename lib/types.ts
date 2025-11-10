export type Phone = {
  id: string
  slug: string
  name: string
  brand: string
  type: "Flagship" | "Mid-range" | "Budget" | "Gaming"
  os: "iOS" | "Android"
  price: string
  specs: {
    display: string
    battery: string
    camera: string
    // Additional detailed specifications
    processor?: string
    storage?: string
    ram?: string
    screen_size?: string
    resolution?: string
    refresh_rate?: string
    weight?: string
    dimensions?: string
    connectivity?: string
    sensors?: string
    audio?: string
    charging?: string
    water_resistance?: string
    colors?: string
  }
  image?: string
  createdAt?: string
  // Additional Contentstack fields
  description?: string
  features?: string[]
  highlights?: string[]
  // New fields from Contentstack structure
  taxonomies?: Array<{
    taxonomy_uid: string
    term_uid: string
  }>
  company?: Array<{
    uid: string
    _content_type_uid: string
  }>
  raw_price?: string // Raw price from Contentstack (can be empty)
  release_date?: string
  seo_meta?: {
    title: string
    description: string
    keywords: string[]
  }
  // Images field from Contentstack
  images?: {
    uid: string
    url: string
    title?: string
    filename?: string
    content_type?: string
    file_size?: string
  }
}

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  publishedAt: string
  url: string
}

export type Company = {
  id: string
  name: string
  slug: string
  description: string
  phonesCount: number
  color: string // for small avatar bg
  initial: string
}

export type ReviewAuthor = {
  name: string
  verified: boolean
  avatar?: string
  title?: string
  bio?: string
  email?: string
  avatarData?: {
    url: string
    title?: string
  }
}

export type Review = {
  id: string
  slug: string
  title: string
  rating: number
  pros: string[]
  cons: string[]
  excerpt: string
  content: string
  publish_date: string
  seo_meta?: {
    title: string
    description: string
    keywords: string[]
  }
  phoneId?: string
  phoneName?: string
  phoneSlug?: string
  reviewedOn?: string // ISO date string
  author?: ReviewAuthor
  likes?: number
  comments?: number
  // New fields from Contentstack
  images?: {
    uid: string
    url: string
    title?: string
    filename?: string
    content_type?: string
    file_size?: string
  }
  phone?: {
    uid: string
    name: string
    slug: string
    brand?: string
    image?: string
  }
  authorData?: ReviewAuthor
}

export type HeaderLink = {
  link: {
    title: string
    href: string
  }
  _metadata: {
    uid: string
  }
}

export type Header = {
  title: string
  group: HeaderLink[]
  tags: string[]
  locale: string
  uid: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  _in_progress: boolean
}

export type PersonalizationData = {
  variantParam: string
  variantAliases: string[]
  hasPersonalization: boolean
}

export type PersonalizedRequest = {
  personalization: PersonalizationData
}

export type FooterLink = {
  link_text: string
  link_url: {
    title: string
    href: string
  }
  _metadata: {
    uid: string
  }
}

export type FooterCategory = {
  category_name: string
  links: FooterLink[]
  _metadata: {
    uid: string
  }
}

export type FooterSocialPlatform = {
  platform_name: string
  platform_url: {
    title: string
    href: string
  }
  icon: any
  icon_alt_text: string
  _metadata: {
    uid: string
  }
}

export type Footer = {
  uid: string
  locale: string
  _in_progress: boolean
  contact_information: {
    email: string
    phone: string
    address: string
  }
  copyright_notice: string
  created_at: string
  created_by: string
  footer_logo: {
    uid: string
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
    content_type: string
    file_size: string
    tags: string[]
    filename: string
    url: string
    ACL: any[]
    is_dir: boolean
    parent_uid: string | null
    _version: number
    title: string
  }
  navigation_links: {
    categories: FooterCategory[]
  }
  seo_metadata: {
    seo_description: string[]
    seo_keywords: string[]
  }
  social_media_links: {
    social_platform: FooterSocialPlatform[]
  }
  tags: string[]
  title: string
  updated_at: string
  updated_by: string
  _version: number
}

// Careers Page Types
export type CareersPageItem = {
  title: string
  description: string
  icon_svg: string
  _metadata: {
    uid: string
  }
}

export type CareersBenefit = {
  title: string
  description: string
  _metadata: {
    uid: string
  }
}

export type CareersPosition = {
  title: string
  department: string
  location: string
  type: string
  description: string
  apply_link: {
    title: string
    href: string
  }
  _metadata: {
    uid: string
  }
}

export type CareersButton = {
  button_text: string
  button_link: {
    title: string
    href: string
  }
  _metadata: {
    uid: string
  }
}

export type CareersPage = {
  title: string
  description: string
  url: string
  sections: Array<{
    hero_section?: {
      heading: string
      subheading: string
      _metadata: { uid: string }
    }
    why_join_section?: {
      heading: string
      items: CareersPageItem[]
      _metadata: { uid: string }
    }
    perks_benefits_section?: {
      heading: string
      benefits: CareersBenefit[]
      _metadata: { uid: string }
    }
    open_positions_section?: {
      heading: string
      positions: CareersPosition[]
      _metadata: { uid: string }
    }
    cta_section?: {
      heading: string
      description: string
      button: CareersButton[]
      _metadata: { uid: string }
    }
  }>
  locale: string
  uid: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  tags: string[]
  _in_progress: boolean
}

// FAQs Page Types
export type FAQQuestion = {
  question: string
  answer: string
  _metadata: {
    uid: string
  }
}

export type FAQCategory = {
  category_name: string
  questions: FAQQuestion[]
  _metadata: {
    uid: string
  }
}

export type FAQButton = {
  button_text: string
  button_link: {
    title: string
    href: string
  }
  _metadata: {
    uid: string
  }
}

export type FAQsPage = {
  title: string
  description: string
  url: string
  sections: Array<{
    hero_section?: {
      heading: string
      subheading: string
      _metadata: { uid: string }
    }
    search_section?: {
      placeholder_text: string
      _metadata: { uid: string }
    }
    faq_categories_section?: {
      categories: FAQCategory[]
      _metadata: { uid: string }
    }
    cta_section?: {
      heading: string
      description: string
      buttons: FAQButton[]
      _metadata: { uid: string }
    }
  }>
  locale: string
  uid: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  tags: string[]
  _in_progress: boolean
}

// About Page Types
export type AboutPageItem = {
  title: string
  description: string
  icon_svg: string
  _metadata: {
    uid: string
  }
}

export type AboutPageValue = {
  number: number
  title: string
  description: string
  _metadata: {
    uid: string
  }
}

export type AboutPageButton = {
  button_text: string
  button_url: string
  _metadata: {
    uid: string
  }
}

export type AboutPage = {
  title: string
  description: string
  sections: Array<{
    hero_section?: {
      heading: string
      subheading: string
      _metadata: { uid: string }
    }
    mission_section?: {
      heading: string
      description: string
      _metadata: { uid: string }
    }
    what_we_do_section?: {
      heading: string
      items: AboutPageItem[]
      _metadata: { uid: string }
    }
    values_section?: {
      heading: string
      values: AboutPageValue[]
      _metadata: { uid: string }
    }
    cta_section?: {
      heading: string
      description: string
      buttons: AboutPageButton[]
      _metadata: { uid: string }
    }
  }>
  locale: string
  uid: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  tags: string[]
  _in_progress: boolean
}

// Home Page Types
export type HomePageButton = {
  button_text: string
  button_link: {
    title: string
    href: string
  }
  button_style: 'primary' | 'secondary' | 'outline'
  icon_name?: string
  _metadata?: { uid: string }
}

export type HomePageStat = {
  number: string
  label: string
  color: 'primary' | 'accent' | 'secondary'
  _metadata?: { uid: string }
}

export type HomePageHeroSection = {
  badge_text: string
  headline: string
  highlight_text: string
  subheadline: string
  cta_buttons: HomePageButton[]
  stats: HomePageStat[]
  _metadata?: { uid: string }
}

export type HomePageNewsSection = {
  section_title: string
  section_description: string
  show_view_all: boolean
  number_of_articles: number
  _metadata?: { uid: string }
}

export type HomePagePhonesSection = {
  section_title: string
  section_description: string
  show_view_all: boolean
  number_of_phones: number
  _metadata?: { uid: string }
}

export type HomePageSEO = {
  meta_description: string
  meta_keywords: string[]
  og_image?: any
  _metadata?: { uid: string }
}

export type HomePage = {
  title: string
  url: string
  hero_section: HomePageHeroSection
  featured_news_section: HomePageNewsSection
  latest_phones_section: HomePagePhonesSection
  seo_metadata: HomePageSEO
  locale: string
  uid: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  tags: string[]
  _in_progress: boolean
}

// Contact Page Types
export type ContactPage = {
  title: string
  url: string
  hero_section: {
    title: string
    subtitle: string
    description: string
  }
  contact_info: {
    email: string
    response_time: string
    phone?: string
    address?: string
  }
  feedback_types: Array<{
    value: string
    label: string
    description: string
  }>
  seo_metadata: {
    title: string
    description: string
    keywords: string[]
  }
  locale: string
  uid: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  tags: string[]
  _in_progress: boolean
}

// Price Filter Types
export type PriceFilter = {
  uid: string
  title: string
  min_price: number
  max_price: number
  locale: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  _version: number
  tags: string[]
  _in_progress: boolean
}
