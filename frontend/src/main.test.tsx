import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('main', () => {
  beforeEach(() => {
    // main.tsx runs on import, so each test needs a fresh module and a clean dom
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('mounts the app into the #root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./main');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'solo101' }),
    ).toBeInTheDocument();
    expect(document.getElementById('root')).toContainElement(
      screen.getByText('frontend setup is ready'),
    );
  });

  it('throws a clear error when #root is missing', async () => {
    await expect(import('./main')).rejects.toThrow('root element not found');
  });
});
