import { useMemo } from 'react';

type WeatherType = 'sunny' | 'rain' | 'sunset' | 'wind' | 'night' | 'rainbow';

type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';

type Props = {
  weather?: WeatherType;
  timeOfDay?: TimeOfDay;
  showFireflies?: boolean;
  showParticles?: boolean;
};

const weatherGradients: Record<WeatherType, string> = {
  sunny: 'from-sky-200 via-emerald-100 to-amber-100',
  rain: 'from-slate-400 via-slate-300 to-blue-200',
  sunset: 'from-orange-300 via-pink-200 to-purple-300',
  wind: 'from-gray-300 via-emerald-100 to-teal-200',
  night: 'from-indigo-900 via-purple-900 to-slate-900',
  rainbow: 'from-sky-200 via-pink-100 to-emerald-200',
};

const timeGradients: Record<TimeOfDay, string> = {
  morning: 'from-amber-100 via-sky-100 to-emerald-100',
  afternoon: 'from-sky-200 via-emerald-100 to-amber-50',
  sunset: 'from-orange-300 via-rose-200 to-purple-300',
  night: 'from-indigo-950 via-purple-900 to-slate-900',
};

export default function AmbientBackground({
  weather = 'sunny',
  timeOfDay,
  showFireflies = false,
  showParticles = true,
}: Props) {
  const gradient = timeOfDay ? timeGradients[timeOfDay] : weatherGradients[weather];
  const isNight = timeOfDay === 'night' || weather === 'night';

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 4 + Math.random() * 8,
      })),
    []
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className={`fixed inset-0 -z-10 bg-gradient-to-b ${gradient} transition-all duration-[3000ms]`}>
      {/* Sun / Moon */}
      <div
        className={`absolute rounded-full blur-2xl transition-all duration-[3000ms] ${
          isNight
            ? 'w-32 h-32 bg-amber-50/40 top-10 right-16'
            : 'w-48 h-48 bg-amber-200/50 top-8 right-20'
        }`}
      />

      {/* Stars at night */}
      {isNight && (
        <>
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 60 + '%',
                opacity: Math.random() * 0.8 + 0.2,
                animation: `firefly ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: Math.random() * 3 + 's',
              }}
            />
          ))}
        </>
      )}

      {/* Fireflies */}
      {showFireflies && isNight &&
        fireflies.map((f) => (
          <div
            key={`ff-${f.id}`}
            className="absolute rounded-full bg-amber-300 animate-firefly"
            style={{
              width: '6px',
              height: '6px',
              left: f.left + '%',
              top: f.top + '%',
              boxShadow: '0 0 10px rgba(252, 211, 77, 0.8)',
              animationDelay: f.delay + 's',
              animationDuration: f.duration + 's',
            }}
          />
        ))}

      {/* Floating particles */}
      {showParticles &&
        particles.map((p) => (
          <div
            key={`p-${p.id}`}
            className="absolute rounded-full bg-white/40 animate-float-up"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.left + '%',
              bottom: '-20px',
              animationDelay: p.delay + 's',
              animationDuration: p.duration + 's',
            }}
          />
        ))}

      {/* Rain effect */}
      {weather === 'rain' && (
        <>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute w-0.5 h-8 bg-blue-200/50"
              style={{
                left: Math.random() * 100 + '%',
                top: '-40px',
                animation: `float-up ${0.5 + Math.random() * 0.5}s linear infinite`,
                animationDelay: Math.random() * 2 + 's',
                transform: 'rotate(180deg)',
              }}
            />
          ))}
        </>
      )}

      {/* Rainbow */}
      {weather === 'rainbow' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30">
          <div className="w-full h-full rounded-t-full border-[12px] border-rainbow" style={{
            borderColor: 'transparent',
            borderTopColor: '#f87171',
            borderLeftColor: '#f87171',
            borderRightColor: '#fbbf24',
          }} />
        </div>
      )}

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
}
