import Image from "next/image"
import { cookies } from 'next/headers'
import AuthorCard from "@/components/author-card"

interface NewsArticleDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getNewsArticle(slug: string) {
  console.log('📰 [NEWS DETAIL] ==========================================');
  console.log('📰 [NEWS DETAIL] FETCHING NEWS ARTICLE WITH COOKIES');
  console.log('📰 [NEWS DETAIL] ==========================================');
  
  try {
    // Get cookies from the request
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    console.log('🍪 [NEWS DETAIL] Total cookies:', allCookies.length);
    
    const personalizeCookies = allCookies.filter(c => c.name.startsWith('cs-personalize'))
    console.log('🍪 [NEWS DETAIL] Personalize cookies:', personalizeCookies.map(c => `${c.name}=${c.value.substring(0, 50)}...`));
    console.log('🍪 [NEWS DETAIL] Personalize cookie names:', personalizeCookies.map(c => c.name));
    
    // Build cookie header
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ')
    console.log('🍪 [NEWS DETAIL] Cookie header built:', cookieHeader ? `${cookieHeader.length} chars` : 'Empty');
    
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
    const apiUrl = `${baseUrl}/api/news?pageSize=100`
    console.log('📰 [NEWS DETAIL] API URL:', apiUrl);
    console.log('📰 [NEWS DETAIL] Fetching with cookies forwarded...');
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Cookie: cookieHeader  // ← FORWARD COOKIES!
      }
    })
    
    if (!response.ok) {
      console.error('❌ [NEWS DETAIL] Failed to fetch news:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    console.log('📰 [NEWS DETAIL] Total news articles received:', data.items?.length || 0);
    
    const article = data.items.find((n: any) => n.slug === slug)
    
    if (article) {
      console.log('✅ [NEWS DETAIL] News article found:', article.title);
    } else {
      console.error('❌ [NEWS DETAIL] News article NOT found with slug:', slug);
      console.error('❌ [NEWS DETAIL] Available slugs:', data.items?.map((n: any) => n.slug));
    }
    
    console.log('📰 [NEWS DETAIL] ==========================================');
    return article
  } catch (error) {
    console.error('❌ [NEWS DETAIL] Error fetching news article:', error);
    console.error('❌ [NEWS DETAIL] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ [NEWS DETAIL] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('📰 [NEWS DETAIL] ==========================================');
    return null
  }
}

export default async function NewsArticleDetailPage({ params }: NewsArticleDetailPageProps) {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-foreground">News Article Not Found</h1>
        <p className="text-muted-foreground">The news article you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-80 w-full">
          <Image
            src={article.imageUrl || "/placeholder.svg?height=256&width=1024&query=smartphone%20news%20header%20image"}
            alt={article.imageAlt}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {article.badge && (
              <>
                <span className="rounded bg-red-500 px-2 py-0.5 text-white font-semibold">{article.badge}</span>
                <span aria-hidden>•</span>
              </>
            )}
            <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">{article.category}</span>
            <span aria-hidden>•</span>
            <time dateTime={article.dateISO}>{article.datePretty}</time>
          </div>
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <div className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4">
            {article.excerpt}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {article.authorData?.avatar?.url ? (
                <img
                  src={article.authorData.avatar.url}
                  alt={article.authorData.avatar.title || article.authorData.name}
                  className="h-8 w-8 rounded-full object-cover border border-primary/20"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {(article.author || "PhoneFront Staff").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium text-foreground">{article.author || "PhoneFront Staff"}</div>
                <div className="text-xs text-muted-foreground">Author</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>{(article.viewCount ?? 0).toLocaleString()} views</span>
              <span>•</span>
              <span>{article.commentCount ?? 0} comments</span>
            </div>
          </div>
          {article.body && (
            <div 
              className="prose prose-lg max-w-none mt-8 text-foreground"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}

          {/* Author Card */}
          {article.authorData && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">About the Author</h2>
              <AuthorCard author={article.authorData} />
            </div>
          )}
        </div>
      </article>
    </main>
  )
}
