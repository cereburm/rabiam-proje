/**
 * Centralized Branding & Application Constants
 * HealthMatch - Sağlık İşletmeleri İçin Yetkinlik Bazlı Akıllı Eşleştirme Platformu
 */

export const APP_CONFIG = {
  name: 'HealthMatch',
  subtitle: 'Yetkinlik Bazlı Akıllı Eşleştirme Platformu',
  academicTopic: 'Açık Proje Gereksinimleri ile Çalışan Yetkinlik Vektörlerini Optimize Eden İki Taraflı Eşleştirme Algoritması',
  category: 'Sağlık İK Karar Destek Sistemi (HR Tech CDS)',
  version: '2.4 Enterprise',
  organizationDefault: 'Acıbadem Sağlık Grubu',
  hospitalDefault: 'Maslak Hastanesi',
  currentUser: {
    name: 'Dr. Selin Demir',
    role: 'İK Direktörü & Yetenek Yönetimi Lideri',
    email: 'selin.demir@healthmatch.med',
    department: 'İnsan Kaynakları & Organizasyonel Gelişim',
  }
};

export const CATEGORY_LABELS: Record<string, { label: string; color: string; border: string; bg: string }> = {
  clinical: {
    label: 'Klinik Yetkinlik',
    color: 'text-blue-700',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  technical: {
    label: 'Teknik Yetkinlik',
    color: 'text-indigo-700',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
  },
  managerial: {
    label: 'Yönetimsel Yetkinlik',
    color: 'text-emerald-700',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
  },
  communication: {
    label: 'İletişim Yetkinliği',
    color: 'text-teal-700',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
  },
  digital: {
    label: 'Dijital Sağlık',
    color: 'text-sky-700',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
  },
  leadership: {
    label: 'Liderlik Yetkinliği',
    color: 'text-violet-700',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
  },
};

export const IMPORTANCE_LABELS: Record<string, { label: string; badge: string }> = {
  low: { label: 'Düşük', badge: 'text-slate-600 bg-slate-100' },
  medium: { label: 'Orta', badge: 'text-blue-700 bg-blue-50' },
  high: { label: 'Yüksek', badge: 'text-amber-800 bg-amber-50' },
  critical: { label: 'Kritik / Zorunlu', badge: 'text-rose-800 bg-rose-50' },
};
