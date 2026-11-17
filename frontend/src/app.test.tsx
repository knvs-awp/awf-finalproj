import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './app';

describe('app', () => {
  it('renders the main landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the solo101 heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'solo101' }),
    ).toBeInTheDocument();
  });

  it('shows the setup ready message', () => {
    render(<App />);
    expect(screen.getByText('frontend setup is ready')).toBeInTheDocument();
  });

  it('renders the heading and message inside main', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByRole('heading', { level: 1 }));
    expect(main).toContainElement(screen.getByText('frontend setup is ready'));
  });
});