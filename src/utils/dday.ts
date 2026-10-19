import { DDayInfo, PriorityQuadrant } from '../types';

export function calculateDDay(dueDateStr: string): DDayInfo {
  // Normalize date strings to midnight for accurate day comparison
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const targetDate = new Date(year, (month || 1) - 1, day || 1);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / msPerDay);

  if (diffDays === 0) {
    return {
      text: 'D-Day',
      label: '오늘 마감',
      diff: 0,
      status: 'today',
      colorClasses: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badgeBg: 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-200',
      },
    };
  } else if (diffDays === 1) {
    return {
      text: 'D-1',
      label: '내일 마감',
      diff: 1,
      status: 'urgent',
      colorClasses: {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-100',
      },
    };
  } else if (diffDays > 1 && diffDays <= 3) {
    return {
      text: `D-${diffDays}`,
      label: `${diffDays}일 남음`,
      diff: diffDays,
      status: 'urgent',
      colorClasses: {
        bg: 'bg-orange-50',
        text: 'text-orange-800',
        border: 'border-orange-200',
        badgeBg: 'bg-orange-500 text-white',
      },
    };
  } else if (diffDays > 3 && diffDays <= 7) {
    return {
      text: `D-${diffDays}`,
      label: `${diffDays}일 남음`,
      diff: diffDays,
      status: 'upcoming',
      colorClasses: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        badgeBg: 'bg-indigo-600 text-white',
      },
    };
  } else if (diffDays > 7) {
    return {
      text: `D-${diffDays}`,
      label: `${diffDays}일 남음`,
      diff: diffDays,
      status: 'far',
      colorClasses: {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        badgeBg: 'bg-slate-600 text-white',
      },
    };
  } else {
    const overdue = Math.abs(diffDays);
    return {
      text: `D+${overdue}`,
      label: `${overdue}일 지남`,
      diff: diffDays,
      status: 'overdue',
      colorClasses: {
        bg: 'bg-red-50',
        text: 'text-red-900',
        border: 'border-red-300',
        badgeBg: 'bg-red-700 text-white ring-2 ring-red-200 animate-pulse',
      },
    };
  }
}

export function getQuadrant(isImportant: boolean, isUrgent: boolean): PriorityQuadrant {
  if (isImportant && isUrgent) return 'Q1';
  if (isImportant && !isUrgent) return 'Q2';
  if (!isImportant && isUrgent) return 'Q3';
  return 'Q4';
}

export interface QuadrantMeta {
  id: PriorityQuadrant;
  rank: string;
  name: string;
  subtitle: string;
  actionGuide: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  cardAccentClass: string;
  iconName: string;
  importanceLabel: string;
  urgencyLabel: string;
}

export const QUADRANT_CONFIGS: Record<PriorityQuadrant, QuadrantMeta> = {
  Q1: {
    id: 'Q1',
    rank: '1순위',
    name: '최우선 과제',
    subtitle: '중요함 · 시급함',
    actionGuide: '지금 바로 집중하여 해결하세요! (Do First)',
    badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
    borderClass: 'border-rose-300',
    bgLightClass: 'bg-rose-50/70',
    cardAccentClass: 'hover:border-rose-400 focus-within:ring-rose-200',
    iconName: 'Flame',
    importanceLabel: '중요함',
    urgencyLabel: '시급함',
  },
  Q2: {
    id: 'Q2',
    rank: '2순위',
    name: '계획 집중 과제',
    subtitle: '중요함 · 여유있음',
    actionGuide: '장기적인 성장과 성적의 핵심! 미리 계획하세요 (Schedule)',
    badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    borderClass: 'border-indigo-300',
    bgLightClass: 'bg-indigo-50/70',
    cardAccentClass: 'hover:border-indigo-400 focus-within:ring-indigo-200',
    iconName: 'CalendarClock',
    importanceLabel: '중요함',
    urgencyLabel: '여유있음',
  },
  Q3: {
    id: 'Q3',
    rank: '3순위',
    name: '신속 처리 과제',
    subtitle: '안 중요함 · 시급함',
    actionGuide: '시간을 많이 뺏기지 말고 빠르게 끝내세요 (Delegate/Quick)',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
    borderClass: 'border-amber-300',
    bgLightClass: 'bg-amber-50/70',
    cardAccentClass: 'hover:border-amber-400 focus-within:ring-amber-200',
    iconName: 'Zap',
    importanceLabel: '안 중요함',
    urgencyLabel: '시급함',
  },
  Q4: {
    id: 'Q4',
    rank: '4순위',
    name: '여유 과제',
    subtitle: '안 중요함 · 여유있음',
    actionGuide: '시간이 남을 때 하거나 정리가 필요합니다 (Low Priority)',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300',
    borderClass: 'border-slate-300',
    bgLightClass: 'bg-slate-50/70',
    cardAccentClass: 'hover:border-slate-400 focus-within:ring-slate-200',
    iconName: 'Clock',
    importanceLabel: '안 중요함',
    urgencyLabel: '여유있음',
  },
};

export function formatKoreanDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = dayNames[date.getDay()];
    return `${Number(m)}월 ${Number(d)}일(${dayOfWeek})`;
  } catch {
    return dateStr;
  }
}
