import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { Competency, ImportanceLevel, PositionRequirement } from '../../types';
import { positionService, CreatePositionDto } from '../../services/positionService';

interface NewPositionModalProps {
  competencies: Competency[];
  onClose: () => void;
  onPositionCreated: (newPositionId: string) => void;
}

export const NewPositionModal: React.FC<NewPositionModalProps> = ({
  competencies,
  onClose,
  onPositionCreated,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Genel Yoğun Bakım Ünitesi');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState<'Vardiyalı' | 'Tam Zamanlı' | 'Yarı Zamanlı' | 'Proje Bazlı'>('Vardiyalı');
  const [experienceYearsRequired, setExperienceYearsRequired] = useState(3);

  // Dynamic requirements list
  const [requirements, setRequirements] = useState<PositionRequirement[]>([
    {
      competencyId: 'comp_yogun_bakim',
      competencyName: 'Yoğun Bakım Deneyimi',
      requiredLevel: 4,
      weight: 35,
      importance: 'critical',
      isMandatory: true,
    },
    {
      competencyId: 'comp_acil_mudahale',
      competencyName: 'Acil Müdahale & Resüsitasyon',
      requiredLevel: 5,
      weight: 35,
      importance: 'critical',
      isMandatory: true,
    },
    {
      competencyId: 'comp_ekg',
      competencyName: 'EKG Bilgisi & Ritim Yorumlama',
      requiredLevel: 3,
      weight: 30,
      importance: 'high',
      isMandatory: false,
    },
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalWeight = requirements.reduce((acc, curr) => acc + (Number(curr.weight) || 0), 0);

  const handleAddRequirement = () => {
    const available = competencies.find(
      (c) => !requirements.some((r) => r.competencyId === c.id)
    );
    if (!available) return;

    setRequirements([
      ...requirements,
      {
        competencyId: available.id,
        competencyName: available.name,
        requiredLevel: 3,
        weight: 10,
        importance: 'medium',
        isMandatory: false,
      },
    ]);
  };

  const handleRemoveRequirement = (index: number) => {
    if (requirements.length <= 1) return;
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleReqChange = (index: number, field: keyof PositionRequirement, value: any) => {
    const updated = [...requirements];
    if (field === 'competencyId') {
      const comp = competencies.find((c) => c.id === value);
      updated[index] = {
        ...updated[index],
        competencyId: value,
        competencyName: comp ? comp.name : value,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setRequirements(updated);
  };

  // Helper to re-normalize weights to 100%
  const handleNormalizeWeights = () => {
    if (requirements.length === 0) return;
    const equalShare = Math.floor(100 / requirements.length);
    const remainder = 100 - equalShare * requirements.length;

    const normalized = requirements.map((req, idx) => ({
      ...req,
      weight: idx === 0 ? equalShare + remainder : equalShare,
    }));
    setRequirements(normalized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Lütfen pozisyon adını girin.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Lütfen pozisyon açıklamasını belirtin.');
      return;
    }
    if (totalWeight !== 100) {
      setErrorMsg(`Yetkinlik ağırlıkları toplamı %100 olmalıdır. (Şu an: %${totalWeight})`);
      return;
    }

    const payload: CreatePositionDto = {
      title,
      department,
      description,
      workType,
      experienceYearsRequired,
      requirements,
    };

    const newPos = await positionService.createPosition(payload);
    onPositionCreated(newPos.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Yeni Pozisyon & Gereksinim Vektörü Oluştur
              </h2>
              <p className="text-[11px] text-slate-500">
                Sağlık birimi için açık kadro ve iki taraflı eşleştirme kriterlerini tanımlayın
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Pozisyon Adı *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Kardiyoloji Yoğun Bakım Hemşiresi"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Departman / Klinik *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Genel Yoğun Bakım Ünitesi">Genel Yoğun Bakım Ünitesi</option>
                <option value="Acil Tıp Kliniği">Acil Tıp Kliniği</option>
                <option value="Kalp ve Damar Cerrahisi">Kalp ve Damar Cerrahisi</option>
                <option value="Ameliyathane Hizmetleri">Ameliyathane Hizmetleri</option>
                <option value="Hasta Hizmetleri">Hasta Hizmetleri</option>
                <option value="Biyomedikal ve Klinik Mühendislik">Biyomedikal ve Klinik Mühendislik</option>
                <option value="Hemşirelik Hizmetleri Direktörlüğü">Hemşirelik Hizmetleri Direktörlüğü</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Çalışma Tipi</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Vardiyalı">Vardiyalı</option>
                <option value="Tam Zamanlı">Tam Zamanlı</option>
                <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                <option value="Proje Bazlı">Proje Bazlı</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Minimum Deneyim Yılı
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={experienceYearsRequired}
                onChange={(e) => setExperienceYearsRequired(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Pozisyon Açıklaması *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pozisyonun klinik kapsamını ve beklentilerini özetleyin..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white resize-none"
            />
          </div>

          {/* Requirements Vector Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Yetkinlik Gereksinim Vektörü (R)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Her yetkinliğin ağırlık (%) ve beklenen minimum seviyesini (1-5) belirleyin
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    totalWeight === 100
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-amber-800 bg-amber-50 border border-amber-200'
                  }`}
                >
                  Toplam: %{totalWeight} {totalWeight === 100 ? '✓' : '(Hedef: %100)'}
                </span>

                <button
                  type="button"
                  onClick={handleNormalizeWeights}
                  className="text-[11px] text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Otomatik Eşitle (%100)
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2.5 items-center text-xs"
                >
                  {/* Competency Dropdown */}
                  <div className="col-span-5">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Yetkinlik</label>
                    <select
                      value={req.competencyId}
                      onChange={(e) => handleReqChange(idx, 'competencyId', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-slate-800 text-xs font-medium"
                    >
                      {competencies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight % */}
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Ağırlık (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={req.weight}
                      onChange={(e) => handleReqChange(idx, 'weight', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono tabular-nums text-xs text-blue-700 font-bold"
                    />
                  </div>

                  {/* Required Level */}
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Min. Seviye</label>
                    <select
                      value={req.requiredLevel}
                      onChange={(e) => handleReqChange(idx, 'requiredLevel', Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                    >
                      <option value="1">1 / 5 (Başlangıç)</option>
                      <option value="2">2 / 5 (Temel)</option>
                      <option value="3">3 / 5 (Orta / Bağımsız)</option>
                      <option value="4">4 / 5 (İleri / Kıdemli)</option>
                      <option value="5">5 / 5 (Uzman / Eğitmen)</option>
                    </select>
                  </div>

                  {/* Importance */}
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Önem</label>
                    <select
                      value={req.importance}
                      onChange={(e) => handleReqChange(idx, 'importance', e.target.value as ImportanceLevel)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    >
                      <option value="critical">Kritik</option>
                      <option value="high">Yüksek</option>
                      <option value="medium">Orta</option>
                      <option value="low">Düşük</option>
                    </select>
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 flex justify-end pt-3">
                    <button
                      type="button"
                      disabled={requirements.length <= 1}
                      onClick={() => handleRemoveRequirement(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRequirement}
              className="w-full py-2 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Yetkinlik Kriteri Ekle</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Pozisyonu Kaydet ve Eşleştir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
