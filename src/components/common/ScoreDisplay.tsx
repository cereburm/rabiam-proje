import React from 'react';

interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  size = 'md',
  showLabel = false,
}) => {
  // Score color grading
  let color = 'text-blue-700 bg-blue-50 border-blue-200';
  let strokeColor = '#2563eb';
  let label = 'İnceleme Önerilir';

  if (score >= 85) {
    color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    strokeColor = '#059669';
    label = 'Güçlü Eşleşme';
  } else if (score >= 75) {
    color = 'text-blue-700 bg-blue-50 border-blue-200';
    strokeColor = '#2563eb';
    label = 'Yüksek Uyum';
  } else if (score >= 60) {
    color = 'text-amber-700 bg-amber-50 border-amber-200';
    strokeColor = '#d97706';
    label = 'Gelişim Alanı Var';
  } else {
    color = 'text-rose-700 bg-rose-50 border-rose-200';
    strokeColor = '#e11d48';
    label = 'Düşük Uyum';
  }

  if (size === 'lg') {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 -rotate-90 transform">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={strokeColor}
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
              %{score}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Uyum</span>
          </div>
        </div>

        {showLabel && (
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Hesaplanan Uyum</span>
            <span className="text-sm font-semibold text-slate-900">{label}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              İki taraflı ağırlıklandırılmış optimizasyon
            </span>
          </div>
        )}
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1.5 font-mono tabular-nums">
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold border ${color}`}
        >
          %{score}
        </span>
      </div>
    );
  }

  // Medium (Default)
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: strokeColor }}
        />
      </div>
      <span className="text-xs font-semibold font-mono tabular-nums text-slate-800">
        %{score}
      </span>
    </div>
  );
};
