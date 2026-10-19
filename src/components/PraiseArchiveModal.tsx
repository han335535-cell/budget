import React, { useState } from 'react';
import {
  X,
  Trophy,
  Award,
  Sparkles,
  Heart,
  Target,
  Flame,
  CheckCircle,
  Volume2,
  RefreshCw,
  Footprints,
} from 'lucide-react';
import { AchievementBadge, Task } from '../types';
import { ALL_CLEAR_PRAISES, TASK_COMPLETION_PRAISES, speakPraiseKorean, triggerMiniConfetti } from '../utils/praise';
import { soundEffects } from '../utils/audio';

interface PraiseArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  achievements: AchievementBadge[];
}

export const PraiseArchiveModal: React.FC<PraiseArchiveModalProps> = ({
  isOpen,
  onClose,
  tasks,
  achievements,
}) => {
  const [randomPraise, setRandomPraise] = useState<string>(
    '공부하느라 정말 애썼어요. 남들은 몰라도 당신이 쏟은 진심은 스스로가 가장 잘 알고 있습니다 ✨'
  );

  if (!isOpen) return null;

  const completedTasks = tasks.filter((t) => t.completed);

  const handleGeneratePraise = (e: React.MouseEvent) => {
    const list = [
      ...TASK_COMPLETION_PRAISES,
      ...ALL_CLEAR_PRAISES.map((p) => p.message),
      '오늘 당신이 책상 앞에 앉아 버텨낸 1분 1초는 절대 사라지지 않는 위대한 실력이 됩니다.',
      '누군가와 비교하지 마세요. 어제의 나보다 한 과목, 한 문제를 더 이해한 오늘 당신은 이미 챔피언입니다.',
      '스스로에게 관대해져도 됩니다. 오늘 진짜 열심히 했잖아요! 대견합니다.',
      '불안하다는 건 그만큼 당신이 진심으로 잘해내고 싶어 한다는 증거예요. 당신은 이미 충분히 훌륭합니다.',
    ];
    const picked = list[Math.floor(Math.random() * list.length)];
    setRandomPraise(picked);
    soundEffects.playSparkle();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerMiniConfetti(x, y);
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-indigo-500" />;
      case 'Target':
        return <Target className="w-5 h-5 text-rose-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                명예의 전당 & 인정 칭찬 센터
              </h3>
              <p className="text-xs text-slate-500">
                나의 노력과 성취를 증명하고, 지칠 때마다 따뜻한 칭찬을 받는 공간입니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Praise Vending Machine (즉석 칭찬 카드) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-indigo-50 border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-xs font-black text-amber-900 uppercase">
                  공부하다 지칠 때! 즉시 칭찬 자판기
                </span>
              </div>
              <button
                onClick={(e) => handleGeneratePraise(e)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>새로운 칭찬 뽑기</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed py-2 italic bg-white/70 p-4 rounded-xl border border-amber-100">
              "{randomPraise}"
            </p>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>스스로를 인정하는 순간 자존감이 자라납니다.</span>
              <button
                onClick={() => speakPraiseKorean(randomPraise)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>목소리로 듣기</span>
              </button>
            </div>
          </div>

          {/* Achievement Badges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                나의 학업 성취 뱃지 ({achievements.filter((a) => a.unlocked).length} /{' '}
                {achievements.length} 달성)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-50'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.unlocked ? 'bg-indigo-50' : 'bg-slate-200'
                    }`}
                  >
                    {renderBadgeIcon(badge.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">{badge.title}</h5>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          달성 완료!
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">도전 중</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed tasks record */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              내가 해낸 소중한 기록들 ({completedTasks.length}건)
            </h4>

            {completedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                아직 완료된 일정이 없습니다. 오늘 할 일 하나를 체크해보세요!
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800 line-through">
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
