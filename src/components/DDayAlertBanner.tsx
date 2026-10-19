import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { calculateDDay, formatKoreanDate } from '../utils/dday';

interface DDayAlertBannerProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onFilterByStatus?: (status: string) => void;
}

export const DDayAlertBanner: React.FC<DDayAlertBannerProps> = ({
  tasks,
  onToggleComplete,
  onSelectTask,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Sorted by D-Day difference (most urgent first)
  const sortedPending = [...pendingTasks].sort((a, b) => {
    const diffA = calculateDDay(a.dueDate).diff;
    const diffB = calculateDDay(b.dueDate).diff;
    return diffA - diffB;
  });

  const todayTasks = sortedPending.filter((t) => calculateDDay(t.dueDate).diff === 0);
  const tomorrowTasks = sortedPending.filter((t) => calculateDDay(t.dueDate).diff === 1);
  const imminentTasks = sortedPending.filter(
    (t) => calculateDDay(t.dueDate).diff > 1 && calculateDDay(t.dueDate).diff <= 3
  );

  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;

  // Warm encouragement quote based on progress
  const getEncouragement = () => {
    if (progressPercent === 100) return '🎉 모든 과업을 완벽히 끝마쳤습니다! 정말 대단한 하루예요!';
    if (progressPercent >= 75) return '🔥 거의 다 왔어요! 마지막 스퍼트를 응원합니다!';
    if (progressPercent >= 50) return '💪 벌써 절반 이상 달성! 당신의 집중력은 정말 놀랍습니다.';
    if (progressPercent > 0) return '✨ 기분 좋은 출발! 하나씩 차근차근 해결해 나가고 있어요.';
    return '🌱 오늘의 첫 걸음을 내딛어 보세요. 시작이 반입니다!';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-6">
      {/* Top Banner - Highlight most urgent if today or tomorrow exists */}
      {(todayTasks.length > 0 || tomorrowTasks.length > 0) && (
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white/20 text-white animate-pulse">
              <Bell className="w-4 h-4" />
            </span>
            <span className="font-bold">
              {todayTasks.length > 0
                ? `🚨 오늘 마감(D-Day) 과업이 ${todayTasks.length}건 있습니다!`
                : `⏰ 내일 마감(D-1) 예정된 과업이 ${tomorrowTasks.length}건 있습니다.`}
            </span>
            <span className="hidden md:inline text-xs text-rose-100">
              우선순위를 확인하고 지금 바로 확인해보세요.
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            {todayTasks.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white text-rose-700 shadow-xs">
                D-Day {todayTasks.length}건
              </span>
            )}
            {tomorrowTasks.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-900">
                D-1 {tomorrowTasks.length}건
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Bar Content */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Progress & Affirmation (Left: 4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>오늘의 성취 진행률</span>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {completedTasks.length} / {totalCount} 완료 ({progressPercent}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-700 font-semibold flex items-center gap-1">
              {getEncouragement()}
            </p>
          </div>

          {/* Imminent D-Days Auto-Feed (Right: 8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>실시간 임박 일정 자동 알림 (D-Day 피드)</span>
              </div>
              <span className="text-xs text-slate-700 font-medium">
                우선순위 & 마감일 자동 정렬
              </span>
            </div>

            {sortedPending.length === 0 ? (
              <div className="py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    현재 대기 중인 긴급 일정이 없습니다! 여유롭고 상쾌한 시간 보내세요.
                  </span>
                </div>
                <span className="text-emerald-700 font-bold hidden sm:inline">ALL CLEAR ✨</span>
              </div>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {sortedPending.slice(0, 4).map((task) => {
                  const dday = calculateDDay(task.dueDate);
                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className={`shrink-0 w-64 sm:w-72 p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${dday.colorClasses.bg} ${dday.colorClasses.border}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-md ${dday.colorClasses.badgeBg}`}
                        >
                          {dday.text} ({dday.label})
                        </span>
                        <span className="text-[11px] font-medium text-slate-700">
                          {task.subject || task.category}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <span>{formatKoreanDate(task.dueDate)} {task.dueTime || ''}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                          }}
                          className="hover:text-indigo-600 font-bold flex items-center gap-0.5"
                          title="빠른 완료 처리"
                        >
                          <span>완료하기</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
