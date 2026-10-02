/**
 * HealthMatch - Production Express Server
 * Supports Render Web Service deployment, REST API, Health Check, and SPA Fallback.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { MOCK_POSITIONS } from './src/data/mockPositions.ts';
import { MOCK_EMPLOYEES } from './src/data/mockEmployees.ts';
import { MOCK_COMPETENCIES } from './src/data/mockCompetencies.ts';
import { MatchingEngine } from './src/engine/matchingEngine.ts';
import { Position, Employee, ActivityItem, CompetencyGapReport, DepartmentReadiness } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

app.use(express.json());

// In-Memory Data Store (Initialized with domain mock data)
let positions: Position[] = JSON.parse(JSON.stringify(MOCK_POSITIONS));
let employees: Employee[] = JSON.parse(JSON.stringify(MOCK_EMPLOYEES));
const competencies = JSON.parse(JSON.stringify(MOCK_COMPETENCIES));

// Persistent Activities and Favorites
let activities: ActivityItem[] = [
  {
    id: 'act_init_1',
    type: 'position_created',
    title: 'Pozisyon Yayınlandı',
    description: 'Yoğun Bakım Hemşiresi açık pozisyon gereksinim vektörleri tanımlandı.',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'position',
    entityId: 'pos_yogun_bakim_hemsiresi',
    entityName: 'Yoğun Bakım Hemşiresi',
    canUndo: false,
  },
  {
    id: 'act_init_2',
    type: 'interview_called',
    title: 'Mülakat Daveti Gönderildi',
    description: 'Mehmet Kaya için Cerrahi Yoğun Bakım mülakat süreci başlatıldı.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'candidate',
    entityId: 'emp_mehmet_kaya',
    entityName: 'Mehmet Kaya',
    previousState: 'review_pending',
    newState: 'interviewing',
    canUndo: true,
  },
];

let favoriteCandidateIds = new Set<string>(['emp_ayse_yilmaz']);
let favoritePositionIds = new Set<string>(['pos_yogun_bakim_hemsiresi']);

// Synchronize favorite flags onto employees
employees.forEach((emp) => {
  emp.isFavorite = favoriteCandidateIds.has(emp.id);
  if (emp.id === 'emp_mehmet_kaya') {
    emp.status = 'interviewing';
    emp.interview = {
      calledAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'called',
      interviewer: 'Dr. Selin Demir',
      location: 'Maslak Hastanesi - İK Mülakat Salonu B',
    };
  }
});

// ============================================================================
// 1. HEALTH CHECK ENDPOINT (Requirement #18)
// ============================================================================
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'HealthMatch Production API',
    version: '2.4.0',
  });
});

// ============================================================================
// 2. POSITIONS API
// ============================================================================
app.get('/api/positions', (_req: Request, res: Response) => {
  res.json({ data: positions, count: positions.length });
});

app.get('/api/positions/:id', (req: Request, res: Response) => {
  const position = positions.find((p) => p.id === req.params.id);
  if (!position) {
    return res.status(404).json({ error: 'Pozisyon bulunamadı.' });
  }
  res.json({ data: position });
});

app.post('/api/positions', (req: Request, res: Response) => {
  const { title, department, description, workType, experienceYearsRequired, requirements } = req.body;
  if (!title || !department || !requirements || !requirements.length) {
    return res.status(400).json({ error: 'Eksik veya hatalı pozisyon verisi.' });
  }

  const newPosition: Position = {
    id: `pos_${Date.now()}`,
    title,
    department,
    status: 'active',
    openDate: new Date().toISOString().split('T')[0],
    applicantsCount: 0,
    averageMatchScore: 80,
    workType: workType || 'Tam Zamanlı',
    experienceYearsRequired: Number(experienceYearsRequired) || 2,
    description: description || '',
    requirements,
  };

  positions.unshift(newPosition);

  // Log activity
  activities.unshift({
    id: `act_${Date.now()}`,
    type: 'position_created',
    title: 'Yeni Pozisyon Oluşturuldu',
    description: `"${newPosition.title}" pozisyonu ${newPosition.requirements.length} yetkinlik kriteriyle sisteme kaydedildi.`,
    timestamp: new Date().toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'position',
    entityId: newPosition.id,
    entityName: newPosition.title,
    canUndo: false,
  });

  res.status(201).json({ data: newPosition, message: 'Pozisyon başarıyla oluşturuldu.' });
});

app.patch('/api/positions/:id', (req: Request, res: Response) => {
  const index = positions.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pozisyon bulunamadı.' });
  }

  const oldStatus = positions[index].status;
  positions[index] = { ...positions[index], ...req.body };

  if (req.body.status && req.body.status !== oldStatus) {
    activities.unshift({
      id: `act_${Date.now()}`,
      type: 'position_status_changed',
      title: 'Pozisyon Durumu Güncellendi',
      description: `"${positions[index].title}" pozisyonu durumu "${req.body.status}" olarak güncellendi.`,
      timestamp: new Date().toISOString(),
      actor: 'Dr. Selin Demir',
      entityType: 'position',
      entityId: positions[index].id,
      entityName: positions[index].title,
      previousState: oldStatus,
      newState: req.body.status,
      canUndo: true,
    });
  }

  res.json({ data: positions[index] });
});

// ============================================================================
// 3. EMPLOYEES & CANDIDATES API
// ============================================================================
app.get('/api/employees', (_req: Request, res: Response) => {
  res.json({ data: employees, count: employees.length });
});

app.get('/api/employees/:id', (req: Request, res: Response) => {
  const employee = employees.find((e) => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Aday bulunamadı.' });
  }
  res.json({ data: employee });
});

app.patch('/api/employees/:id', (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Aday bulunamadı.' });
  }

  const prevStatus = employees[index].status;
  employees[index] = { ...employees[index], ...req.body };

  if (req.body.status && req.body.status !== prevStatus) {
    activities.unshift({
      id: `act_${Date.now()}`,
      type: 'status_changed',
      title: 'Aday Durumu Güncellendi',
      description: `${employees[index].name} adayının durumu "${req.body.status}" olarak güncellendi.`,
      timestamp: new Date().toISOString(),
      actor: 'Dr. Selin Demir',
      entityType: 'candidate',
      entityId: employees[index].id,
      entityName: employees[index].name,
      previousState: prevStatus,
      newState: req.body.status,
      canUndo: true,
    });
  }

  res.json({ data: employees[index] });
});

// Interview Management (Requirement #2: Mülakata Çağır & İptal Et)
app.post('/api/employees/:id/interview', (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Aday bulunamadı.' });
  }

  const prevStatus = employees[index].status;
  const { interviewer, location, scheduledAt, notes } = req.body;

  employees[index].status = 'interviewing';
  employees[index].interview = {
    calledAt: new Date().toISOString(),
    scheduledAt: scheduledAt || new Date(Date.now() + 3600000 * 48).toISOString(),
    interviewer: interviewer || 'Dr. Selin Demir (İK Direktörü)',
    location: location || 'Maslak Hastanesi Klinik Heyet Odası / Online Mülakat',
    status: 'called',
    notes: notes || 'Yetkinlik uyum vektörleri yüksek; klinik vaka senaryoları incelenecek.',
  };

  const actId = `act_${Date.now()}`;
  activities.unshift({
    id: actId,
    type: 'interview_called',
    title: 'Mülakat Daveti İletildi',
    description: `${employees[index].name} için mülakat süreci başlatıldı.`,
    timestamp: new Date().toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'candidate',
    entityId: employees[index].id,
    entityName: employees[index].name,
    previousState: prevStatus,
    newState: 'interviewing',
    canUndo: true,
  });

  res.json({
    data: employees[index],
    activityId: actId,
    message: `${employees[index].name} başarıyla mülakata çağrıldı.`,
  });
});

app.delete('/api/employees/:id/interview', (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Aday bulunamadı.' });
  }

  const previousInterview = employees[index].interview;
  const prevStatus = employees[index].status;

  employees[index].status = 'review_pending';
  employees[index].interview = undefined;

  const actId = `act_${Date.now()}`;
  activities.unshift({
    id: actId,
    type: 'interview_cancelled',
    title: 'Mülakat İptal Edildi',
    description: `${employees[index].name} mülakatı iptal edildi ve aday inceleme havuzuna geri alındı.`,
    timestamp: new Date().toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'candidate',
    entityId: employees[index].id,
    entityName: employees[index].name,
    previousState: { status: prevStatus, interview: previousInterview },
    newState: { status: 'review_pending' },
    canUndo: true,
  });

  res.json({
    data: employees[index],
    activityId: actId,
    message: `${employees[index].name} mülakatı iptal edildi.`,
  });
});

// Candidate Notes
app.post('/api/employees/:id/notes', (req: Request, res: Response) => {
  const { noteText } = req.body;
  if (!noteText || !noteText.trim()) {
    return res.status(400).json({ error: 'Not metni boş olamaz.' });
  }

  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Aday bulunamadı.' });
  }

  if (!employees[index].notes) {
    employees[index].notes = [];
  }
  employees[index].notes!.unshift(noteText.trim());

  activities.unshift({
    id: `act_${Date.now()}`,
    type: 'note_added',
    title: 'İK Değerlendirme Notu Eklendi',
    description: `${employees[index].name} adayına değerlendirme notu eklendi.`,
    timestamp: new Date().toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'candidate',
    entityId: employees[index].id,
    entityName: employees[index].name,
    canUndo: false,
  });

  res.json({ data: employees[index], message: 'Not başarıyla kaydedildi.' });
});

// ============================================================================
// 4. FAVORITES API
// ============================================================================
app.get('/api/favorites', (_req: Request, res: Response) => {
  res.json({
    candidateIds: Array.from(favoriteCandidateIds),
    positionIds: Array.from(favoritePositionIds),
  });
});

app.post('/api/favorites/toggle', (req: Request, res: Response) => {
  const { type, id } = req.body;
  let isFavorite = false;

  if (type === 'candidate') {
    if (favoriteCandidateIds.has(id)) {
      favoriteCandidateIds.delete(id);
      isFavorite = false;
    } else {
      favoriteCandidateIds.add(id);
      isFavorite = true;
    }
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      emp.isFavorite = isFavorite;
      activities.unshift({
        id: `act_${Date.now()}`,
        type: isFavorite ? 'favorite_added' : 'favorite_removed',
        title: isFavorite ? 'Favorilere Eklendi' : 'Favorilerden Çıkarıldı',
        description: `${emp.name} ${isFavorite ? 'favori adaylar listenize eklendi' : 'favorilerinizden çıkarıldı'}.`,
        timestamp: new Date().toISOString(),
        actor: 'Dr. Selin Demir',
        entityType: 'candidate',
        entityId: emp.id,
        entityName: emp.name,
        canUndo: true,
      });
    }
  } else if (type === 'position') {
    if (favoritePositionIds.has(id)) {
      favoritePositionIds.delete(id);
      isFavorite = false;
    } else {
      favoritePositionIds.add(id);
      isFavorite = true;
    }
  }

  res.json({
    type,
    id,
    isFavorite,
    candidateIds: Array.from(favoriteCandidateIds),
    positionIds: Array.from(favoritePositionIds),
  });
});

// ============================================================================
// 5. ACTIVITIES & UNDO API (Requirement #8 & #9)
// ============================================================================
app.get('/api/activities', (_req: Request, res: Response) => {
  res.json({ data: activities.slice(0, 30) });
});

app.post('/api/activities/undo/:id', (req: Request, res: Response) => {
  const act = activities.find((a) => a.id === req.params.id);
  if (!act || !act.canUndo) {
    return res.status(400).json({ error: 'Geri alınabilir işlem bulunamadı veya süre doldu.' });
  }

  if (act.type === 'interview_called' || act.type === 'interview_cancelled') {
    const empIndex = employees.findIndex((e) => e.id === act.entityId);
    if (empIndex !== -1) {
      const targetState = act.previousState;
      if (typeof targetState === 'string') {
        employees[empIndex].status = targetState as any;
        if (targetState !== 'interviewing') {
          employees[empIndex].interview = undefined;
        }
      } else if (targetState && typeof targetState === 'object') {
        employees[empIndex].status = targetState.status;
        employees[empIndex].interview = targetState.interview;
      }
    }
  } else if (act.type === 'status_changed') {
    const empIndex = employees.findIndex((e) => e.id === act.entityId);
    if (empIndex !== -1 && act.previousState) {
      employees[empIndex].status = act.previousState;
    }
  } else if (act.type === 'favorite_added' || act.type === 'favorite_removed') {
    if (act.entityType === 'candidate') {
      const willBeFav = act.type === 'favorite_removed';
      if (willBeFav) {
        favoriteCandidateIds.add(act.entityId);
      } else {
        favoriteCandidateIds.delete(act.entityId);
      }
      const emp = employees.find((e) => e.id === act.entityId);
      if (emp) emp.isFavorite = willBeFav;
    }
  }

  // Mark undone
  act.canUndo = false;
  activities.unshift({
    id: `act_${Date.now()}`,
    type: 'status_changed',
    title: 'İşlem Geri Alındı',
    description: `"${act.title}" işlemi başarıyla geri alındı.`,
    timestamp: new Date().toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: act.entityType,
    entityId: act.entityId,
    entityName: act.entityName,
    canUndo: false,
  });

  res.json({
    message: 'İşlem başarıyla geri alındı.',
    employee: employees.find((e) => e.id === act.entityId),
  });
});

// ============================================================================
// 6. COMPETENCIES, MATCHING & ANALYTICS API
// ============================================================================
app.get('/api/competencies', (_req: Request, res: Response) => {
  res.json({ data: competencies });
});

app.get('/api/matching/position/:positionId', (req: Request, res: Response) => {
  const position = positions.find((p) => p.id === req.params.positionId);
  if (!position) {
    return res.status(404).json({ error: 'Pozisyon bulunamadı.' });
  }

  const results = MatchingEngine.rankCandidatesForPosition(position, employees);
  res.json({ data: results });
});

app.post('/api/matching/calculate', (req: Request, res: Response) => {
  const { positionId, employeeId } = req.body;
  const position = positions.find((p) => p.id === positionId);
  const employee = employees.find((e) => e.id === employeeId);

  if (!position || !employee) {
    return res.status(404).json({ error: 'Pozisyon veya aday bulunamadı.' });
  }

  const result = MatchingEngine.calculateMatch(position, employee);
  res.json({ data: result });
});

app.get('/api/analytics/gaps', (_req: Request, res: Response) => {
  const reports: CompetencyGapReport[] = [];
  for (const comp of competencies) {
    let demandCount = 0;
    let totalRequiredLevel = 0;

    positions.forEach((pos) => {
      const req = pos.requirements.find((r) => r.competencyId === comp.id);
      if (req) {
        demandCount++;
        totalRequiredLevel += req.requiredLevel;
      }
    });

    if (demandCount === 0) continue;

    const averageRequiredLevel = Number((totalRequiredLevel / demandCount).toFixed(1));

    let poolSum = 0;
    let poolCount = 0;
    employees.forEach((emp) => {
      const empComp = emp.competencies.find((c) => c.competencyId === comp.id);
      if (empComp) {
        poolSum += empComp.level;
        poolCount++;
      }
    });

    const talentPoolAverageLevel = poolCount > 0 ? Number((poolSum / poolCount).toFixed(1)) : 1.5;
    const rawDeficit = ((averageRequiredLevel - talentPoolAverageLevel) / averageRequiredLevel) * 100;
    const deficitRate = Math.max(0, Math.round(rawDeficit));

    let severity: 'high' | 'medium' | 'low' = 'low';
    if (deficitRate >= 25) severity = 'high';
    else if (deficitRate >= 15) severity = 'medium';

    let strategicAction: 'Dış İşe Alım' | 'İç Hizmet İçi Eğitim' | 'Mentörlük & Rotasyon' = 'Mentörlük & Rotasyon';
    if (severity === 'high') {
      strategicAction = 'Dış İşe Alım';
    } else if (severity === 'medium') {
      strategicAction = 'İç Hizmet İçi Eğitim';
    }

    reports.push({
      competencyId: comp.id,
      competencyName: comp.name,
      category: comp.category,
      demandCount,
      averageRequiredLevel,
      talentPoolAverageLevel,
      deficitRate,
      severity,
      strategicAction,
    });
  }

  reports.sort((a, b) => b.deficitRate - a.deficitRate);
  res.json({ data: reports });
});

app.get('/api/analytics/departments', (_req: Request, res: Response) => {
  const depts: DepartmentReadiness[] = [
    {
      department: 'Genel Yoğun Bakım',
      openPositions: positions.filter((p) => p.department.includes('Yoğun Bakım') && p.status === 'active').length,
      candidatesCount: 42,
      averageMatchRate: 81,
      topGapCompetency: 'İleri Yaşam Desteği (ALS / ACLS)',
    },
    {
      department: 'Acil Tıp Kliniği',
      openPositions: positions.filter((p) => p.department.includes('Acil') && p.status === 'active').length,
      candidatesCount: 38,
      averageMatchRate: 78,
      topGapCompetency: 'Afet Triyajı & Kriz Yönetimi',
    },
    {
      department: 'Biyomedikal & Mühendislik',
      openPositions: positions.filter((p) => p.department.includes('Biyomedikal') && p.status === 'active').length,
      candidatesCount: 19,
      averageMatchRate: 84,
      topGapCompetency: 'Ventilatör Kalibrasyonu',
    },
    {
      department: 'Hasta Hizmetleri',
      openPositions: positions.filter((p) => p.department.includes('Hasta') && p.status === 'active').length,
      candidatesCount: 64,
      averageMatchRate: 86,
      topGapCompetency: 'De-eskalasyon & İletişim',
    },
    {
      department: 'Kalp ve Damar Cerrahisi',
      openPositions: positions.filter((p) => p.department.includes('Kalp') && p.status === 'active').length,
      candidatesCount: 26,
      averageMatchRate: 79,
      topGapCompetency: 'İntraaortik Balon Pompası',
    },
  ];
  res.json({ data: depts });
});

// ============================================================================
// 7. DEV & PRODUCTION SERVER SETUP (Vite middleware or static dist + SPA fallback)
// ============================================================================
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist/ folder not found. Run npm run build first.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HealthMatch] Server running on http://0.0.0.0:${PORT} (Mode: ${isProd ? 'production' : 'development'})`);
    console.log(`[HealthMatch] Health check available at: http://0.0.0.0:${PORT}/health`);
  });
}

startServer().catch((err) => {
  console.error('[HealthMatch] Server startup error:', err);
  process.exit(1);
});
