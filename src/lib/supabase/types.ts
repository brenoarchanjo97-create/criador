export type UserRole = "admin" | "broker";
export type BrokerStatus = "pending" | "approved" | "rejected" | "blocked";
export type PropertyType = "venda" | "aluguel" | "lancamento";
export type PropertyStatus = "disponivel" | "reservado" | "vendido" | "alugado";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  creci: string | null;
  role: UserRole;
  status: BrokerStatus;
  avatar_url: string | null;
  bio: string | null;
  instagram: string | null;
  specialties: string[] | null;
  region: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  broker_id: string;
  type: PropertyType;
  title: string;
  description: string | null;
  price: number | null;
  condo_fee: number | null;
  iptu: number | null;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  area_m2: number | null;
  furnished: boolean;
  status: PropertyStatus;
  visible: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: string;
  property_id: string;
  storage_path: string;
  url: string;
  sort_order: number;
  is_video: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  logo_url: string | null;
  hero_fallback_image_url: string | null;
  hero_video_url: string | null;
}

