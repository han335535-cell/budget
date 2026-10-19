export type TaskCategory =
  | '과제'
  | '시험'
  | '수행평가'
  | '동아리'
  | '학교행사'
  | '개인공부'
  | '기타';

export type PriorityQuadrant =
  | 'Q1' // 중요함 + 시급함 -> 최우선 과제 (Do First)
  | 'Q2' // 중요함 + 여유있음 -> 계획 과제 (Schedule)
  | 'Q3' // 안 중요함 + 시급함 -> 신속 처리 (Delegate / Quick)
  | 'Q4'; // 안 중요함 + 여유있음 -> 여유 과제 (Low Priority)

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  subject?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  isImportant: boolean; // 중요도
  isUrgent: boolean; // 시급성
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface DDayInfo {
  text: string;
  label: string;
  diff: number; // positive: future days remaining, 0: today, negative: overdue
  status: 'today' | 'urgent' | 'upcoming' | 'far' | 'overdue';
  colorClasses: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
}

export interface PraiseMessage {
  id: string;
  tone: 'mentor' | 'coach' | 'friend' | 'teacher';
  title: string;
  message: string;
  quote?: string;
  category: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
