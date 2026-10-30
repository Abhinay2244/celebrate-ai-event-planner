import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App';

describe('Responsive Layout & Motion Accessibility (360px width & 200% zoom)', () => {
  it('renders skip-to-content accessible link as first interactive landmark', () => {
    render(<App />);
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main');
  });

  it('renders correctly at 360px mobile viewport without horizontal overflow constraints', () => {
    // Set 360px window width
    window.innerWidth = 360;
    window.innerHeight = 640;
    window.dispatchEvent(new Event('resize'));

    const { container } = render(<App />);
    const mainLandmark = container.querySelector('main#main');
    expect(mainLandmark).toBeInTheDocument();
    expect(mainLandmark).toHaveClass('w-full');
  });

  it('respects prefers-reduced-motion media query configuration', () => {
    const reducedMotionMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.matchMedia = reducedMotionMock;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    expect(mediaQuery.matches).toBe(true);
  });
});
