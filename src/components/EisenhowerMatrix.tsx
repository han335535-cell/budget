import React from 'react';
import { Flame, CalendarClock, Zap, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { Task, PriorityQuadrant } from '../types';
import { TaskCard } from './TaskCard';
import { QUADRANT_CONFIGS } from '../utils/dday';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onQuickAdd: (quadrant: PriorityQuadrant) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onQuickAdd,
}) => {
  // Filter tasks into 4 quadrants
  const getTasksForQuadrant = (isImp: boolean, isUrg: boolean) => {
    return tasks.filter((t) => t.isImportant === isImp && t.isUrgent === isUrg);
  };

  const q1Tasks = getTasksForQuadrant(true, true); // 1순위: 중요 + 시급
  const q2Tasks = getTasksForQuadrant(true, false); // 2순위: 중요 + 여유
  const q3Tasks = getTasksForQuadrant(false, true); // 3순위: 안 중요 + 시급
  const q4Tasks = getTasksForQuadrant(false, false); // 4순위: 안 중요 + 여유

  const renderQuadrant = (
    quadrantId: PriorityQuadrant,
    tasksList: Task[],
    icon: React.ReactNode,
    accentBorder: string,
    accentBg: string
  ) => {
    const meta = QUADRANT_CONFIGS[quadrantId];
    const pendingCount = tasksList.filter((t) => !t.completed).length;
    const completedCount = tasksList.filter((t) => t.completed).length;

    return (
      <div
        className={`flex flex-col rounded-2xl border ${accentBorder} ${accentBg} p-4 sm:p-5 transition-all shadow-xs min-h-[380px]`}
      >
        {/* Quadrant Header */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white shadow-xs text-slate-800">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${meta.badgeClass}`}>
                  {meta.rank}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{meta.name}</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {meta.subtitle} · {meta.actionGuide.split('!')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
              {pendingCount}개 남음
              {completedCount > 0 && (
                <span className="text-emerald-600 ml-1">({completedCount} 완료)</span>
              )}
            </span>
            <button
              onClick={() => onQuickAdd(quadrantId)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
              title={`${meta.rank} 과업 바로 등록`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
          {tasksList.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 bg-white/60">
              <p className="text-xs font-semibold text-slate-700 mb-1">
                등록된 {meta.name}가 없습니다.
              </p>
              <p className="text-[11px] text-slate-600 mb-3">
                {quadrantId === 'Q1'
                  ? '지금 바로 끝내야 할 긴급한 과제를 추가해보세요.'
                  : quadrantId === 'Q2'
                  ? '장기적인 시험 공부나 프로젝트를 계획해보세요.'
                  : '가볍게 처리할 일정을 추가해보세요.'}
              </p>
              <button
                onClick={() => onQuickAdd(quadrantId)}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>과업 추가</span>
              </button>
            </div>
          ) : (
            tasksList.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Visual Guide Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">
            📊 아이젠하워 4분면 우선순위 매트릭스
          </span>
          <span aria-hidden="true">·</span>
          <span>중요도와 시급성에 따라 자동으로 분류된 4분면 뷰</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 1순위: 최우선
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> 2순위: 계획
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 3순위: 신속
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> 4순위: 여유
          </span>
        </div>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Q1: 1순위 최우선 과제 (중요함 + 시급함) */}
        {renderQuadrant(
          'Q1',
          q1Tasks,
          <Flame className="w-5 h-5 text-rose-500" />,
          'border-rose-200',
          'bg-rose-50/40'
        )}

        {/* Q2: 2순위 계획 집중 과제 (중요함 + 여유있음) */}
        {renderQuadrant(
          'Q2',
          q2Tasks,
          <CalendarClock className="w-5 h-5 text-indigo-500" />,
          'border-indigo-200',
          'bg-indigo-50/40'
        )}

        {/* Q3: 3순위 신속 처리 과제 (안 중요함 + 시급함) */}
        {renderQuadrant(
          'Q3',
          q3Tasks,
          <Zap className="w-5 h-5 text-amber-500" />,
          'border-amber-200',
          'bg-amber-50/40'
        )}

        {/* Q4: 4순위 여유 과제 (안 중요함 + 여유있음) */}
        {renderQuadrant(
          'Q4',
          q4Tasks,
          <Clock className="w-5 h-5 text-slate-500" />,
          'border-slate-200',
          'bg-slate-50/60'
        )}
      </div>
    </div>
  );
};
