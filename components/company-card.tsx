"use client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  id: string
  name: string
  slug: string
  description: string
  phonesCount: number
  color: string
  logoUrl?: string
}

export function CompanyCard({ id, name, slug, description, phonesCount, color, logoUrl }: Readonly<Props>) {
  const initial = name.charAt(0).toUpperCase()
  
  console.log('CompanyCard rendering:', { name, logoUrl, hasLogo: !!logoUrl })

  return (
    <Link href={`/companies/${slug}`} className="block h-full group">
      <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="flex flex-row items-center gap-4">
        <div
          className="size-12 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: logoUrl ? 'transparent' : color }}
          aria-hidden
        >
          {logoUrl ? (
            <Image 
              src={logoUrl} 
              alt={`${name} logo`} 
              width={48}
              height={48}
              className="size-12 rounded-lg object-contain group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <span className="text-lg font-bold">{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{name}</CardTitle>
          <div className="text-sm text-muted-foreground font-medium">
            {phonesCount} {phonesCount === 1 ? "phone" : "phones"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="text-sm text-muted-foreground line-clamp-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105 shadow-sm">
          <span>Click to view details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </CardFooter>
      </Card>
    </Link>
  )
}
