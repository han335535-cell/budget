import { Task } from '../types';

export function getInitialTasks(): Task[] {
  const now = new Date();

  // Helper to format date offset from today
  const getDateOffset = (offsetDays: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [
    {
      id: 'task-1',
      title: '수학 II 중간고사 대비 고난도 기출 오답노트 정리',
      description: '미분 단원 수능/모의고사 기출 15문항 풀이 과정과 오답 이유 꼼꼼히 정리하여 제출',
      category: '과제',
      subject: '수학',
      dueDate: getDateOffset(0), // Today (D-Day)
      dueTime: '23:59',
      isImportant: true,
      isUrgent: true, // Q1: 1순위 최우선
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: '영어 독해 및 작문 수행평가 TED 발표 대본 최종 검토',
      description: '3분 스피치 대본 영작문 문법 체크 및 발음 연습, 큐카드 준비',
      category: '수행평가',
      subject: '영어',
      dueDate: getDateOffset(1), // Tomorrow (D-1)
      dueTime: '18:00',
      isImportant: true,
      isUrgent: true, // Q1: 1순위 최우선
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: '2학기 중간고사 국어 문학 갈래별 핵심 개념 총정리',
      description: '고전시가 5편 현대어 풀이 및 현대소설 시점/갈등 구조 마인드맵 그리기',
      category: '시험',
      subject: '국어',
      dueDate: getDateOffset(4), // D-4
      dueTime: '22:00',
      isImportant: true,
      isUrgent: false, // Q2: 2순위 계획집중
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: '과학탐구실험 보고서 초안 작성 및 데이터 정리',
      description: '산·염기 중화적정 실험 데이터 표 그래프화 및 결론 도출',
      category: '수행평가',
      subject: '과학',
      dueDate: getDateOffset(5), // D-5
      dueTime: '17:00',
      isImportant: true,
      isUrgent: false, // Q2: 2순위 계획집중
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: '학생회 축제 동아리 체험 부스 운영 신청서 서명 제출',
      description: '동아리 지도교사 서명 받고 학생자치부 함에 제출',
      category: '동아리',
      subject: '동아리',
      dueDate: getDateOffset(1), // D-1
      dueTime: '16:30',
      isImportant: false,
      isUrgent: true, // Q3: 3순위 신속처리
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-6',
      title: '학급 사물함 번호표 갱신 및 교과서 사물함 정리',
      description: '사물함 청소 점검 전 불필요한 프린트물 분리수거',
      category: '학교행사',
      subject: '학급활동',
      dueDate: getDateOffset(2), // D-2
      dueTime: '17:00',
      isImportant: false,
      isUrgent: true, // Q3: 3순위 신속처리
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-7',
      title: '도서관 희망 도서 1권 대출 및 주말 독서 계획',
      description: '진로 관련 인공지능/빅데이터 교양 도서 읽고 간단한 한 줄 서평 남기기',
      category: '개인공부',
      subject: '진로',
      dueDate: getDateOffset(6), // D-6
      dueTime: '21:00',
      isImportant: false,
      isUrgent: false, // Q4: 4순위 여유과제
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-8',
      title: '11월 학교 진로체험의 날 사전 수요조사 구글 폼 응답',
      description: '희망 직업군 1, 2순위 선택 설문 참여',
      category: '학교행사',
      subject: '학교행사',
      dueDate: getDateOffset(7), // D-7
      dueTime: '23:59',
      isImportant: false,
      isUrgent: false, // Q4: 4순위 여유과제
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}
