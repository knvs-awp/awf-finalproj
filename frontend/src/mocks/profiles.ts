
import type { profile_response } from '@solo101/contracts';

export const mockProfiles: profile_response[] = [
  {
    id: 'user-001',
    display_name: 'John Smith',
    bio: 'Test Bio',
    city: 'Toronto',
    region: 'Ontario',
    country_code: 'CA',
    created_at: '2026-01-15T10:00:00.000Z',
    updated_at: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'user-002',
    display_name: 'Jane Smith',
    bio: 'Test Bio',
    city: 'Toronto',
    region: 'Ontario',
    country_code: 'CA',
    created_at: '2026-01-15T10:00:00.000Z',
    updated_at: '2026-01-15T10:00:00.000Z',
  },
];
