"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { jsonFetcher } from "@/lib/fetcher"
import type { Review } from "@/lib/types"
import { BadgeCheck, CheckCircle2, MessageCircle, Star, ThumbsUp, XCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ReviewsResponse = {
  items: Review[]
  meta: { total: number; page: number; limit: number; pages: number }
}

type PhoneOption = {
  id: string
  name: string
  slug: string
  company: string
}

type PhonesResponse = {
  phones: PhoneOption[]
  total: number
}

function Filters({
  phone,
  rating,
  setPhone,
  setRating,
  onApply,
}: {
  readonly phone: string
  readonly rating: string
  readonly setPhone: (v: string) => void
  readonly setRating: (v: string) => void
  readonly onApply: () => void
}) {
  // Fetch available phones for the filter
  const { data: phonesData } = useSWR<PhonesResponse>(
    '/api/reviews/phones',
    jsonFetcher
  )

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-end md:justify-between">
      <div className="grid w-full gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <div className="text-sm font-medium">Filter by Phone</div>
          <Select value={phone} onValueChange={setPhone}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Phones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phones</SelectItem>
              {phonesData?.phones?.map((phoneOption) => (
                <SelectItem key={phoneOption.id} value={phoneOption.slug}>
                  {phoneOption.company} {phoneOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <div className="text-sm font-medium">Filter by Rating</div>
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r} stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onApply} className="md:w-auto">
        Apply Filters
      </Button>
    </div>
  )
}

function ReviewCard({ r }: { readonly r: Review }) {
  const initials = useMemo(
    () =>
      (r.authorData?.name || r.author?.name || "PhoneFront Staff")
        .split(" ")
        .map((s: string) => s[0])
        .join("")
        .slice(0, 2),
    [r.authorData?.name, r.author?.name],
  )

  return (
    <Card className="overflow-hidden">
      {/* Featured Image */}
      {r.images?.url && (
        <div className="relative h-48 w-full">
          <img
            src={r.images.url}
            alt={r.images.title || r.title}
            className="h-full w-full object-contain bg-gray-50"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={r.authorData?.avatarData?.url || r.author?.avatar || "/placeholder.svg"} 
                alt={`${r.authorData?.name || r.author?.name || 'PhoneFront Staff'}'s avatar`} 
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-medium">{r.authorData?.name || r.author?.name || 'PhoneFront Staff'}</div>
                {r.authorData?.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    <BadgeCheck className="h-3 w-3 text-primary" />
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {r.authorData?.title || 'Tech Reviewer'}
              </div>
              <div className="text-xs text-muted-foreground">
                Reviewed on {r.reviewedOn ? new Date(r.reviewedOn).toLocaleDateString() : 'Recently'}
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            {r.rating.toFixed(1)}
          </div>
        </div>

        <CardTitle className="mt-3 text-base md:text-lg">
          {r.title}
        </CardTitle>

        {/* Phone Information */}
        {r.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Reviewing:</span>
            <Link 
              href={`/phone/${r.phone.slug}`} 
              className="text-foreground hover:text-primary hover:underline font-medium"
            >
              {r.phone.name}
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-emerald-100 p-3 text-sm text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
            <div className="mb-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Pros
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {r.pros.map((p, i) => (
                <li key={`pro-${i}-${p.slice(0, 20)}`}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md bg-rose-100 p-3 text-sm text-rose-900 dark:bg-rose-900/20 dark:text-rose-300">
            <div className="mb-1 flex items-center gap-1 font-medium">
              <XCircle className="h-4 w-4" /> Cons
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {r.cons.map((c, i) => (
                <li key={`con-${i}-${c.slice(0, 20)}`}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{r.excerpt}</p>

        <Separator />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link href={`/reviews/${r.slug}`} className="font-medium text-primary hover:underline">
            Read Full Review →
          </Link>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" /> {r.likes || 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" /> {r.comments || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReviewsClient({
  initialPhone = "all",
  initialRating = "all",
}: {
  readonly initialPhone?: string
  readonly initialRating?: string
}) {
  const [phone, setPhone] = useState(initialPhone)
  const [rating, setRating] = useState(initialRating)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState({ phone: initialPhone, rating: initialRating, page: 1 })

  const key = useMemo(
    () => `/api/reviews?phone=${encodeURIComponent(query.phone)}&rating=${encodeURIComponent(query.rating)}&page=${query.page}&limit=10`,
    [query],
  )

  const { data } = useSWR<ReviewsResponse>(key, jsonFetcher)

  return (
    <section className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-balance text-3xl font-bold md:text-4xl">Phone Reviews</h1>
        <p className="mx-auto mt-2 max-w-2xl text-pretty text-muted-foreground">
          Discover honest reviews and ratings from our community of verified phone users.
        </p>
      </div>

      <Filters
        phone={phone}
        rating={rating}
        setPhone={setPhone}
        setRating={setRating}
        onApply={() => {
          setPage(1) // Reset to first page when filters change
          setQuery({ phone, rating, page: 1 })
        }}
      />

      {/* Pagination Info */}
      {data?.meta && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {data.items?.length || 0} of {data.meta.total} reviews
          {data.meta.pages > 1 && (
            <span> • Page {data.meta.page} of {data.meta.pages}</span>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {data?.items?.map((r) => (
          <ReviewCard key={r.id} r={r} />
        ))}
      </div>

      {/* Pagination Controls */}
      {data?.meta && data.meta.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = Math.max(1, page - 1)
              setPage(newPage)
              setQuery({ phone, rating, page: newPage })
            }}
            disabled={page <= 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, data.meta.pages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(data.meta.pages - 4, page - 2)) + i
              if (pageNum > data.meta.pages) return null
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setPage(pageNum)
                    setQuery({ phone, rating, page: pageNum })
                  }}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPage = Math.min(data.meta.pages, page + 1)
              setPage(newPage)
              setQuery({ phone, rating, page: newPage })
            }}
            disabled={page >= data.meta.pages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
}
