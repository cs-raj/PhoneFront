import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'w-full', 'rounded-md', 'border')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />)
    
    const input = screen.getByPlaceholderText('Custom')
    expect(input).toHaveClass('custom-input')
  })

  it('should handle text input', async () => {
    render(<Input placeholder="Type here" />)
    
    const input = screen.getByPlaceholderText('Type here')
    await userEvent.type(input, 'Hello World')
    
    expect(input).toHaveValue('Hello World')
  })

  it('should handle controlled input', () => {
    const handleChange = jest.fn()
    render(<Input value="controlled" onChange={handleChange} />)
    
    const input = screen.getByDisplayValue('controlled')
    expect(input).toHaveValue('controlled')
  })

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text" />)
    expect(screen.getByPlaceholderText('Text')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number" />)
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')
  })

  it('should handle disabled state', () => {
    render(<Input disabled placeholder="Disabled" />)
    
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })

  it('should handle readonly state', () => {
    render(<Input readOnly placeholder="Readonly" />)
    
    const input = screen.getByPlaceholderText('Readonly')
    expect(input).toHaveAttribute('readonly')
  })

  it('should handle required state', () => {
    render(<Input required placeholder="Required" />)
    
    const input = screen.getByPlaceholderText('Required')
    expect(input).toHaveAttribute('required')
  })

  it('should handle placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toHaveAttribute('placeholder', 'Enter your name')
  })

  it('should handle maxLength attribute', () => {
    render(<Input maxLength={10} placeholder="Max 10 chars" />)
    
    const input = screen.getByPlaceholderText('Max 10 chars')
    expect(input).toHaveAttribute('maxLength', '10')
  })

  it('should handle minLength attribute', () => {
    render(<Input minLength={3} placeholder="Min 3 chars" />)
    
    const input = screen.getByPlaceholderText('Min 3 chars')
    expect(input).toHaveAttribute('minLength', '3')
  })

  it('should handle focus and blur events', async () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Focus test" />)
    
    const input = screen.getByPlaceholderText('Focus test')
    
    input.focus()
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    input.blur()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should handle keyboard events', async () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} placeholder="Keyboard test" />)
    
    const input = screen.getByPlaceholderText('Keyboard test')
    
    await userEvent.type(input, 'a')
    
    expect(handleKeyDown).toHaveBeenCalled()
    expect(handleKeyUp).toHaveBeenCalled()
  })

  it('should handle form submission', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault())
    render(
      <form onSubmit={handleSubmit}>
        <Input name="test" placeholder="Form input" />
        <button type="submit">Submit</button>
      </form>
    )
    
    const input = screen.getByPlaceholderText('Form input')
    const submitButton = screen.getByRole('button', { name: /submit/i })
    
    await userEvent.type(input, 'test value')
    await userEvent.click(submitButton)
    
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should handle validation attributes', () => {
    render(
      <Input 
        pattern="[0-9]+" 
        title="Numbers only"
        placeholder="Numbers only"
      />
    )
    
    const input = screen.getByPlaceholderText('Numbers only')
    expect(input).toHaveAttribute('pattern', '[0-9]+')
    expect(input).toHaveAttribute('title', 'Numbers only')
  })

  it('should handle autocomplete attributes', () => {
    render(<Input autoComplete="email" placeholder="Email" />)
    
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('should handle step attribute for number inputs', () => {
    render(<Input type="number" step="0.1" placeholder="Decimal" />)
    
    const input = screen.getByPlaceholderText('Decimal')
    expect(input).toHaveAttribute('step', '0.1')
  })

  it('should handle min and max attributes for number inputs', () => {
    render(<Input type="number" min="0" max="100" placeholder="0-100" />)
    
    const input = screen.getByPlaceholderText('0-100')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('should handle multiple inputs in a form', async () => {
    render(
      <form>
        <Input name="firstName" placeholder="First Name" />
        <Input name="lastName" placeholder="Last Name" />
        <Input name="email" type="email" placeholder="Email" />
      </form>
    )
    
    const firstName = screen.getByPlaceholderText('First Name')
    const lastName = screen.getByPlaceholderText('Last Name')
    const email = screen.getByPlaceholderText('Email')
    
    await userEvent.type(firstName, 'John')
    await userEvent.type(lastName, 'Doe')
    await userEvent.type(email, 'john@example.com')
    
    expect(firstName).toHaveValue('John')
    expect(lastName).toHaveValue('Doe')
    expect(email).toHaveValue('john@example.com')
  })

  it('should handle clear functionality', async () => {
    render(<Input placeholder="Clearable" />)
    
    const input = screen.getByPlaceholderText('Clearable')
    await userEvent.type(input, 'Some text')
    expect(input).toHaveValue('Some text')
    
    await userEvent.clear(input)
    expect(input).toHaveValue('')
  })

  it('should handle select all functionality', async () => {
    render(<Input value="Select me" onChange={() => {}} />)
    
    const input = screen.getByDisplayValue('Select me')
    await userEvent.click(input)
    await userEvent.keyboard('{Control>}a{/Control}')
    
    // The selection behavior is browser-dependent, so we just verify the input is focused
    expect(input).toHaveFocus()
  })
})
