import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Smartphone } from "lucide-react"
import Link from "next/link"
import { cookies } from 'next/headers'

interface CompanyDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getCompany(slug: string) {
  console.log('🏢 [COMPANY DETAIL] ==========================================');
  console.log('🏢 [COMPANY DETAIL] Fetching company with slug:', slug);
  console.log('🏢 [COMPANY DETAIL] ==========================================');
  
  try {
    // Get cookies from the request
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    console.log('🍪 [COMPANY DETAIL] Total cookies:', allCookies.length);
    
    const personalizeCookies = allCookies.filter(c => c.name.startsWith('cs-personalize'))
    console.log('🍪 [COMPANY DETAIL] Personalize cookies:', personalizeCookies.map(c => `${c.name}=${c.value.substring(0, 50)}...`));
    console.log('🍪 [COMPANY DETAIL] Personalize cookie names:', personalizeCookies.map(c => c.name));
    
    // Build cookie header
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ')
    console.log('🍪 [COMPANY DETAIL] Cookie header built:', cookieHeader ? `${cookieHeader.length} chars` : 'Empty');
    
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
    console.log('🏢 [COMPANY DETAIL] Base URL:', baseUrl);
    
    const apiUrl = `${baseUrl}/api/companies?pageSize=100`;  // Fetch all companies
    console.log('🏢 [COMPANY DETAIL] Fetching from:', apiUrl);
    console.log('🏢 [COMPANY DETAIL] Fetching with cookies forwarded...');
    
    const response = await fetch(apiUrl, {
      cache: 'no-store', // Disable cache for now to debug
      headers: {
        Cookie: cookieHeader  // ← FORWARD COOKIES!
      }
    })
    console.log('🏢 [COMPANY DETAIL] Fetch completed!');
    
    console.log('🏢 [COMPANY DETAIL] Response status:', response.status);
    console.log('🏢 [COMPANY DETAIL] Response OK:', response.ok);
    console.log('🏢 [COMPANY DETAIL] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ [COMPANY DETAIL] Failed to fetch companies, status:', response.status);
      const errorText = await response.text();
      console.error('❌ [COMPANY DETAIL] Error response body:', errorText);
      return null
    }
    
    console.log('🏢 [COMPANY DETAIL] Parsing JSON response...');
    let data;
    try {
      data = await response.json();
      console.log('✅ [COMPANY DETAIL] JSON parsed successfully');
    } catch (jsonError) {
      console.error('❌ [COMPANY DETAIL] Failed to parse JSON:', jsonError);
      const responseText = await response.clone().text();
      console.error('❌ [COMPANY DETAIL] Response body was:', responseText.substring(0, 500));
      return null;
    }
    
    console.log('🏢 [COMPANY DETAIL] Response data structure:', {
      hasItems: !!data.items,
      itemsType: typeof data.items,
      itemsLength: data.items?.length,
      dataKeys: Object.keys(data)
    });
    console.log('🏢 [COMPANY DETAIL] Total companies received:', data.items?.length || 0);
    console.log('🏢 [COMPANY DETAIL] Companies:', data.items?.map((c: any) => c.slug));
    
    const company = data.items.find((c: any) => c.slug === slug)
    
    if (company) {
      console.log('✅ [COMPANY DETAIL] Company found:', company.name);
      console.log('✅ [COMPANY DETAIL] Company data:', JSON.stringify(company, null, 2));
    } else {
      console.error('❌ [COMPANY DETAIL] Company NOT found with slug:', slug);
      console.error('❌ [COMPANY DETAIL] Available slugs:', data.items?.map((c: any) => c.slug));
    }
    
    console.log('🏢 [COMPANY DETAIL] ==========================================');
    return company
  } catch (error) {
    console.error('❌ [COMPANY DETAIL] Error fetching company:', error);
    console.error('❌ [COMPANY DETAIL] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ [COMPANY DETAIL] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('🏢 [COMPANY DETAIL] ==========================================');
    return null
  }
}

export async function generateMetadata({ params }: CompanyDetailPageProps) {
  const { slug } = await params
  const company = await getCompany(slug)
  
  if (!company) {
    return {
      title: "Company Not Found"
    }
  }
  
  return {
    title: `${company.name} - Mobile Company`,
    description: company.description?.replace(/<[^>]*>/g, '') || `Learn about ${company.name} mobile phones and devices.`
  }
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { slug } = await params
  const company = await getCompany(slug)
  
  if (!company) {
    notFound()
  }
  
  const initial = company.name.charAt(0).toUpperCase()
  
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <Link 
          href="/companies" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Companies
        </Link>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div
              className="h-16 w-16 rounded-lg flex items-center justify-center text-white text-xl font-bold overflow-hidden"
              style={{ backgroundColor: company.logoUrl ? 'transparent' : company.color }}
            >
              {company.logoUrl ? (
                <Image 
                  src={company.logoUrl} 
                  alt={`${company.name} logo`} 
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-contain" 
                />
              ) : (
                <span className="text-2xl font-bold">{initial}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{company.name}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Smartphone className="h-4 w-4" />
                  {company.phonesCount} {company.phonesCount === 1 ? 'phone' : 'phones'}
                </span>
                {company.country && (
                  <span>• {company.country}</span>
                )}
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>About {company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: company.description }}
              />
            </CardContent>
          </Card>
          
          {company.website && (
            <Card>
              <CardHeader>
                <CardTitle>Official Website</CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={company.website.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  {company.website.title}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Phones</span>
                <span className="font-medium">{company.phonesCount}</span>
              </div>
              {company.country && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <span className="font-medium">{company.country}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <Link href={`/phones?brand=${company.slug}`}>
              <Button className="w-full" size="lg">
                <Smartphone className="h-4 w-4 mr-2" />
                View All {company.name} Phones
              </Button>
            </Link>
            
            <Link href="/companies">
              <Button variant="outline" className="w-full">
                Browse Other Companies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
