import { Competency } from '../types';

export const MOCK_COMPETENCIES: Competency[] = [
  {
    id: 'comp_yogun_bakim',
    name: 'Yoğun Bakım Deneyimi',
    category: 'clinical',
    description: 'Kritik durumdaki hastaların hemodinamik takibi, yoğun bakım protokollerinin eksiksiz uygulanması.',
    maxLevel: 5,
    usedInPositionsCount: 4,
    levelDescriptions: {
      1: 'Temel gözlem ve temel vital bulguların takibi yapabilir.',
      2: 'Süpervizyon altında stabil yoğun bakım hastasını takip eder.',
      3: 'Bağımsız olarak standart yoğun bakım protokollerini uygular, anormallikleri hızla fark eder.',
      4: 'Karmaşık çoklu organ yetmezliği vakalarını yönetir, girişimsel işlemlerde aktif rol alır.',
      5: 'Uzman düzey; klinik protokolleri revize eder, birim hemşirelerine rehberlik ve eğitim verir.'
    }
  },
  {
    id: 'comp_ekg',
    name: 'EKG Bilgisi & Ritim Yorumlama',
    category: 'clinical',
    description: '12 derivasyonlu EKG çekimi, kardiyak ritim bozukluklarının tanınması ve aritmi takibi.',
    maxLevel: 5,
    usedInPositionsCount: 5,
    levelDescriptions: {
      1: 'EKG elektrotlarını doğru yerleştirir ve standart çekim yapar.',
      2: 'Temel normal sinüs ritmini ve bariz taşikardi/bradikardi durumlarını ayırt eder.',
      3: 'Ventriküler/supraventriküler aritmileri, iskemi ve enfarktüs bulgularını tanımlar.',
      4: 'Karmaşık iletim bloklarını, elektrolit kaynaklı EKG değişimlerini yorumlar ve hekimi yönlendirir.',
      5: 'Kardiyoloji uzmanı seviyesinde ileri elektrofizyolojik ritim analizi ve eğitim kapasitesi.'
    }
  },
  {
    id: 'comp_acil_mudahale',
    name: 'Acil Müdahale & Resüsitasyon',
    category: 'clinical',
    description: 'Kardiyak/solunumsal arrest anında temel ve ileri yaşam desteği müdahalelerinin koordinasyonu.',
    maxLevel: 5,
    usedInPositionsCount: 6,
    levelDescriptions: {
      1: 'Mavi kod prosedürünü bilir, acil arabasını getirir ve temel göğüs kompresyonu yapar.',
      2: 'Standart CPR uygular, temel havayolu desteği sağlar.',
      3: 'ACLS algoritmasına tam hakim; defibrilatör kullanır, acil acil ilaç dozajlarını hatasız hazırlar.',
      4: 'Mavi kod ekibinde resüsitasyon akışını hekimle eşgüdümle yönetir, zor havayolu desteği sunar.',
      5: 'Kurum genelinde resüsitasyon eğitmeni; simülasyon eğitimlerini ve kriz analizlerini yönetir.'
    }
  },
  {
    id: 'comp_hasta_takibi',
    name: 'Hasta Takibi & Monitörizasyon',
    category: 'clinical',
    description: 'İnvaziv ve non-invaziv arteriyel/santral venöz basınç, saturasyon ve vital parametre takibi.',
    maxLevel: 5,
    usedInPositionsCount: 6,
    levelDescriptions: {
      1: 'Standart vital bulguları ölçer ve sisteme kaydeder.',
      2: 'Monitör alarmlarını doğru ayarlar, sapmalarda kıdemliye haber verir.',
      3: 'İnvaziv kan basıncı hatlarını sıfırlar, santral venöz basınç ve idrar çıkış korelasyonunu kurar.',
      4: 'Hemodinamik parametrelerdeki trendleri analiz ederek erken dekompansasyon uyarısı verir.',
      5: 'Gelişmiş kardiyak debi (PICCO/Swan-Ganz) monitörizasyonunu kurar ve yorumlar.'
    }
  },
  {
    id: 'comp_ekip_calismasi',
    name: 'Ekip Çalışması & Multidisipliner Koordinasyon',
    category: 'communication',
    description: 'Hekim, hemşire, teknisyen ve destek personeliyle saygılı, hatasız ve hızlı koordinasyon kurma.',
    maxLevel: 5,
    usedInPositionsCount: 7,
    levelDescriptions: {
      1: 'Bireysel görevlerini yerine getirir, ekip talimatlarını uygular.',
      2: 'Vardiya devirlerinde açık ve düzenli bilgi aktarımı sağlar.',
      3: 'Multidisipliner vizitlere aktif katılır, SBAR iletişim tekniğini etkin uygular.',
      4: 'Ekipler arası çatışmaları yönetir, kriz anlarında ekip motivasyonunu ve koordinasyonunu sağlar.',
      5: 'Klinik ekipler için iş birliği kültürü inşa eder; departmanlar arası iş akışlarını optimize eder.'
    }
  },
  {
    id: 'comp_mekanik_ventilator',
    name: 'Mekanik Ventilatör Yönetimi',
    category: 'technical',
    description: 'İnvaziv ve non-invaziv mekanik ventilatör modlarının, basınç/hacim döngülerinin yönetimi.',
    maxLevel: 5,
    usedInPositionsCount: 3,
    levelDescriptions: {
      1: 'Ventilatör devrelerini steril şekilde kurar ve hekim talimatıyla bağlar.',
      2: 'Temel modları (CPAP, BiPAP) bilir, temel alarmları tanır.',
      3: 'SIMV, PRVC ve Basınç Kontrollü modlarda hasta-ventilatör uyumsuzluğunu fark edip optimize eder.',
      4: 'Kan gazı sonuçlarına göre PEEP ve FiO2 titrasyonu önerir, weaning sürecini yönetir.',
      5: 'İleri ARDS protokolleri (prone pozisyonu, yüksek frekanslı salınım) konusunda eğitmen düzeydedir.'
    }
  },
  {
    id: 'comp_ileri_yasam_destegi',
    name: 'İleri Yaşam Desteği (ALS / ACLS)',
    category: 'clinical',
    description: 'Uluslararası onaylı yetişkin ve pediatrik ileri yaşam desteği sertifikasyon ve uygulama kabiliyeti.',
    maxLevel: 5,
    usedInPositionsCount: 4,
    levelDescriptions: {
      1: 'Temel ilk yardım ve BLS sertifikasına sahiptir.',
      2: 'ALS algoritmalarını teorik olarak bilir, pratikte destek sağlar.',
      3: 'Aktif ACLS sertifikalı; arrest senaryolarında görevleri eksiksiz yürütür.',
      4: 'Geri döndürülebilir nedenleri (4H - 4T) anında analiz eder, hızlı farmakolojik karar alır.',
      5: 'Resmi ERC/AHA onaylı ALS Kurs Direktörü veya Baş Eğitmeni.'
    }
  },
  {
    id: 'comp_hbys_dijital',
    name: 'Dijital Sağlık & HBYS Kullanımı',
    category: 'digital',
    description: 'Hastane Bilgi Yönetim Sistemi, e-reçete, PACS ve klinik karar destek yazılımları yetkinliği.',
    maxLevel: 5,
    usedInPositionsCount: 7,
    levelDescriptions: {
      1: 'Sisteme giriş yapar, temel hasta sorgulaması ve kayıt işlemi gerçekleştirir.',
      2: 'Order okuma ve hemşirelik notlarını standart şablonlarla hatasız girer.',
      3: 'Tüm HBYS modüllerini (laboratuvar, radyoloji, eczane istem) hızlı ve verimli kullanır.',
      4: 'HBYS veri kalitesini denetler, sistem açıklarını tespit edip BT ekibine geri bildirim verir.',
      5: 'Klinik süreçlerin dijitalleştirilmesinde ve entegrasyon projelerinde danışman rolü üstlenir.'
    }
  },
  {
    id: 'comp_enfeksiyon_kontrol',
    name: 'Enfeksiyon Kontrolü & İzolasyon',
    category: 'technical',
    description: 'Hastane enfeksiyonlarının önlenmesi, el hijyeni ve temas/damlacık/solunum izolasyon kuralları.',
    maxLevel: 5,
    usedInPositionsCount: 5,
    levelDescriptions: {
      1: 'Temel el hijyeni ve kişisel koruyucu ekipman giyim sırasını bilir.',
      2: 'Standart izolasyon odası prosedürlerini eksiksiz uygular.',
      3: 'Dirençli mikroorganizma (MRSA, VRE) sürveyansını yürütür, kültür alım tekniklerine hakimdir.',
      4: 'Birim enfeksiyon oranlarını takip eder, aseptik ihlallerde düzeltici eylem başlatır.',
      5: 'Enfeksiyon Kontrol Komitesi denetçisi; kurum hijyen kılavuzlarını hazırlar.'
    }
  },
  {
    id: 'comp_triyaj_karar',
    name: 'Triyaj & Klinik Karar Alma',
    category: 'clinical',
    description: 'Hasta kabulünde aciliyet derecelendirmesi (Kırmızı, Sarı, Yeşil alan) ve önceliklendirme.',
    maxLevel: 5,
    usedInPositionsCount: 3,
    levelDescriptions: {
      1: 'Triyaj skalalarının kategorilerini tanımlar.',
      2: 'Stabil hastalarda vital bulgulara göre ön değerlendirme yapar.',
      3: 'Manchester veya ESI triyaj sistemini bağımsız olarak uygular, 10 dakika içinde sınıflandırır.',
      4: 'Belirsiz ve atipik semptomları hızla deşifre eder, hasta güvenliğini en üstte tutar.',
      5: 'Triyaj algoritması denetmeni ve afet triyajı (START protokolü) koordinatörü.'
    }
  },
  {
    id: 'comp_kriz_stres',
    name: 'Kriz & Stres Yönetimi',
    category: 'managerial',
    description: 'Yüksek yoğunluklu acil ve kritik ortamlarda soğukkanlılık, odaklanma ve doğru karar alma.',
    maxLevel: 5,
    usedInPositionsCount: 6,
    levelDescriptions: {
      1: 'Baskı altında yönlendirmelere açık kalabilir.',
      2: 'Yoğun iş temposunda görevlerini panik yapmadan sürdürür.',
      3: 'Beklenmeyen acil kriz anlarında sükunetini korur, öncelikleri mantıkla sıralar.',
      4: 'Birimdeki diğer personeli sakinleştirir, kaosu organize çalışma disiplinine dönüştürür.',
      5: 'Hastane afet planı (HAP) ve olağanüstü durum kriz masası yürütücüsü.'
    }
  },
  {
    id: 'comp_empati_iletisim',
    name: 'Hasta Yakını İletişimi & Empati',
    category: 'communication',
    description: 'Endişeli, öfkeli veya yas sürecindeki hasta yakınlarına profesyonel ve şefkatli yaklaşım.',
    maxLevel: 5,
    usedInPositionsCount: 6,
    levelDescriptions: {
      1: 'Nezaket kurallarına uyar, temel bilgilendirmeleri yapar.',
      2: 'Hasta yakınlarının sorularını sabırla yanıtlar, sınırları korur.',
      3: 'Zor hasta/yakını durumlarını de-eskalasyon teknikleriyle sakinleştirir.',
      4: 'Kritik haber verme ve yoğun bakım bilgilendirmelerinde yüksek duygusal zeka ile rehberlik eder.',
      5: 'Kurum genelinde hasta deneyimi ve iletişim becerileri baş danışmanı.'
    }
  },
  {
    id: 'comp_jci_kalite',
    name: 'Klinik Kalite & JCI Akreditasyonu',
    category: 'managerial',
    description: 'Uluslararası Joint Commission International (JCI) ve Sağlıkta Kalite Standartları uyumu.',
    maxLevel: 5,
    usedInPositionsCount: 4,
    levelDescriptions: {
      1: 'Hasta kimlik doğrulama ve güvenli ilaç uygulama temel kurallarını bilir.',
      2: 'Düşme riski değerlendirmesi ve kalite formlarını doldurur.',
      3: 'Bölüm bazlı JCI denetim göstergelerini eksiksiz yönetir, ramak kala bildirimlerini yapar.',
      4: 'Kök neden analizlerine katılır, düzeltici-önleyici faaliyet (DÖF) süreçlerini yürütür.',
      5: 'Akreditasyon denetim lideri; kurum çapında kalite politikasını denetler.'
    }
  },
  {
    id: 'comp_farmakoloji_guvenlik',
    name: 'İlaç Güvenliği & Yüksek Riskli İlaç Yönetimi',
    category: 'clinical',
    description: 'Konsantre elektrolitler, narkotikler ve kemoterapötiklerin çift kontrol mekanizması ile verilmesi.',
    maxLevel: 5,
    usedInPositionsCount: 5,
    levelDescriptions: {
      1: '5 Doğru (Doğru hasta, ilaç, doz, yol, zaman) kuralını bilir.',
      2: 'Standart oral ve parenteral ilaçları güvenle uygular.',
      3: 'İnotropik ve vazopressör infüzyon hesaplamalarını mikrogram/kg/dk bazında hatasız yapar.',
      4: 'İlaç-ilaç etkileşimlerini öngörür, ekstravazasyon acil protokollerini yönetir.',
      5: 'Klinik farmakoloji komisyonu üyesi; yüksek riskli ilaç protokollerini onaylar.'
    }
  },
  {
    id: 'comp_biyomedikal_cihaz',
    name: 'Tıbbi Cihaz ve Biyomedikal Teknoloji',
    category: 'technical',
    description: 'Defibrilatör, infüzyon pompası, diyaliz ve görüntüleme cihazlarının testi, kalibrasyonu ve bakımı.',
    maxLevel: 5,
    usedInPositionsCount: 3,
    levelDescriptions: {
      1: 'Cihazları açar-kapatır, rutin batarya kontrollerini yapar.',
      2: 'Kullanıcı seviyesi testleri ve sarf malzeme değişimlerini yürütür.',
      3: 'Arıza tespiti yapar, koruyucu bakım ve elektriksel güvenlik testlerini belgeler.',
      4: 'Karmaşık kart arızalarını onarır, üretici kalibrasyon yazılımlarını kullanır.',
      5: 'Biyomedikal birim yöneticisi; tıbbi cihaz parkı satın alma ve yatırım analizlerini yönetir.'
    }
  },
  {
    id: 'comp_klinik_liderlik',
    name: 'Klinik Liderlik & Süpervizyon',
    category: 'leadership',
    description: 'Hemşirelik ve klinik ekiplere vizyon aşılama, klinik koçluk ve performans geliştirme.',
    maxLevel: 5,
    usedInPositionsCount: 4,
    levelDescriptions: {
      1: 'Stajyer ve yeni başlayan personele kılavuzluk eder.',
      2: 'Vardiya sorumluluğunu üstlenebilir, görev dağılımı yapar.',
      3: 'Birim hedeflerini takip eder, personelin klinik gelişim alanlarını belirler.',
      4: 'Klinik ekiplerin bağlılığını ve yetenek tutma oranını yükseltir, değişimi yönetir.',
      5: 'Klinik Hizmetler Direktörü düzeyinde stratejik liderlik.'
    }
  }
];
