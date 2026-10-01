import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trendText,
  trendDirection = 'neutral',
  icon: Icon,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
          {value}
        </div>
        {(subtext || trendText) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            {trendText && (
              <span
                className={`font-mono tabular-nums font-medium ${
                  trendDirection === 'up'
                    ? 'text-emerald-700'
                    : trendDirection === 'down'
                    ? 'text-amber-700'
                    : 'text-slate-600'
                }`}
              >
                {trendText}
              </span>
            )}
            {subtext && <span>{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
