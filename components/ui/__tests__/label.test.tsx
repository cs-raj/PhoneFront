import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Label } from '../label'

describe('Label', () => {
  it('should render with default props', () => {
    render(<Label>Label text</Label>)
    
    const label = screen.getByText('Label text')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
  })

  it('should accept custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>)
    
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label')
  })

  it('should render as different HTML elements', () => {
    const { rerender } = render(<Label asChild><span>Span Label</span></Label>)
    expect(screen.getByText('Span Label')).toBeInTheDocument()

    rerender(<Label asChild><div>Div Label</div></Label>)
    expect(screen.getByText('Div Label')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    render(<Label onClick={handleClick}>Clickable Label</Label>)
    
    const label = screen.getByText('Clickable Label')
    await userEvent.click(label)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be associated with form controls', () => {
    render(
      <div>
        <Label htmlFor="input-id">Input Label</Label>
        <input id="input-id" type="text" />
      </div>
    )
    
    const label = screen.getByText('Input Label')
    const input = screen.getByRole('textbox')
    
    expect(label).toHaveAttribute('for', 'input-id')
    expect(input).toHaveAttribute('id', 'input-id')
  })

  it('should handle focus events on associated inputs', async () => {
    render(
      <div>
        <Label htmlFor="focus-input">Focus Label</Label>
        <input id="focus-input" type="text" />
      </div>
    )
    
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    
    expect(input).toHaveFocus()
  })

  it('should handle disabled state styling', () => {
    render(
      <div>
        <Label htmlFor="disabled-input">Disabled Label</Label>
        <input id="disabled-input" type="text" disabled />
      </div>
    )
    
    const label = screen.getByText('Disabled Label')
    const input = screen.getByRole('textbox')
    
    expect(input).toBeDisabled()
    // The label should have disabled styling when associated input is disabled
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed')
  })

  it('should handle multiple labels', () => {
    render(
      <div>
        <Label htmlFor="input1">Label 1</Label>
        <input id="input1" type="text" />
        <Label htmlFor="input2">Label 2</Label>
        <input id="input2" type="text" />
      </div>
    )
    
    expect(screen.getByText('Label 1')).toBeInTheDocument()
    expect(screen.getByText('Label 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Label 1')).toHaveAttribute('id', 'input1')
    expect(screen.getByLabelText('Label 2')).toHaveAttribute('id', 'input2')
  })

  it('should handle nested content', () => {
    render(
      <Label>
        <span>Nested</span>
        <strong>Content</strong>
      </Label>
    )
    
    expect(screen.getByText('Nested')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should handle long text content', () => {
    const longText = 'This is a very long label text that should be displayed correctly and handle wrapping properly'
    render(<Label>{longText}</Label>)
    
    const label = screen.getByText(longText)
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent(longText)
  })

  it('should handle special characters', () => {
    render(
      <div>
        <Label>Label with @ symbols</Label>
        <Label>Label with # hashtags</Label>
        <Label>Label with $ currency</Label>
        <Label>Label with % percentage</Label>
      </div>
    )
    
    expect(screen.getByText('Label with @ symbols')).toBeInTheDocument()
    expect(screen.getByText('Label with # hashtags')).toBeInTheDocument()
    expect(screen.getByText('Label with $ currency')).toBeInTheDocument()
    expect(screen.getByText('Label with % percentage')).toBeInTheDocument()
  })

  it('should handle empty content', () => {
    render(<Label></Label>)
    
    const label = screen.getByRole('generic')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('')
  })

  it('should handle numeric content', () => {
    render(
      <div>
        <Label>0</Label>
        <Label>42</Label>
        <Label>999</Label>
      </div>
    )
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('999')).toBeInTheDocument()
  })

  it('should handle boolean content', () => {
    render(
      <div>
        <Label data-testid="true-label">{true}</Label>
        <Label data-testid="false-label">{false}</Label>
      </div>
    )
    
    expect(screen.getByTestId('true-label')).toBeInTheDocument()
    expect(screen.getByTestId('false-label')).toBeInTheDocument()
  })

  it('should handle null and undefined content', () => {
    render(
      <div>
        <Label>{null}</Label>
        <Label>{undefined}</Label>
      </div>
    )
    
    const labels = screen.getAllByRole('generic')
    expect(labels).toHaveLength(2)
  })

  it('should maintain consistent styling', () => {
    render(
      <div>
        <Label>Label 1</Label>
        <Label>Label 2</Label>
        <Label>Label 3</Label>
      </div>
    )
    
    const labels = screen.getAllByText(/Label \d/)
    labels.forEach(label => {
      expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
    })
  })

  it('should handle keyboard navigation', async () => {
    render(
      <div>
        <Label htmlFor="keyboard-input">Keyboard Label</Label>
        <input id="keyboard-input" type="text" />
      </div>
    )
    
    const input = screen.getByRole('textbox')
    await userEvent.tab()
    
    expect(input).toHaveFocus()
  })

  it('should handle form validation', () => {
    render(
      <div>
        <Label htmlFor="required-input">Required Field</Label>
        <input id="required-input" type="text" required />
      </div>
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('required')
  })

  it('should handle accessibility attributes', () => {
    render(
      <Label htmlFor="accessible-input" aria-describedby="help-text">
        Accessible Label
      </Label>
    )
    
    const label = screen.getByText('Accessible Label')
    expect(label).toHaveAttribute('for', 'accessible-input')
    expect(label).toHaveAttribute('aria-describedby', 'help-text')
  })
})
