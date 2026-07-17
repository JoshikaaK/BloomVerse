import { useMemo } from 'react';

export type MoodType = 'happy' | 'sad' | 'peaceful' | 'angry' | 'calm' | 'excited';

export type WeatherType = 'sunny' | 'rain' | 'sunset' | 'wind' | 'night' | 'rainbow';

export const moodToWeather: Record<MoodType, WeatherType> = {
  happy: 'sunny',
  sad: 'rain',
  peaceful: 'sunset',
  angry: 'wind',
  calm: 'night',
  excited: 'rainbow',
};

export const moodConfig: Record<MoodType, { emoji: string; label: string; color: string; weather: WeatherType }> = {
  happy: { emoji: '☀', label: 'Happy', color: 'text-amber-400', weather: 'sunny' },
  sad: { emoji: '🌧', label: 'Sad', color: 'text-blue-400', weather: 'rain' },
  peaceful: { emoji: '🌅', label: 'Peaceful', color: 'text-orange-300', weather: 'sunset' },
  angry: { emoji: '🌪', label: 'Angry', color: 'text-red-400', weather: 'wind' },
  calm: { emoji: '🌙', label: 'Calm', color: 'text-indigo-300', weather: 'night' },
  excited: { emoji: '🌈', label: 'Excited', color: 'text-pink-400', weather: 'rainbow' },
};

export type CategoryType =
  | 'happy'
  | 'achievement'
  | 'gratitude'
  | 'challenge'
  | 'dream'
  | 'friendship'
  | 'travel'
  | 'celebration'
  | 'kindness';

export const categoryConfig: Record<CategoryType, { emoji: string; label: string; gardenType: string; color: string }> = {
  happy: { emoji: '🌼', label: 'Happy Memory', gardenType: 'flower', color: 'from-yellow-300 to-amber-400' },
  achievement: { emoji: '🌳', label: 'Achievement', gardenType: 'tree', color: 'from-emerald-400 to-green-600' },
  gratitude: { emoji: '🦋', label: 'Gratitude', gardenType: 'butterfly', color: 'from-purple-400 to-pink-400' },
  challenge: { emoji: '🏔', label: 'Challenge', gardenType: 'mountain', color: 'from-slate-400 to-slate-600' },
  dream: { emoji: '⭐', label: 'Dream', gardenType: 'star', color: 'from-indigo-400 to-purple-500' },
  friendship: { emoji: '🌱', label: 'Friendship', gardenType: 'vine', color: 'from-green-300 to-emerald-500' },
  travel: { emoji: '🌴', label: 'Travel', gardenType: 'exotic', color: 'from-teal-300 to-cyan-500' },
  celebration: { emoji: '🎈', label: 'Celebration', gardenType: 'balloon', color: 'from-rose-300 to-pink-500' },
  kindness: { emoji: '💖', label: 'Kindness', gardenType: 'bird', color: 'from-pink-200 to-rose-300' },
};

export function useGardenElements(memories: Array<{ category: string; garden_x: number; garden_y: number; id: string }>) {
  return useMemo(() => {
    return memories.map((m) => ({
      id: m.id,
      type: (categoryConfig[m.category as CategoryType]?.gardenType ?? 'flower') as string,
      x: m.garden_x,
      y: m.garden_y,
      category: m.category,
    }));
  }, [memories]);
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'sunset' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'sunset';
  return 'night';
}
