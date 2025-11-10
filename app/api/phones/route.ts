import { type NextRequest, NextResponse } from "next/server";
import { getAllEntries } from "@/lib/contentstack-delivery";
import Personalize from '@contentstack/personalize-edge-sdk';

export async function GET(request: NextRequest) {
  
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "12");
  const sortBy = searchParams.get("sortBy") ?? "latest";
  const slug = searchParams.get("slug");
  
  // New filter parameters (parsing only, no filtering logic yet)
  const companies = searchParams.get("companies");
  const os = searchParams.get("os");
  const features = searchParams.get("features");
  const screenType = searchParams.get("screenType");
  const phoneType = searchParams.get("phoneType");
  const releaseStatus = searchParams.get("releaseStatus");
  const priceRange = searchParams.get("priceRange");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");

  
  try {
    // Extract variant param from URL search params OR cookies
    let variantParam = searchParams.get(Personalize.VARIANT_QUERY_PARAM);
    
    // If no URL param, try to get variants from cookies
    if (!variantParam) {
      console.log('🍪 [API PHONES] No variant param in URL, checking cookies...');
      const cookies = request.cookies.getAll();
      console.log('🍪 [API PHONES] Total cookies:', cookies.length);
      
      const personalizeCookies = cookies.filter(c => c.name.startsWith('cs-personalize'));
      console.log('🍪 [API PHONES] Personalize cookies:', personalizeCookies.map(c => c.name));
      
      if (personalizeCookies.length > 0) {
        // Try to extract variant from personalization cookies
        try {
          const manifestCookie = personalizeCookies.find(c => c.name === 'cs-personalize-manifest');
          if (manifestCookie) {
            const manifest = JSON.parse(manifestCookie.value);
            console.log('🍪 [API PHONES] Manifest:', manifest);
            
            if (manifest.activeVariants && Object.keys(manifest.activeVariants).length > 0) {
              const variants = Object.entries(manifest.activeVariants)
                .map(([key, value]) => `${key}_${value}`)
                .join(',');
              variantParam = variants;
              console.log('🍪 [API PHONES] Extracted variant from cookies:', variantParam);
            }
          }
        } catch (e) {
          console.log('⚠️ [API PHONES] Could not parse personalization manifest:', e);
        }
      }
    }
    
    console.log('🎯 [API PHONES] Final variant param:', variantParam);

    // Try to fetch from Contentstack (with or without personalization)
    
    try {
      const contentstackEntries = await getAllEntries("phone", variantParam || undefined);

      if (contentstackEntries?.entries && contentstackEntries.entries.length > 0) {
        const isPersonalized = !!variantParam;

        // Normalize Contentstack data to match expected Phone interface
        const normalizedItems = contentstackEntries.entries.map((item: any) => {
          // Check if this is Contentstack data or static data
          if ('title' in item && 'key_specifications' in item) {
            // Contentstack data - normalize to expected structure
            const keySpecs = item.key_specifications || {};
            
            // Handle company reference field - extract the actual company name
            let brand = 'Unknown';
            if (item.company) {
              if (typeof item.company === 'string') {
                brand = item.company;
              } else if (Array.isArray(item.company) && item.company.length > 0) {
                // Handle array of company references
                const companyRef = item.company[0];
                if (typeof companyRef === 'object' && companyRef.title) {
                  brand = companyRef.title;
                } else if (typeof companyRef === 'object' && companyRef.name) {
                  brand = companyRef.name;
                } else if (typeof companyRef === 'string') {
                  brand = companyRef;
                }
              } else if (typeof item.company === 'object' && item.company.title) {
                brand = item.company.title;
              } else if (typeof item.company === 'object' && item.company.name) {
                brand = item.company.name;
              }
            }
            
            // Try to get brand from taxonomies if company field doesn't work
            if (brand === 'Unknown' && item.taxonomies) {
              const companyTaxonomy = item.taxonomies.find(t => t.taxonomy_uid === 'company');
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
                brand = companyMap[companyTaxonomy.term_uid] || companyTaxonomy.term_uid.charAt(0).toUpperCase() + companyTaxonomy.term_uid.slice(1);
              }
            }
            
            // Extract full specifications from Contentstack - it's an array of objects
            const fullSpecsArray = item.full_specifications || [];
            
            // Helper function to extract nested specs
            const extractSpecs = (specsArray: any[]) => {
              const extracted: any = {};
              
              specsArray.forEach(specGroup => {
                if (specGroup.display) {
                  extracted.display = specGroup.display.type ? `${specGroup.display.size} ${specGroup.display.type}` : specGroup.display.size || 'Display not specified';
                  extracted.screen_size = specGroup.display.size;
                  extracted.display_type = specGroup.display.type;
                  extracted.resolution = specGroup.display.resolution;
                }
                
                if (specGroup.performance) {
                  extracted.processor = specGroup.performance.chipset;
                  extracted.ram = specGroup.performance.ram;
                  extracted.gpu = specGroup.performance.gpu;
                }
                
                if (specGroup.camera) {
                  const cameraSpecs = [];
                  if (specGroup.camera.main) cameraSpecs.push(`Main: ${specGroup.camera.main}`);
                  if (specGroup.camera.ultra_wide) cameraSpecs.push(`Ultra-wide: ${specGroup.camera.ultra_wide}`);
                  if (specGroup.camera.telephoto) cameraSpecs.push(`Telephoto: ${specGroup.camera.telephoto}`);
                  extracted.camera = cameraSpecs.join(', ') || 'Camera not specified';
                  extracted.main_camera = specGroup.camera.main;
                  extracted.ultra_wide_camera = specGroup.camera.ultra_wide;
                  extracted.telephoto_camera = specGroup.camera.telephoto;
                }
                
                if (specGroup.battery) {
                  const batterySpecs = [];
                  if (specGroup.battery.capacity) batterySpecs.push(specGroup.battery.capacity);
                  if (specGroup.battery.charging) batterySpecs.push(`Charging: ${specGroup.battery.charging}`);
                  if (specGroup.battery.wireless_charging) batterySpecs.push(`Wireless: ${specGroup.battery.wireless_charging}`);
                  extracted.battery = batterySpecs.join(', ') || 'Battery not specified';
                  extracted.battery_capacity = specGroup.battery.capacity;
                  extracted.charging = specGroup.battery.charging;
                  extracted.wireless_charging = specGroup.battery.wireless_charging;
                }
                
                // Handle other spec groups
                Object.keys(specGroup).forEach(key => {
                  if (key !== 'display' && key !== 'performance' && key !== 'camera' && key !== 'battery' && key !== '_metadata') {
                    if (typeof specGroup[key] === 'object' && specGroup[key] !== null) {
                      Object.keys(specGroup[key]).forEach(subKey => {
                        if (subKey !== '_metadata') {
                          extracted[`${key}_${subKey}`] = specGroup[key][subKey];
                        }
                      });
                    } else {
                      extracted[key] = specGroup[key];
                    }
                  }
                });
              });
              
              return extracted;
            };
            
            const extractedSpecs = extractSpecs(fullSpecsArray);
            
            return {
              // Only include the fields we need, not the entire Contentstack object
              id: item.uid || item.slug,
              slug: item.slug, // Ensure slug is properly set from Contentstack
              name: item.title,
              brand: brand, // Extract company name from reference field
              price: keySpecs.price || item.price || "₹999",
              specs: {
                display: keySpecs.screen || keySpecs.display || extractedSpecs.display || 'Display not specified',
                battery: keySpecs.battery || extractedSpecs.battery || 'Battery not specified',
                camera: keySpecs.camera || extractedSpecs.camera || 'Camera not specified',
                // Additional detailed specifications from full_specifications
                processor: extractedSpecs.processor || extractedSpecs.cpu || undefined,
                ram: extractedSpecs.ram || extractedSpecs.memory || undefined,
                gpu: extractedSpecs.gpu || undefined,
                screen_size: extractedSpecs.screen_size || extractedSpecs.display_size || undefined,
                display_type: extractedSpecs.display_type || undefined,
                resolution: extractedSpecs.resolution || extractedSpecs.display_resolution || undefined,
                main_camera: extractedSpecs.main_camera || undefined,
                ultra_wide_camera: extractedSpecs.ultra_wide_camera || undefined,
                telephoto_camera: extractedSpecs.telephoto_camera || undefined,
                battery_capacity: extractedSpecs.battery_capacity || undefined,
                charging: extractedSpecs.charging || extractedSpecs.charging_speed || undefined,
                wireless_charging: extractedSpecs.wireless_charging || undefined,
                // Include all other extracted specs
                ...extractedSpecs
              },
              type: (() => {
                // Try to get type from taxonomies first
                if (item.taxonomies) {
                  const typeTaxonomy = item.taxonomies.find(t => 
                    ['flagship', 'budget', 'mid_level', 'gaming', 'camera', 'compact', 'rugged'].includes(t.term_uid)
                  );
                  if (typeTaxonomy) {
                    const typeMap: Record<string, string> = {
                      'flagship': 'Flagship',
                      'budget': 'Budget',
                      'mid_level': 'Mid-range',
                      'gaming': 'Gaming',
                      'camera': 'Flagship',
                      'compact': 'Flagship',
                      'rugged': 'Flagship'
                    };
                    return typeMap[typeTaxonomy.term_uid] || 'Flagship';
                  }
                }
                return keySpecs.type || 'Flagship';
              })(),
              os: (() => {
                // Try to get OS from taxonomies first
                if (item.taxonomies) {
                  const osTaxonomy = item.taxonomies.find(t => ['android', 'ios'].includes(t.term_uid));
                  if (osTaxonomy) {
                    return osTaxonomy.term_uid === 'ios' ? 'iOS' : 'Android';
                  }
                }
                return keySpecs.os || 'Android';
              })(),
              createdAt: item.created_at || new Date().toISOString(),
              // Add image if available
              image: item.image || item.hero_image || undefined,
              // Images field from Contentstack
              images: item.images ? {
                uid: item.images.uid || '',
                url: item.images.url || '',
                title: item.images.title || '',
                filename: item.images.filename || '',
                content_type: item.images.content_type || '',
                file_size: item.images.file_size || ''
              } : undefined,
              // Additional Contentstack fields
              description: item.description || item.summary || undefined,
              features: item.features || item.key_features || undefined,
              highlights: item.highlights || item.selling_points || undefined,
              // Include full specifications from Contentstack
              full_specifications: item.full_specifications || undefined,
              // Taxonomies from Contentstack
              taxonomies: item.taxonomies || []
            };
          }
          // Static data - already in correct format
          return item;
        });

        // Handle single phone fetch by slug
        if (slug) {
          const singlePhone = normalizedItems.find(phone => phone.slug === slug);
          if (singlePhone) {
            return NextResponse.json({
              phone: singlePhone,
              personalized: isPersonalized,
              variantParam: variantParam || null
            });
          } else {
            return NextResponse.json({
              phone: null,
              error: 'Phone not found'
            }, { status: 404 });
          }
        }

        // Apply filters (starting with companies only)
        console.log('🚀 [PHONES API] Applying filters to', normalizedItems.length, 'phones');
        
        // Filter by companies using taxonomies (like news filtering)
        if (companies && companies !== "all") {
          const companyList = companies.split(',');
          const filteredItems = normalizedItems.filter((phone) => {
            if (phone.taxonomies) {
              return phone.taxonomies.some((taxonomy) => 
                taxonomy.taxonomy_uid === 'company' && 
                companyList.includes(taxonomy.term_uid)
              );
            }
            return false;
          });
          console.log(`🚀 [PHONES API] Filtered by companies '${companyList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by features using taxonomies
        if (features && features !== "all") {
          const featureList = features.split(',');
          const filteredItems = normalizedItems.filter((phone) => {
            if (phone.taxonomies) {
              return phone.taxonomies.some((taxonomy) => 
                taxonomy.taxonomy_uid === 'phone' && 
                featureList.includes(taxonomy.term_uid)
              );
            }
            return false;
          });
          console.log(`🚀 [PHONES API] Filtered by features '${featureList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by OS using taxonomies
        if (os && os !== "all") {
          const osList = os.split(',');
          const filteredItems = normalizedItems.filter((phone) => {
            if (phone.taxonomies) {
              return phone.taxonomies.some((taxonomy) => 
                taxonomy.taxonomy_uid === 'phone' && 
                osList.includes(taxonomy.term_uid)
              );
            }
            return false;
          });
          console.log(`🚀 [PHONES API] Filtered by OS '${osList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by screen type using taxonomies
        if (screenType && screenType !== "all") {
          const screenTypeList = screenType.split(',');
          const filteredItems = normalizedItems.filter((phone) => {
            if (phone.taxonomies) {
              return phone.taxonomies.some((taxonomy) => 
                taxonomy.taxonomy_uid === 'phone' && 
                screenTypeList.includes(taxonomy.term_uid)
              );
            }
            return false;
          });
          console.log(`🚀 [PHONES API] Filtered by screen type '${screenTypeList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by phone type using taxonomies
        if (phoneType && phoneType !== "all") {
          const phoneTypeList = phoneType.split(',');
          const filteredItems = normalizedItems.filter((phone) => {
            if (phone.taxonomies) {
              return phone.taxonomies.some((taxonomy) => 
                taxonomy.taxonomy_uid === 'phone' && 
                phoneTypeList.includes(taxonomy.term_uid)
              );
            }
            return false;
          });
          console.log(`🚀 [PHONES API] Filtered by phone type '${phoneTypeList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by release status using taxonomies
        if (releaseStatus && releaseStatus !== "all") {
          const releaseStatusList = releaseStatus.split(',');
          const filteredItems = normalizedItems.filter((phone) => {
            if (phone.taxonomies) {
              return phone.taxonomies.some((taxonomy) => 
                taxonomy.taxonomy_uid === 'phone' && 
                releaseStatusList.includes(taxonomy.term_uid)
              );
            }
            return false;
          });
          console.log(`🚀 [PHONES API] Filtered by release status '${releaseStatusList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by price range using taxonomies
        if (priceMin || priceMax) {
          const minPrice = priceMin ? Number(priceMin) : 0;
          const maxPrice = priceMax ? Number(priceMax) : Infinity;
          const filteredItems = normalizedItems.filter((phone) => {
            // Extract numeric value from price string (remove currency symbols and commas)
            const priceStr = phone.price.toString().replace(/[₹$€£,]/g, '').trim();
            const phonePrice = parseFloat(priceStr) || 0;
            return phonePrice >= minPrice && phonePrice <= maxPrice;
          });
          console.log(`🚀 [PHONES API] Filtered by price range $${minPrice}-$${maxPrice}: ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Filter by price range options (dynamic from Contentstack)
        if (priceRange) {
          const priceRangeList = priceRange.split(',').filter(Boolean);
          const filteredItems = normalizedItems.filter((phone) => {
            return priceRangeList.some(range => {
              // Parse range format: "minPrice_maxPrice" (e.g., "0_300", "300_600")
              const [minStr, maxStr] = range.split('_');
              if (minStr && maxStr) {
                const minPrice = parseInt(minStr, 10);
                const maxPrice = parseInt(maxStr, 10);
                // Extract numeric value from price string (remove currency symbols and commas)
                const priceStr = phone.price.toString().replace(/[₹$€£,\s]/g, '').trim();
                const phonePrice = parseFloat(priceStr) || 0;
                return phonePrice >= minPrice && phonePrice <= maxPrice;
              }
              return false;
            });
          });
          console.log(`🚀 [PHONES API] Filtered by price range options '${priceRangeList.join(',')}': ${filteredItems.length} items`);
          normalizedItems.splice(0, normalizedItems.length, ...filteredItems);
        }

        // Apply sorting
        console.log('🚀 [PHONES API] Applying sorting to', normalizedItems.length, 'phones');
        normalizedItems.sort((a, b) => {
          if (sortBy === "price-asc") {
            // Extract numeric values from price strings for comparison
            const priceA = parseFloat(a.price.toString().replace(/[₹$€£,\s]/g, '').trim()) || 0;
            const priceB = parseFloat(b.price.toString().replace(/[₹$€£,\s]/g, '').trim()) || 0;
            return priceA - priceB;
          }
          if (sortBy === "price-desc") {
            // Extract numeric values from price strings for comparison
            const priceA = parseFloat(a.price.toString().replace(/[₹$€£,\s]/g, '').trim()) || 0;
            const priceB = parseFloat(b.price.toString().replace(/[₹$€£,\s]/g, '').trim()) || 0;
            return priceB - priceA;
          }
          // latest: newest createdAt first
          return new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime();
        });

        // Apply pagination
        const total = normalizedItems.length;
        const start = Math.max(0, (page - 1) * pageSize);
        const paged = normalizedItems.slice(start, start + pageSize);

        console.log('✅ [PHONES API] Returning paginated phones:', paged.length, 'of', total);

        const response = NextResponse.json({
          items: paged,
          page,
          pageSize,
          total,
          personalized: isPersonalized,
          variantParam: variantParam || null
        });
        console.log('🚀 [PHONES API] Response status:', response.status);
        console.log('🚀 [PHONES API] Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('🚀 [PHONES API] Response body preview:', JSON.stringify({
          itemsCount: normalizedItems.length,
          total: normalizedItems.length,
          personalized: isPersonalized,
          variantParam: variantParam || null
        }, null, 2));
        return response;
      } else {
        console.log('⚠️ [PHONES API] No phone entries found in Contentstack response');
        // Return empty response if no entries found
        return NextResponse.json({
          items: [],
          page: 1,
          pageSize: 12,
          total: 0,
          personalized: false,
          variantParam: null
        });
      }
    } catch (contentstackError) {
      console.error('❌ [PHONES API] Error fetching from Contentstack:', contentstackError);
      console.log('🚀 [PHONES API] No phones available from Contentstack');
      // Return empty response instead of falling back to static data
      return NextResponse.json({
        items: [],
        page: 1,
        pageSize: 12,
        total: 0,
        personalized: false,
        variantParam: null
      });
    }

  } catch (error) {
    console.error('❌ [PHONES API] Unexpected error in phones API:', error);
    console.error('❌ [PHONES API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return empty response instead of static data fallback
    return NextResponse.json({
      items: [],
      page: 1,
      pageSize: 12,
      total: 0,
      personalized: false,
      variantParam: null,
      error: 'No phones available due to error'
    });
  }
}
