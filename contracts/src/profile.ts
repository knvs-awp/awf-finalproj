// editable profile fields, with null location values representing cleared fields
export interface profile_update {
  display_name: string;
  bio: string;
  city: string | null;
  region: string | null;
  country_code: string | null;
}

// json carries timestamps as iso 8601 strings, while database records use date objects
export interface profile_response extends profile_update {
  id: string;
  created_at: string;
  updated_at: string;
}
