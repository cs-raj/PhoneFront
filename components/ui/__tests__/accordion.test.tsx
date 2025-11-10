import { render, screen } from '@testing-library/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion'

describe('Accordion', () => {
  it('should render without crashing', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    expect(screen.getByText('Is it accessible?')).toBeInTheDocument()
    // Content is hidden by default in accordion, so we just check it exists in DOM
    expect(document.querySelector('[data-slot="accordion-content"]')).toBeInTheDocument()
  })
})
