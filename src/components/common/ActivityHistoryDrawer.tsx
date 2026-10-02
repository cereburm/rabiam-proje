import React from 'react';
import {
  X,
  History,
  RotateCcw,
  UserCheck,
  UserX,
  PlusCircle,
  Star,
  FileEdit,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ActivityItem } from '../../types';

interface ActivityHistoryDrawerProps {
  isOpen: boolean;
  activities: ActivityItem[];
  onClose: () => void;
  onUndo: (activityId: string) => void;
  onSelectCandidate?: (candidateId: string) => void;
  onSelectPosition?: (positionId: string) => void;
}

export const ActivityHistoryDrawer: React.FC<ActivityHistoryDrawerProps> = ({
  isOpen,
  activities,
  onClose,
  onUndo,
  onSelectCandidate,
  onSelectPosition,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">İşlem Geçmişi (Audit Trail)</h2>
              <p className="text-[11px] text-slate-500">İK kullanıcı eylemleri ve durum değişiklikleri</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of activities */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activities.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Henüz kaydedilmiş işlem geçmişi bulunmamaktadır.
            </div>
          ) : (
            activities.map((act) => {
              const Icon =
                act.type === 'interview_called'
                  ? UserCheck
                  : act.type === 'interview_cancelled'
                  ? UserX
                  : act.type === 'position_created'
                  ? PlusCircle
                  : act.type === 'favorite_added' || act.type === 'favorite_removed'
                  ? Star
                  : FileEdit;

              const iconBg =
                act.type === 'interview_called'
                  ? 'bg-blue-100 text-blue-700'
                  : act.type === 'interview_cancelled'
                  ? 'bg-rose-100 text-rose-700'
                  : act.type === 'favorite_added'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700';

              const timeFormatted = new Date(act.timestamp).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short',
              });

              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg shrink-0 ${iconBg}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-900 leading-snug">{act.title}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {timeFormatted}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px] pl-7">
                    {act.description}
                  </p>

                  <div className="pt-2 pl-7 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      İşlemi Yapan: <strong className="text-slate-700 font-medium">{act.actor}</strong>
                    </span>

                    {act.canUndo && (
                      <button
                        onClick={() => onUndo(act.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Geri Al</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
