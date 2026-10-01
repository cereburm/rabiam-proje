import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface DecisionNoticeProps {
  score?: number;
  statement?: string;
  className?: string;
}

export const DecisionNotice: React.FC<DecisionNoticeProps> = ({
  score,
  statement,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 text-xs text-blue-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-950">
              İK Karar Destek Prensibi (Clinical & HR CDS)
            </span>
            <span className="text-[10px] text-blue-600 font-mono">
              [İnsan-in-the-Loop]
            </span>
          </div>
          <p className="text-blue-800 leading-relaxed">
            {statement ||
              (score !== undefined
                ? `Bu adayın pozisyon gereksinimleriyle %${score} uyum gösterdiği hesaplanmıştır. Sistem işe alım kararı vermez; nihai değerlendirme ve mülakat kararı İK Uzmanı ve Klinik Heyete aittir.`
                : 'Uyum skoru açık pozisyon gereksinim vektörleri ile çalışan yetkinliklerinin ağırlıklı eşleşme derecesini gösterir. Nihai karar İK uzmanına aittir.')}
          </p>
        </div>
      </div>
    </div>
  );
};
