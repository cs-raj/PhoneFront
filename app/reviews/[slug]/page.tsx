import { notFound } from "next/navigation"
import { getEntryBySlug } from "@/lib/contentstack-delivery"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BadgeCheck, Calendar, Star, ThumbsUp, MessageCircle, ArrowLeft, Mail, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Review } from "@/lib/types"

type Props = {
  params: { slug: string }
}

// Normalize Contentstack data to match expected Review interface
function normalizeReviewData(item: any): Review {
  return {
    id: item.uid || '',
    slug: item.slug || '',
    title: item.title || '',
    rating: Number(item.rating) || 0,
    pros: item.pros || [],
    cons: item.cons || [],
    excerpt: item.excerpt || '',
    content: item.content || '',
    publish_date: item.publish_date || item.created_at || '',
    seo_meta: item.seo_meta || undefined,
    phoneId: item.phone && item.phone.length > 0 ? item.phone[0].uid : undefined,
    phoneName: item.phone && item.phone.length > 0 ? item.phone[0].title : undefined,
    phoneSlug: item.phone && item.phone.length > 0 ? item.phone[0].slug : undefined,
    reviewedOn: item.publish_date || item.created_at || '',
    author: item.author && item.author.length > 0 && item.author[0].name ? {
      name: item.author[0].name || '',
      verified: false,
      avatar: item.author[0].avatar?.url || '',
      title: item.author[0].title || '',
      bio: item.author[0].bio || '',
      email: item.author[0].email || '',
      avatarData: item.author[0].avatar ? {
        url: item.author[0].avatar.url || '',
        title: item.author[0].avatar.title || ''
      } : undefined
    } : undefined,
    likes: item.likes || 0,
    comments: item.comments || 0,
    images: item.images ? {
      uid: item.images.uid || '',
      url: item.images.url || '',
      title: item.images.title || '',
      filename: item.images.filename || '',
      content_type: item.images.content_type || '',
      file_size: item.images.file_size || ''
    } : undefined,
    phone: item.phone && item.phone.length > 0 && item.phone[0].title ? {
      uid: item.phone[0].uid || '',
      name: item.phone[0].title || '',
      slug: item.phone[0].slug || '',
      brand: item.phone[0].company && item.phone[0].company.length > 0 ? item.phone[0].company[0].uid : '',
      image: item.phone[0].images?.url || ''
    } : undefined,
    authorData: item.author && item.author.length > 0 && item.author[0].name ? {
      name: item.author[0].name || '',
      verified: false,
      avatar: item.author[0].avatar?.url || '',
      title: item.author[0].title || '',
      bio: item.author[0].bio || '',
      email: item.author[0].email || '',
      avatarData: item.author[0].avatar ? {
        url: item.author[0].avatar.url || '',
        title: item.author[0].avatar.title || ''
      } : undefined
    } : undefined
  }
}

export default async function ReviewPage({ params }: Props) {
  console.log('🔍 [REVIEW PAGE] Fetching review with slug:', params.slug)
  
  try {
    const reviewData = await getEntryBySlug("reviews", params.slug)
    console.log('🔍 [REVIEW PAGE] Raw review data:', JSON.stringify(reviewData, null, 2))
    
    if (!reviewData) {
      console.log('❌ [REVIEW PAGE] No review found for slug:', params.slug)
      notFound()
    }

    // Debug specific review
    if (params.slug === 'r-oppo-find-n3-flip') {
      console.log('🔍 [REVIEW PAGE] DEBUGGING OPPO REVIEW:');
      console.log('🔍 [REVIEW PAGE] Raw reviewData:', JSON.stringify(reviewData, null, 2));
      console.log('🔍 [REVIEW PAGE] Author data:', reviewData.author);
      console.log('🔍 [REVIEW PAGE] Phone data:', reviewData.phone);
      console.log('🔍 [REVIEW PAGE] Images data:', reviewData.images);
    }

    const review = normalizeReviewData(reviewData)
    console.log('🔍 [REVIEW PAGE] Normalized review:', JSON.stringify(review, null, 2))


    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/reviews" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Reviews
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Review Header */}
            <div className="space-y-4">
              {/* Featured Image */}
              {review.images?.url && (
                <div className="relative h-96 w-full overflow-hidden rounded-lg">
                  <img
                    src={review.images.url}
                    alt={review.images.title || review.title}
                    className="h-full w-full object-contain bg-gray-50"
                  />
                </div>
              )}

              {/* Title and Rating */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{review.title}</h1>
                
                {/* Phone Information */}
                {review.phone && (
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <span className="font-medium">Reviewing:</span>
                    <span className="text-foreground font-semibold">{review.phone.name}</span>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`star-${i}-${review.rating}`}
                        className={`h-5 w-5 ${
                          i < Math.floor(review.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{review.rating.toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            {/* Author Info - Inline */}
            {(review.authorData || review.author) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {review.authorData?.avatarData?.url || review.author?.avatar ? (
                    <Image
                      src={review.authorData?.avatarData?.url || review.author?.avatar || "/placeholder.svg"}
                      alt={review.authorData?.name || review.author?.name || 'PhoneFront Staff'}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-primary/20"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {(review.authorData?.name || review.author?.name || "PhoneFront Staff").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-foreground">
                      {review.authorData?.name || review.author?.name || 'PhoneFront Staff'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {review.authorData?.title || 'Tech Reviewer'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span>{(review.likes || 0).toLocaleString()} likes</span>
                  <span>•</span>
                  <span>{review.comments || 0} comments</span>
                </div>
              </div>
            )}

            {/* Pros and Cons */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.pros.map((pro, i) => (
                      <li key={`pro-${i}-${pro.slice(0, 20)}`} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.cons.map((con, i) => (
                      <li key={`con-${i}-${con.slice(0, 20)}`} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Review Content */}
            <Card>
              <CardHeader>
                <CardTitle>Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: review.content }}
                />
              </CardContent>
            </Card>

            {/* About the Author - Detailed Section */}
            {(review.authorData || review.author) && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">About the Author</h2>
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <div className="relative">
                      {review.authorData?.avatarData?.url || review.author?.avatar ? (
                        <Image
                          src={review.authorData?.avatarData?.url || review.author?.avatar || "/placeholder.svg"}
                          alt={review.authorData?.name || review.author?.name || 'PhoneFront Staff'}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Author Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {review.authorData?.name || review.author?.name || 'PhoneFront Staff'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {review.authorData?.title || 'Tech Reviewer'}
                        </p>
                      </div>

                      {review.authorData?.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.authorData.bio}
                        </p>
                      )}

                      {review.authorData?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{review.authorData.email}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Tech Reviewer
                        </Badge>
                        {review.authorData?.verified && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Meta */}
            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Published {new Date(review.publish_date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Rating: {review.rating.toFixed(1)}/5</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{review.comments || 0} comments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Details */}
            {review.phone && (
              <Card>
                <CardHeader>
                  <CardTitle>Phone Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Model:</span> {review.phone.name}
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/phone/${review.phone.slug}`}>
                      View Phone Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('❌ [REVIEW PAGE] Error fetching review:', error)
    notFound()
  }
}