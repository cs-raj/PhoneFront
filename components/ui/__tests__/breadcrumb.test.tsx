import { render, screen } from '@testing-library/react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../breadcrumb'

describe('Breadcrumb', () => {
  it('should render without crashing', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
  })
})
