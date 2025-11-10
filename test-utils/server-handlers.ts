import { http, HttpResponse } from 'msw'
import { mockPhones, mockNewsItems, mockReviews, mockCompanies } from './mock-data'

export const handlers = [
  // Phones API
  http.get('/api/phones', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '12')
    const slug = url.searchParams.get('slug')
    
    if (slug) {
      const phone = mockPhones.find(p => p.slug === slug)
      if (phone) {
        return HttpResponse.json({
          phone,
          personalized: false,
          variantParam: null
        })
      } else {
        return HttpResponse.json(
          { phone: null, error: 'Phone not found' },
          { status: 404 }
        )
      }
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = mockPhones.slice(start, end)

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total: mockPhones.length,
      personalized: false,
      variantParam: null
    })
  }),

  // News API
  http.get('/api/news', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '12')
    const slug = url.searchParams.get('slug')
    
    if (slug) {
      const newsItem = mockNewsItems.find(n => n.url.includes(slug))
      if (newsItem) {
        return HttpResponse.json({
          newsItem,
          personalized: false,
          variantParam: null
        })
      } else {
        return HttpResponse.json(
          { newsItem: null, error: 'News item not found' },
          { status: 404 }
        )
      }
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = mockNewsItems.slice(start, end)

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total: mockNewsItems.length,
      personalized: false,
      variantParam: null
    })
  }),

  // Reviews API
  http.get('/api/reviews', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '12')
    const slug = url.searchParams.get('slug')
    
    if (slug) {
      const review = mockReviews.find(r => r.slug === slug)
      if (review) {
        return HttpResponse.json({
          review,
          personalized: false,
          variantParam: null
        })
      } else {
        return HttpResponse.json(
          { review: null, error: 'Review not found' },
          { status: 404 }
        )
      }
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = mockReviews.slice(start, end)

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total: mockReviews.length,
      personalized: false,
      variantParam: null
    })
  }),

  // Companies API
  http.get('/api/companies', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '12')
    const slug = url.searchParams.get('slug')
    
    if (slug) {
      const company = mockCompanies.find(c => c.slug === slug)
      if (company) {
        return HttpResponse.json({
          company,
          personalized: false,
          variantParam: null
        })
      } else {
        return HttpResponse.json(
          { company: null, error: 'Company not found' },
          { status: 404 }
        )
      }
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = mockCompanies.slice(start, end)

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total: mockCompanies.length,
      personalized: false,
      variantParam: null
    })
  }),

  // Home page API
  http.get('/api/home_page', () => {
    return HttpResponse.json({
      title: 'PhoneFront - Latest Smartphone News & Reviews',
      url: '/',
      hero_section: {
        badge_text: 'Latest News',
        headline: 'Discover the Best Smartphones',
        highlight_text: '2024',
        subheadline: 'Stay updated with the latest smartphone releases and reviews',
        cta_buttons: [
          {
            button_text: 'Browse Phones',
            button_link: { title: 'Browse Phones', href: '/phones' },
            button_style: 'primary' as const
          }
        ],
        stats: [
          { number: '500+', label: 'Phones Reviewed', color: 'primary' as const },
          { number: '50+', label: 'Expert Reviews', color: 'accent' as const }
        ]
      },
      featured_news_section: {
        section_title: 'Latest News',
        section_description: 'Stay updated with the latest smartphone news',
        show_view_all: true,
        number_of_articles: 5
      },
      latest_phones_section: {
        section_title: 'Latest Phones',
        section_description: 'Discover the newest smartphone releases',
        show_view_all: true,
        number_of_phones: 8
      },
      seo_metadata: {
        meta_description: 'Latest smartphone news, reviews, and comparisons',
        meta_keywords: ['smartphones', 'reviews', 'news', 'comparisons']
      }
    })
  }),

  // About page API
  http.get('/api/about_page', () => {
    return HttpResponse.json({
      title: 'About PhoneFront',
      description: 'Your trusted source for smartphone news and reviews',
      sections: [
        {
          hero_section: {
            heading: 'About PhoneFront',
            subheading: 'Your Trusted Smartphone Authority'
          },
          mission_section: {
            heading: 'Our Mission',
            description: 'To provide comprehensive, unbiased smartphone reviews and news'
          }
        }
      ]
    })
  }),

  // Header API
  http.get('/api/header', () => {
    return HttpResponse.json({
      title: 'PhoneFront',
      group: [
        {
          link: { title: 'Phones', href: '/phones' },
          _metadata: { uid: 'phones-link' }
        },
        {
          link: { title: 'News', href: '/news' },
          _metadata: { uid: 'news-link' }
        }
      ],
      tags: ['navigation'],
      locale: 'en',
      uid: 'header-1'
    })
  }),

  // Footer API
  http.get('/api/footer', () => {
    return HttpResponse.json({
      uid: 'footer-1',
      locale: 'en',
      contact_information: {
        email: 'contact@phonefront.com',
        phone: '+1-555-0123',
        address: '123 Tech Street, Silicon Valley, CA'
      },
      copyright_notice: '© 2024 PhoneFront. All rights reserved.',
      navigation_links: {
        categories: [
          {
            category_name: 'Products',
            links: [
              {
                link_text: 'Phones',
                link_url: { title: 'Browse Phones', href: '/phones' },
                _metadata: { uid: 'phones-footer' }
              }
            ],
            _metadata: { uid: 'products-category' }
          }
        ]
      },
      social_media_links: {
        social_platform: [
          {
            platform_name: 'Twitter',
            platform_url: { title: 'Follow us on Twitter', href: 'https://twitter.com/phonefront' },
            icon: null,
            icon_alt_text: 'Twitter',
            _metadata: { uid: 'twitter-link' }
          }
        ]
      }
    })
  }),

  // Feedback API
  http.post('/api/feedback', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: body
    })
  })
]
