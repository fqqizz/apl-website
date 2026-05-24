/**
 * Supabase Database Type Definitions
 * Generated TypeScript types for database tables
 */

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          full_name: string;
          age: number;
          position: string;
          preferred_foot: string;
          contact_number: string;
          email: string;
          instagram: string | null;
          area: string;
          photo_url: string | null;
          id_url: string | null;
          payment_status: "pending" | "completed" | "failed";
          order_id: string | null;
          player_id: string | null;
          application_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          age: number;
          position: string;
          preferred_foot: string;
          contact_number: string;
          email: string;
          instagram?: string | null;
          area: string;
          photo_url?: string | null;
          id_url?: string | null;
          payment_status?: "pending" | "completed" | "failed";
          order_id?: string | null;
          player_id?: string | null;
          application_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          age?: number;
          position?: string;
          preferred_foot?: string;
          contact_number?: string;
          email?: string;
          instagram?: string | null;
          area?: string;
          photo_url?: string | null;
          id_url?: string | null;
          payment_status?: "pending" | "completed" | "failed";
          order_id?: string | null;
          player_id?: string | null;
          application_status?: string;
          created_at?: string;
        };
      };
      franchises: {
        Row: {
          id: string;
          owner_name: string;
          contact_number: string;
          email: string;
          team_area: string;
          team_name: string | null;
          team_colors: string | null;
          squad_estimate: string | null;
          manager_name: string | null;
          instagram: string | null;
          previous_experience: string | null;
          logo_url: string | null;
          approval_status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_name: string;
          contact_number: string;
          email: string;
          team_area: string;
          team_name?: string | null;
          team_colors?: string | null;
          squad_estimate?: string | null;
          manager_name?: string | null;
          instagram?: string | null;
          previous_experience?: string | null;
          logo_url?: string | null;
          approval_status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_name?: string;
          contact_number?: string;
          email?: string;
          team_area?: string;
          team_name?: string | null;
          team_colors?: string | null;
          squad_estimate?: string | null;
          manager_name?: string | null;
          instagram?: string | null;
          previous_experience?: string | null;
          logo_url?: string | null;
          approval_status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

/**
 * Frontend type definitions (user-facing)
 */

export interface Player {
  id: string;
  fullName: string;
  age: number;
  position: string;
  preferredFoot: string;
  contactNumber: string;
  email: string;
  instagram?: string;
  area: string;
  photoUrl?: string;
  idUrl?: string;
  paymentStatus: "pending" | "completed" | "failed";
  orderId?: string;
  playerId?: string;
  applicationStatus: string;
  createdAt: string;
}

export interface Franchise {
  id: string;
  ownerName: string;
  contactNumber: string;
  email: string;
  teamArea: string;
  teamName?: string;
  teamColors?: string;
  squadEstimate?: string;
  managerName?: string;
  instagram?: string;
  previousExperience?: string;
  logoUrl?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: string;
}

/**
 * Form input types
 */

export interface PlayerFormData {
  fullName: string;
  age: string;
  position: string;
  foot: string;
  phone: string;
  email: string;
  instagram: string;
  area: string;
  photo?: File;
  idUpload?: File;
  termsAcceptance: boolean;
}

export interface FranchiseFormData {
  ownerName: string;
  phone: string;
  email: string;
  teamArea: string;
  teamName?: string;
  teamColors?: string;
  squadEstimate?: string;
  managerName?: string;
  instagram?: string;
  experience?: string;
  logo?: File;
}

/**
 * Upload response types
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Database operation response types
 */

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
