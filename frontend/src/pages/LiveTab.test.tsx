import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import LiveTab from './LiveTab'

describe('LiveTab', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders ready for live monitoring with start button enabled', () => {
    render(<LiveTab />)
    expect(screen.getByText(/Ready for Live Monitoring/i)).toBeTruthy()
    const button = screen.getByRole('button', { name: /Start Monitoring/i })
    expect(button).toHaveProperty('disabled', false)
  })
})
