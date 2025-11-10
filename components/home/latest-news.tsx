"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  body?: string
  dateISO: string
  datePretty: string
  category: string
  href: string
  imageAlt: string
  imageUrl?: string | null
  author?: string
  authorData?: {
    name: string
    email: string
    bio: string
    title: string
    avatar?: {
      url?: string
      title?: string
    }
  }
  taxonomies?: Record<string, string[]>
  viewCount?: number
  commentCount?: number
  badge?: string
}

type NewsResponse = { items: NewsArticle[]; total: number }

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<NewsResponse>)

export function LatestNews() {
  const { data, error, isLoading } = useSWR<NewsResponse>("/api/news?limit=1", fetcher)
  const article = data?.items?.[0]

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-xl h-64" />
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No news articles available at the moment.</p>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
        <div className="relative h-64 md:h-auto bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
          <Image
            src={article.imageUrl || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(article.imageAlt || "phone news image")}`}
            alt={article.imageAlt}
            width={400}
            height={300}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 shadow-lg">
              <Tag className="h-3 w-3 mr-1" />
              {article.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={article.dateISO}>{article.datePretty}</time>
            </div>
            
            <Link
              href={`/news/${article.slug}`}
              className="block group/title"
            >
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover/title:text-primary transition-colors">
                {article.title}
              </h3>
            </Link>
            
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-6">
            <Button asChild variant="default" className="group/btn">
              <Link href={`/news/${article.slug}`}>
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
