import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Memory = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  mood: string;
  emotion: string | null;
  category: string;
  tags: string[];
  location: string | null;
  photo_url: string | null;
  garden_x: number;
  garden_y: number;
  memory_date: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  streak: number;
  last_entry_at: string | null;
  theme: string;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type MemoryCapsule = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  reveal_at: string;
  revealed: boolean;
  garden_x: number;
  garden_y: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_key: string;
  unlocked_at: string;
};
