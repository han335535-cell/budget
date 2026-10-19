import confetti from 'canvas-confetti';
import { AchievementBadge, PraiseMessage } from '../types';

// Micro-praises for individual task completion
export const TASK_COMPLETION_PRAISES = [
  '훌륭해요! 한 걸음 더 앞으로 나아갔습니다 👏',
  '크으~ 엄청난 집중력! 진짜 멋져요 ✨',
  '대단합니다! 이 기세 그대로 이어가 볼까요? 🚀',
  '스스로를 자랑스러워해도 좋습니다! 해냈어요 💖',
  '오늘의 소중한 성취 하나를 달성했습니다 🌱',
  '역시 꾸준한 당신이 최고입니다! 엄지 척! 👍',
  '어려운 일도 차근차근 해내는 당신의 끈기가 빛납니다 ⭐',
  '작은 과업이 모여 큰 실력이 됩니다. 아주 잘하셨어요!',
  '마감 압박을 이겨내고 승리하셨네요! 멋집니다 🎯',
  '오늘 하루 중 가장 가치 있는 순간 중 하나예요 🌈',
];

// Rich, warm praise messages when ALL tasks are cleared (인정욕구 완벽 해소)
export const ALL_CLEAR_PRAISES: PraiseMessage[] = [
  {
    id: 'mentor-1',
    tone: 'mentor',
    title: '당신의 끝없는 잠재력과 성실함에 경의를 표합니다',
    message:
      '오늘 하루 정말 고생 많으셨습니다. 수많은 과제와 시험 공부 속에서 포기하고 싶은 순간도 있었을 텐데, 끝까지 책임감 있게 책상을 지켜낸 당신의 끈기가 진심으로 존경스럽습니다. 오늘 쌓아 올린 이 노력은 결코 사라지지 않고 당신의 단단한 미래가 되어줄 거예요.',
    quote: '성실함은 가장 조용하지만, 세상에서 가장 강력한 무기입니다.',
    category: '인생의 성취',
  },
  {
    id: 'coach-1',
    tone: 'coach',
    title: '올클리어 달성! 완벽한 승리의 날입니다!',
    message:
      '와! 진짜 감탄밖에 안 나옵니다! 오늘 계획했던 모든 과업을 단 하나도 남김없이 부숴버렸네요! 이 정도 실행력과 집중력이라면 어떤 과제도, 어떤 시험도 가볍게 정복할 수 있습니다. 오늘 당신은 진정한 갓생의 주인공입니다! 푹 쉬고 자부심을 가지세요!',
    quote: '해내겠다는 결심과 실행이 기적을 만듭니다.',
    category: '열정의 정점',
  },
  {
    id: 'friend-1',
    tone: 'friend',
    title: '진짜 너무너무 수고했어! 오늘 넌 최고였어',
    message:
      '옆에서 보는데 오늘 진짜 쉬지도 않고 집중하더라. 마감일 다가와서 속으로 부담도 많이 됐을 텐데 묵묵히 다 끝낸 네가 정말 멋지고 대견해. 오늘만큼은 너 자신에게 100점 만점에 100점 주고, 맛있는 것도 먹고 푹 자자! 네가 너무 자랑스러워 :)',
    quote: '너의 노력은 언제나 빛나고 있어.',
    category: '따뜻한 위로',
  },
  {
    id: 'teacher-1',
    tone: 'teacher',
    title: '스스로 약속을 지켜낸 훌륭한 인재에게 아낌없는 박수를',
    message:
      '주어진 학업 일정과 과제를 스스로 우선순위 매겨 끝까지 완수해내는 것은 어른들도 해내기 어려운 놀라운 역량입니다. 오늘 학생이 보여준 주도성과 책임감은 앞으로 어떤 꿈을 펼치든 가장 든든한 밑거름이 될 것입니다. 참으로 기특하고 대단합니다.',
    quote: '스스로를 이겨낸 오늘, 당신은 한 단계 더 성장했습니다.',
    category: '성장의 증명',
  },
  {
    id: 'mentor-2',
    tone: 'mentor',
    title: '불안을 확신으로 바꾼 당신의 하루',
    message:
      '해야 할 일이 산더미처럼 쌓여 있을 땐 누구라도 막막함을 느낍니다. 하지만 당신은 회피하지 않고 마주 서서 하나씩 지워나갔습니다. 인정받을 자격이 충분한 하루를 보냈습니다. 오늘 밤은 아무런 걱정 없이 편안하게 잠들어도 좋습니다.',
    quote: '오늘의 최선이 내일의 기적을 준비합니다.',
    category: '평온과 확신',
  },
];

// Sound & speech recognition
export function speakPraiseKorean(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick a natural Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

// Confetti fireworks
export function triggerCelebrationConfetti(): void {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#a855f7', '#38bdf8', '#fbbf24', '#f43f5e'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // Ignore fallback
  }
}

// Micro confetti burst on single task completion
export function triggerMiniConfetti(x = 0.5, y = 0.5): void {
  try {
    confetti({
      particleCount: 35,
      spread: 45,
      startVelocity: 25,
      origin: { x, y },
      zIndex: 9999,
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
    });
  } catch {
    // Ignore
  }
}

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'first-step',
    title: '첫 걸음의 용기',
    description: '첫 번째 학교 일정을 완료했습니다.',
    icon: 'Footprints',
    unlocked: false,
  },
  {
    id: 'd-day-conqueror',
    title: '마감일 사냥꾼',
    description: '오늘 마감(D-Day) 과업을 정시에 끝냈습니다.',
    icon: 'Target',
    unlocked: false,
  },
  {
    id: 'q1-master',
    title: '최우선 킬러',
    description: '중요하고 시급한 1순위 과제를 2개 이상 완료했습니다.',
    icon: 'Flame',
    unlocked: false,
  },
  {
    id: 'all-clear-hero',
    title: '올클리어 마스터',
    description: '등록된 모든 학교 과업을 완벽히 끝마쳤습니다.',
    icon: 'Trophy',
    unlocked: false,
  },
  {
    id: 'planner-king',
    title: '전략적 기획자',
    description: '중요하지만 여유있는 2순위 과제를 미리 완수했습니다.',
    icon: 'Sparkles',
    unlocked: false,
  },
];
