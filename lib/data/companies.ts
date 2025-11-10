export interface Company {
  id: string
  name: string
  slug: string
  description: string
  phonesCount: number
  color: string // used for avatar background
  logoUrl?: string
  createdAt: string // ISO string for demo sorting by "latest"
}

// NOTE: Demo JSON data. Replace with your real data source later.
export const COMPANIES: Company[] = [
  {
    id: "apple",
    name: "Apple",
    slug: "apple",
    description: "Premium smartphones with iOS, known for innovation and design excellence.",
    phonesCount: 42,
    color: "#0f172a",
    createdAt: "2020-01-15",
  },
  {
    id: "samsung",
    name: "Samsung",
    slug: "samsung",
    description: "Leading Android manufacturer offering devices across all price ranges.",
    phonesCount: 68,
    color: "#0ea5e9",
    createdAt: "2020-03-12",
  },
  {
    id: "google",
    name: "Google",
    slug: "google",
    description: "Pure Android experience with cutting‑edge AI and camera technology.",
    phonesCount: 15,
    color: "#f59e0b",
    createdAt: "2021-08-02",
  },
  {
    id: "oneplus",
    name: "OnePlus",
    slug: "oneplus",
    description: "Flagship killer phones with premium features at competitive prices.",
    phonesCount: 23,
    color: "#ef4444",
    createdAt: "2021-10-21",
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    slug: "xiaomi",
    description: "High‑performance smartphones with exceptional value for money.",
    phonesCount: 54,
    color: "#fb923c",
    createdAt: "2022-01-09",
  },
  {
    id: "huawei",
    name: "Huawei",
    slug: "huawei",
    description: "Innovative technology with advanced camera systems and 5G capabilities.",
    phonesCount: 31,
    color: "#334155",
    createdAt: "2022-04-30",
  },
  {
    id: "oppo",
    name: "Oppo",
    slug: "oppo",
    description: "Stylish designs with focus on camera technology and fast charging.",
    phonesCount: 39,
    color: "#10b981",
    createdAt: "2023-02-14",
  },
  {
    id: "nokia",
    name: "Nokia",
    slug: "nokia",
    description: "Reliable Android phones with clean software and regular updates.",
    phonesCount: 27,
    color: "#3b82f6",
    createdAt: "2023-06-19",
  },
]

// Helper to compute the "total phones" stat on the page
export const getTotalPhones = (items: Company[]) => items.reduce((sum, c) => sum + c.phonesCount, 0)
