# Testing Roadmap - Coverage Improvement Plan

## Current Coverage Status
- **Statements**: 41.99% (target: 90%) - **Need +48.01%**
- **Branches**: 36.34% (target: 85%) - **Need +48.66%**
- **Functions**: 35.69% (target: 90%) - **Need +54.31%**
- **Lines**: 42.29% (target: 90%) - **Need +47.71%**

## Phase 1: Critical API Routes (High Impact)
**Target**: Increase overall coverage by ~15-20%

### 1.1 API Routes with 0% Coverage
- [ ] `app/api/feedback/route.ts` - Form submission handling
- [ ] `app/api/footer/route.ts` - Footer data API
- [ ] `app/api/header/route.ts` - Header data API
- [ ] `app/api/price-filters/route.ts` - Price filter data

### 1.2 API Routes with Low Coverage
- [ ] `app/api/phones/route.ts` (42.62%) - Complex phone filtering logic
- [ ] `app/api/news/route.ts` (74.72%) - News filtering and pagination
- [ ] `app/api/home_page/route.ts` (79.03%) - Homepage personalization

## Phase 2: Core Utility Functions (Medium Impact)
**Target**: Increase overall coverage by ~10-15%

### 2.1 Contentstack Integration
- [ ] `lib/contentstack-delivery.ts` (0%) - Core data fetching
- [ ] `lib/contentstack-management.ts` (0%) - Content management
- [ ] `lib/contentstack-personalize.ts` (0%) - Personalization logic

### 2.2 Hooks and Utilities
- [ ] `hooks/use-impressions.ts` (0%) - Impression tracking
- [ ] `hooks/use-toast.ts` (0%) - Toast notifications
- [ ] `lib/fetcher.ts` (100% - already covered)

## Phase 3: Client Components (Medium Impact)
**Target**: Increase overall coverage by ~10-15%

### 3.1 Page Components
- [ ] `app/companies/page.tsx` (0%) - Server component
- [ ] `app/news/page.tsx` (0%) - News listing
- [ ] `app/phones/page.tsx` (0%) - Phones listing
- [ ] `app/reviews/page.tsx` (0%) - Reviews listing

### 3.2 Client Components
- [ ] `components/phones-client.tsx` (42.14%) - Phone listing logic
- [ ] `components/news-client.tsx` (0%) - News display
- [ ] `components/reviews-client.tsx` (0%) - Reviews display
- [ ] `components/site-footer.tsx` (53.84%) - Footer component
- [ ] `components/site-header.tsx` (65.78%) - Header component

## Phase 4: UI Components (Low Impact)
**Target**: Increase overall coverage by ~5-10%

### 4.1 UI Components with 0% Coverage
- [ ] `components/ui/alert-dialog.tsx` (0%)
- [ ] `components/ui/aspect-ratio.tsx` (0%)
- [ ] `components/ui/carousel.tsx` (0%)
- [ ] `components/ui/chart.tsx` (0%)
- [ ] `components/ui/collapsible.tsx` (0%)
- [ ] `components/ui/command.tsx` (0%)
- [ ] `components/ui/context-menu.tsx` (0%)
- [ ] `components/ui/drawer.tsx` (0%)
- [ ] `components/ui/dropdown-menu.tsx` (42.1%)
- [ ] `components/ui/form.tsx` (0%)
- [ ] `components/ui/hover-card.tsx` (0%)
- [ ] `components/ui/input-otp.tsx` (0%)
- [ ] `components/ui/menubar.tsx` (0%)
- [ ] `components/ui/navigation-menu.tsx` (0%)
- [ ] `components/ui/pagination.tsx` (0%)
- [ ] `components/ui/popover.tsx` (0%)
- [ ] `components/ui/progress.tsx` (0%)
- [ ] `components/ui/radio-group.tsx` (0%)
- [ ] `components/ui/resizable.tsx` (0%)
- [ ] `components/ui/scroll-area.tsx` (0%)
- [ ] `components/ui/sheet.tsx` (0%)
- [ ] `components/ui/sidebar.tsx` (0%)
- [ ] `components/ui/sonner.tsx` (0%)
- [ ] `components/ui/table.tsx` (0%)
- [ ] `components/ui/tabs.tsx` (0%)
- [ ] `components/ui/toast.tsx` (0%)
- [ ] `components/ui/toaster.tsx` (0%)
- [ ] `components/ui/toggle-group.tsx` (0%)
- [ ] `components/ui/tooltip.tsx` (0%)

## Phase 5: Edge Cases and Error Handling (Low Impact)
**Target**: Increase overall coverage by ~5-10%

### 5.1 Error Scenarios
- [ ] Network failures in API routes
- [ ] Invalid data handling
- [ ] Edge cases in personalization
- [ ] Form validation errors

### 5.2 Integration Scenarios
- [ ] End-to-end user flows
- [ ] Cross-component interactions
- [ ] Data flow between components

## Implementation Priority

### Immediate (Week 1)
1. **API Routes with 0% coverage** - Highest impact on coverage
2. **Core utility functions** - Foundation for other tests

### Short-term (Week 2-3)
1. **Client components with low coverage** - User-facing functionality
2. **Page components** - Complete user journeys

### Long-term (Week 4+)
1. **UI components** - Polish and completeness
2. **Edge cases** - Robustness and reliability

## Success Metrics
- **Phase 1**: Target 60% overall coverage
- **Phase 2**: Target 70% overall coverage  
- **Phase 3**: Target 80% overall coverage
- **Phase 4**: Target 85% overall coverage
- **Phase 5**: Target 90% overall coverage

## Notes
- Focus on high-impact, low-effort tests first
- Prioritize user-facing functionality over internal utilities
- Consider integration tests over unit tests for complex components
- Use existing test patterns and mock data where possible




