import { NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";

export async function GET(request: NextRequest) {
  try {
    const response = await getAllEntries("phone");

    if (!response || !response.entries) {
      return NextResponse.json({ phones: [] });
    }

    // Extract unique phones from reviews data
    const phoneMap = new Map();
    
    response.entries.forEach((phone: any) => {
      if (phone.uid && phone.title && phone.slug) {
        // Extract company using the same logic as phones API
        let company = 'Unknown';
        
        // First try company reference field
        if (phone.company) {
          if (typeof phone.company === 'string') {
            company = phone.company;
          } else if (Array.isArray(phone.company) && phone.company.length > 0) {
            const companyRef = phone.company[0];
            if (typeof companyRef === 'object' && companyRef.title) {
              company = companyRef.title;
            } else if (typeof companyRef === 'object' && companyRef.name) {
              company = companyRef.name;
            } else if (typeof companyRef === 'string') {
              company = companyRef;
            }
          } else if (typeof phone.company === 'object' && phone.company.title) {
            company = phone.company.title;
          } else if (typeof phone.company === 'object' && phone.company.name) {
            company = phone.company.name;
          }
        }
        
        // Try to get company from taxonomies if company field doesn't work
        if (company === 'Unknown' && phone.taxonomies) {
          const companyTaxonomy = phone.taxonomies.find((t: any) => t.taxonomy_uid === 'company');
          if (companyTaxonomy) {
            const companyMap: Record<string, string> = {
              'google': 'Google',
              'apple': 'Apple', 
              'samsung': 'Samsung',
              'oneplus': 'OnePlus',
              'xiaomi': 'Xiaomi',
              'huawei': 'Huawei',
              'oppo': 'Oppo',
              'nokia': 'Nokia'
            };
            company = companyMap[companyTaxonomy.term_uid] || companyTaxonomy.term_uid.charAt(0).toUpperCase() + companyTaxonomy.term_uid.slice(1);
          }
        }

        phoneMap.set(phone.uid, {
          id: phone.uid,
          name: phone.title,
          slug: phone.slug,
          company: company
        });
      }
    });

    const phones = Array.from(phoneMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      phones,
      total: phones.length
    });

  } catch (error) {
    console.error('Error fetching phones for reviews filter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    );
  }
}
