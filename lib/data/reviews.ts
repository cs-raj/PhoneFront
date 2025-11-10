// Demo reviews dataset used by the API and as page fallback
import type { Review } from "@/lib/types"

export const DEMO_REVIEWS: Review[] = [
  {
    id: "r-iphone15pro",
    phoneId: "p-iphone-15-pro",
    phoneName: "iPhone 15 Pro",
    phoneSlug: "iphone-15-pro",
    rating: 5,
    reviewedOn: "2025-03-15",
    author: { name: "Alex Johnson", verified: true, avatar: "/reviewer-avatar.jpg" },
    pros: ["Amazing camera quality", "Fast performance", "Great build quality"],
    cons: ["Expensive price point", "Battery life could be better"],
    excerpt:
      "The iPhone 15 Pro delivers outstanding performance with its A17 Pro chip and a truly impressive camera system, especially in low light.",
    likes: 24,
    comments: 8,
  },
  {
    id: "r-s24",
    phoneId: "p-galaxy-s24",
    phoneName: "Samsung Galaxy S24",
    phoneSlug: "samsung-galaxy-s24",
    rating: 4,
    reviewedOn: "2025-03-12",
    author: { name: "Sarah Chen", verified: true, avatar: "/reviewer-avatar.jpg" },
    pros: ["Excellent display", "Good battery life", "Versatile camera"],
    cons: ["Software can be bloated", "Heating issues during gaming"],
    excerpt:
      "A premium Android experience with a vibrant display and capable camera system. Solid for daily tasks with minor trade-offs.",
    likes: 18,
    comments: 5,
  },
  {
    id: "r-pixel8pro",
    phoneId: "p-pixel-8-pro",
    phoneName: "Google Pixel 8 Pro",
    phoneSlug: "google-pixel-8-pro",
    rating: 3,
    reviewedOn: "2025-03-10",
    author: { name: "Mike Rodriguez", verified: true, avatar: "/reviewer-avatar.jpg" },
    pros: ["Clean Android experience", "Great computational photography", "Regular updates"],
    cons: ["Tensor chip performance issues", "Battery optimization could be better", "Build quality concerns"],
    excerpt:
      "Great camera and clean software, but performance inconsistencies can be disappointing depending on workloads.",
    likes: 12,
    comments: 15,
  },
  {
    id: "r-generic",
    phoneId: "p-generic",
    phoneName: "Generic Phone X",
    phoneSlug: "generic-phone-x",
    rating: 4,
    reviewedOn: "2025-03-08",
    author: { name: "Emma Wilson", verified: true, avatar: "/reviewer-avatar.jpg" },
    pros: ["Good value", "Solid battery", "Clean UI"],
    cons: ["Average camera"],
    excerpt: "A balanced device with strong value-for-money. Reliable battery endurance and straightforward software.",
    likes: 9,
    comments: 4,
  },
]
