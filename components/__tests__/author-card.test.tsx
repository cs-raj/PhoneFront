import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthorCard from '../author-card'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  )
}))

describe('AuthorCard', () => {
  const mockAuthorWithAvatar = {
    name: 'John Doe',
    title: 'Senior Tech Reviewer',
    bio: 'Expert in smartphone technology',
    email: 'john@phonefront.com',
    avatar: {
      url: '/author-avatar.jpg',
      title: 'John Doe Avatar'
    }
  }

  const mockAuthorWithoutAvatar = {
    name: 'Jane Smith',
    title: 'Tech Writer',
    email: 'jane@phonefront.com'
  }

  it('should render without crashing', () => {
    render(<AuthorCard author={mockAuthorWithAvatar} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should display author information correctly', () => {
    render(<AuthorCard author={mockAuthorWithAvatar} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Senior Tech Reviewer')).toBeInTheDocument()
    expect(screen.getByText('john@phonefront.com')).toBeInTheDocument()
  })

  it('should handle author without avatar', () => {
    render(<AuthorCard author={mockAuthorWithoutAvatar} />)
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Tech Writer')).toBeInTheDocument()
  })
})
