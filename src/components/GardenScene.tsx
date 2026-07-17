import { useMemo, useState } from 'react';

type GardenElement = {
  id: string;
  type: string;
  x: number;
  y: number;
  category: string;
};

type Props = {
  elements: GardenElement[];
  onElementClick?: (id: string) => void;
  interactive?: boolean;
};

function Flower({ x, y, onClick, interactive }: { x: number; y: number; onClick?: () => void; interactive?: boolean }) {
  const colors = ['#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#fb923c'];
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);
  return (
    <div
      className={`absolute ${interactive ? 'cursor-pointer hover:scale-125' : ''} transition-transform duration-300`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      <div className="animate-sway">
        <div className="w-1 h-6 bg-green-500/70 mx-auto rounded-full" />
        <div className="relative -mt-4">
          <div className="w-5 h-5 rounded-full mx-auto" style={{ background: color, boxShadow: `0 0 12px ${color}80` }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-200" />
        </div>
      </div>
    </div>
  );
}

function Tree({ x, y, onClick, interactive }: { x: number; y: number; onClick?: () => void; interactive?: boolean }) {
  return (
    <div
      className={`absolute ${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform duration-300`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
      onClick={onClick}
    >
      <div className="animate-sway">
        <div className="w-2 h-10 bg-amber-800/70 mx-auto rounded" />
        <div className="relative -mt-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 mx-auto shadow-lg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }} />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-300/60" />
        </div>
      </div>
    </div>
  );
}

function Butterfly({ x, y, onClick, interactive, id }: { x: number; y: number; onClick?: () => void; interactive?: boolean; id: string }) {
  const colors = ['#c084fc', '#f0abfc', '#fbbf24', '#60a5fa'];
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);
  return (
    <div
      className={`absolute ${interactive ? 'cursor-pointer' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      <div className="animate-flutter" style={{ animationDelay: `${parseInt(id.slice(-2), 36) % 3}s` }}>
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
          <ellipse cx="8" cy="8" rx="7" ry="6" fill={color} opacity="0.85" />
          <ellipse cx="20" cy="8" rx="7" ry="6" fill={color} opacity="0.85" />
          <ellipse cx="8" cy="15" rx="5" ry="4" fill={color} opacity="0.7" />
          <ellipse cx="20" cy="15" rx="5" ry="4" fill={color} opacity="0.7" />
          <rect x="13" y="4" width="2" height="16" rx="1" fill="#444" />
        </svg>
      </div>
    </div>
  );
}

function Mountain({ x, y, onClick, interactive }: { x: number; y: number; onClick?: () => void; interactive?: boolean }) {
  return (
    <div
      className={`absolute ${interactive ? 'cursor-pointer hover:scale-105' : ''} transition-transform duration-500`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
      onClick={onClick}
    >
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
        <path d="M40 0 L70 50 L10 50 Z" fill="url(#mountainGrad)" />
        <path d="M40 0 L52 18 L48 22 L40 10 L32 22 L28 18 Z" fill="white" opacity="0.8" />
        <defs>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Star({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
      <div className="w-3 h-3 animate-pulse" style={{
        background: 'radial-gradient(circle, #fde68a 0%, transparent 70%)',
        filter: 'drop-shadow(0 0 4px #fde68a)',
      }} />
    </div>
  );
}

function Vine({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
      <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
        <path d="M20 50 Q15 35 20 25 Q25 15 20 0" stroke="#22c55e" strokeWidth="2" fill="none" />
        <circle cx="15" cy="38" r="4" fill="#16a34a" />
        <circle cx="25" cy="28" r="4" fill="#16a34a" />
        <circle cx="17" cy="18" r="3" fill="#16a34a" />
      </svg>
    </div>
  );
}

function ExoticPlant({ x, y, onClick, interactive }: { x: number; y: number; onClick?: () => void; interactive?: boolean }) {
  return (
    <div
      className={`absolute ${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform duration-300`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
      onClick={onClick}
    >
      <div className="animate-sway">
        <svg width="30" height="45" viewBox="0 0 30 45" fill="none">
          <path d="M15 45 L13 20 Q10 10 15 5" stroke="#0d9488" strokeWidth="3" fill="none" />
          <path d="M15 45 L17 25 Q20 15 15 8" stroke="#0d9488" strokeWidth="3" fill="none" />
          <ellipse cx="15" cy="5" rx="8" ry="6" fill="#14b8a6" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

function Balloon({ x, y, id }: { x: number; y: number; id: string }) {
  const colors = ['#f87171', '#fbbf24', '#a78bfa', '#34d399', '#60a5fa'];
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);
  return (
    <div
      className="absolute animate-float-up"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        animationDuration: '8s',
        animationDelay: `${parseInt(id.slice(-2), 36) % 4}s`,
        animationIterationCount: 'infinite',
      }}
    >
      <div className="w-8 h-10 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}60` }} />
      <div className="w-px h-8 bg-gray-400/50 mx-auto" />
    </div>
  );
}

function Bird({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <div
      className="absolute animate-drift"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: '15s',
        animationDelay: `${parseInt(id.slice(-2), 36) % 5}s`,
      }}
    >
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
        <path d="M2 8 Q6 2 10 8 Q14 2 18 8 Q20 6 22 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function GardenScene({ elements, onElementClick, interactive = true }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (id: string) => {
    if (!interactive) return;
    setSelectedId(id);
    onElementClick?.(id);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-700/40 via-green-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-800/30 to-transparent" />

      {/* Water pond */}
      <div className="absolute bottom-8 left-[15%] w-32 h-12 rounded-full bg-gradient-to-b from-sky-300/40 to-blue-400/30 blur-sm">
        <div className="absolute inset-0 rounded-full animate-ripple" style={{ animationDelay: '0s' }} />
        <div className="absolute inset-0 rounded-full animate-ripple" style={{ animationDelay: '1s' }} />
      </div>

      {/* Elements */}
      {elements.map((el) => {
        const isSelected = selectedId === el.id;
        const ring = isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent rounded-full' : '';

        switch (el.type) {
          case 'flower':
            return (
              <div key={el.id} className={ring}>
                <Flower x={el.x} y={el.y} interactive={interactive} onClick={() => handleClick(el.id)} />
              </div>
            );
          case 'tree':
            return (
              <div key={el.id} className={ring}>
                <Tree x={el.x} y={el.y} interactive={interactive} onClick={() => handleClick(el.id)} />
              </div>
            );
          case 'butterfly':
            return (
              <div key={el.id} className={ring}>
                <Butterfly x={el.x} y={el.y} id={el.id} interactive={interactive} onClick={() => handleClick(el.id)} />
              </div>
            );
          case 'mountain':
            return (
              <div key={el.id} className={ring}>
                <Mountain x={el.x} y={el.y} interactive={interactive} onClick={() => handleClick(el.id)} />
              </div>
            );
          case 'star':
            return <Star key={el.id} x={el.x} y={el.y} />;
          case 'vine':
            return <Vine key={el.id} x={el.x} y={el.y} />;
          case 'exotic':
            return (
              <div key={el.id} className={ring}>
                <ExoticPlant x={el.x} y={el.y} interactive={interactive} onClick={() => handleClick(el.id)} />
              </div>
            );
          case 'balloon':
            return <Balloon key={el.id} x={el.x} y={el.y} id={el.id} />;
          case 'bird':
            return <Bird key={el.id} x={el.x} y={el.y} id={el.id} />;
          default:
            return null;
        }
      })}

      {/* Floating clouds */}
      <div className="absolute top-[8%] left-[5%] w-24 h-10 rounded-full bg-white/30 blur-md animate-drift" style={{ animationDuration: '40s' }} />
      <div className="absolute top-[15%] left-[60%] w-32 h-12 rounded-full bg-white/25 blur-md animate-drift" style={{ animationDuration: '50s', animationDelay: '5s' }} />

      {/* Empty state */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center glass rounded-3xl p-8 max-w-sm">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-gray-600 font-medium">Your garden is waiting to bloom</p>
            <p className="text-gray-400 text-sm mt-1">Add your first memory to plant a seed</p>
          </div>
        </div>
      )}
    </div>
  );
}
