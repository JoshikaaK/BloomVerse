
/*
# BloomVerse Schema

## Summary
Creates the complete BloomVerse database schema for a digital wellness journal where memories
become a living virtual garden.

## Tables Created
1. `profiles` - User profile data (display name, avatar, streak, preferences)
2. `memories` - Core memory entries with mood, category, tags, and media
3. `memory_capsules` - Time-locked memory capsules that bloom on a future date
4. `achievements` - User achievement unlock records
5. `mood_logs` - Daily mood tracking entries

## Security
- RLS enabled on all tables
- All policies scoped to `authenticated` with `auth.uid()` ownership
- Owner columns default to `auth.uid()` so clients can omit them on insert

## Notes
- `memories.category` maps to garden element types (flower, tree, butterfly, etc.)
- `memories.garden_x` / `garden_y` store the element's position in the garden (0–100)
- `memory_capsules.reveal_at` is the date when the capsule blooms
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Gardener',
  avatar_url text,
  bio text,
  streak integer NOT NULL DEFAULT 0,
  last_entry_at timestamptz,
  theme text NOT NULL DEFAULT 'spring',
  sound_enabled boolean NOT NULL DEFAULT true,
  notifications_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Memories table
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  mood text NOT NULL DEFAULT 'happy',
  emotion text,
  category text NOT NULL DEFAULT 'happy',
  tags text[] DEFAULT '{}',
  location text,
  photo_url text,
  garden_x float NOT NULL DEFAULT 50,
  garden_y float NOT NULL DEFAULT 50,
  memory_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_memories" ON memories;
CREATE POLICY "select_own_memories" ON memories FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_memories" ON memories;
CREATE POLICY "insert_own_memories" ON memories FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_memories" ON memories;
CREATE POLICY "update_own_memories" ON memories FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_memories" ON memories;
CREATE POLICY "delete_own_memories" ON memories FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Memory capsules
CREATE TABLE IF NOT EXISTS memory_capsules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  reveal_at date NOT NULL,
  revealed boolean NOT NULL DEFAULT false,
  garden_x float NOT NULL DEFAULT 50,
  garden_y float NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE memory_capsules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_capsules" ON memory_capsules;
CREATE POLICY "select_own_capsules" ON memory_capsules FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_capsules" ON memory_capsules;
CREATE POLICY "insert_own_capsules" ON memory_capsules FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_capsules" ON memory_capsules;
CREATE POLICY "update_own_capsules" ON memory_capsules FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_capsules" ON memory_capsules;
CREATE POLICY "delete_own_capsules" ON memory_capsules FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_achievements" ON achievements;
CREATE POLICY "select_own_achievements" ON achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_achievements" ON achievements;
CREATE POLICY "insert_own_achievements" ON achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_achievements" ON achievements;
CREATE POLICY "update_own_achievements" ON achievements FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_achievements" ON achievements;
CREATE POLICY "delete_own_achievements" ON achievements FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Mood logs
CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text NOT NULL,
  note text,
  logged_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_mood_logs" ON mood_logs;
CREATE POLICY "select_own_mood_logs" ON mood_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_mood_logs" ON mood_logs;
CREATE POLICY "insert_own_mood_logs" ON mood_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_mood_logs" ON mood_logs;
CREATE POLICY "update_own_mood_logs" ON mood_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_mood_logs" ON mood_logs;
CREATE POLICY "delete_own_mood_logs" ON mood_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS memories_user_id_idx ON memories(user_id);
CREATE INDEX IF NOT EXISTS memories_memory_date_idx ON memories(memory_date DESC);
CREATE INDEX IF NOT EXISTS memories_category_idx ON memories(category);
CREATE INDEX IF NOT EXISTS mood_logs_user_date_idx ON mood_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS capsules_reveal_at_idx ON memory_capsules(reveal_at);
