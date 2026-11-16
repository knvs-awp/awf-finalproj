
import type {
  profile_response,
  profile_update,
} from '@solo101/contracts';

import { mockProfiles } from '../../mocks/profiles';

// Keep a separate working copy so the original mock data remains unchanged.
let profiles: profile_response[] = [...mockProfiles];

// Retrieve all profiles.
export async function getProfiles(): Promise<profile_response[]> {
  return [...profiles];
}

// Retrieve a specific profile by ID.
export async function getProfileById(
  id: string,
): Promise<profile_response | null> {
  return profiles.find((profile) => profile.id === id) ?? null;
}

// Update an existing profile.
export async function updateProfile(
  id: string,
  updates: profile_update,
): Promise<profile_response | null> {
  const index = profiles.findIndex((profile) => profile.id === id);

  if (index === -1) {
    return null;
  }

  const updatedProfile: profile_response = {
    ...profiles[index]!,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  profiles[index] = updatedProfile;

  return updatedProfile;
}

// Reset mock profiles to their original values.
export async function resetProfiles(): Promise<void> {
  profiles = [...mockProfiles];
}
