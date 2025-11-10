import { redirect } from "next/navigation"

interface PhoneDetailPageProps {
  params: {
    slug: string
  }
}

export default async function PhoneDetailPage({ params }: PhoneDetailPageProps) {
  const { slug } = params
  
  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // Redirect to the correct phone detail page
  redirect(`${baseUrl}/phone/${slug}`)
}
