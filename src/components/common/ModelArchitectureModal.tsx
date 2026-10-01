import React from 'react';
import { X, ShieldCheck, Cpu, Database, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../../constants/branding';

interface ModelArchitectureModalProps {
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Akademik Proje & Algoritma Mimarisi
              </h2>
              <p className="text-[11px] text-slate-500">
                {APP_CONFIG.academicTopic}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Problem & Değer Önerisi */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>1. Problem Tanımı ve Değer Önerisi</span>
            </h3>
            <p>
              Sağlık işletmelerinde yoğun bakım, acil servis ve ameliyathane gibi kritik birimlerde yapılan işe alımlarda klasik anahtar kelime eşleşmesi veya sübjektif CV taramaları yetersiz kalmaktadır. 
              <strong> HealthMatch</strong>, “Pozisyon neye ihtiyaç duyuyor?” ile “Çalışan ne sunuyor?” sorularını iki taraflı vektörel uzayda modelleyerek ölçülebilir ve şeffaf bir İK karar destek mekanizması sunar.
            </p>
          </div>

          {/* Section 2: Matematiksel Formülasyon */}
          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-3 font-mono">
            <div className="text-blue-400 font-bold text-xs uppercase tracking-wider">
              2. İki Taraflı Vektörel Optimizasyon Formülasyonu
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <p>• Pozisyon Beklenti Vektörü: R = [(c₁, r₁, w₁), (c₂, r₂, w₂), ..., (cₙ, rₙ, wₙ)] where Σwᵢ = 100</p>
              <p>• Çalışan Yetkinlik Vektörü: C = [c₁, c₂, ..., cₙ] where cᵢ ∈ [1, 5]</p>
              <p>• Bireysel Yetkinlik Uyumu: μᵢ = min(1.0, cᵢ / rᵢ)</p>
              <p>• Ağırlıklı Yetkinlik Skoru: S_yetkinlik = Σ(wᵢ × μᵢ)</p>
              <p>• Genel Uyum Skoru = (0.75 × S_yetkinlik) + (0.15 × S_deneyim) + (0.10 × S_kritik_önkoşul)</p>
            </div>
          </div>

          {/* Section 3: Açık Analizi & Karar Desteği */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. "Skor Karar Değildir" İlkesi (Human-in-the-Loop)</span>
            </h3>
            <p>
              Sistem hiçbir zaman <em>“Bu aday işe alınmalıdır”</em> şeklinde otonom bir nihai karar üretmez. Bunun yerine İK uzmanı ve klinik komiteye:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
              <li>Hesaplanan uyum derecesi ve alt kırılımlar (Yetkinlik, Deneyim, Temel Şartlar)</li>
              <li>İki taraflı seviye fark matrisi (Karşılayan, Aşan, Açık Olan)</li>
              <li>Eksik yetkinlikler için kişiselleştirilmiş hizmet içi eğitim / mentörlük önerileri</li>
            </ul>
            <p className="pt-1">
              sunarak İK karar kalitesini ve klinik hasta güvenliğini en üst düzeye çıkarır.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
