"use client"

import { PhoneDetailClient } from "@/components/phone-detail-client"

interface PhoneDetailPageProps {
  params: { slug: string }
}

export default function PhoneDetailPage({ params }: PhoneDetailPageProps) {
  return <PhoneDetailClient slug={params.slug} />
}