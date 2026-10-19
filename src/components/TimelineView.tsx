import React, { useMemo } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { calculateDDay, formatKoreanDate } from '../utils/dday';

interface TimelineViewProps {
  tasks: Task[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  // Group tasks by dueDate
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      if (!groups[task.dueDate]) {
        groups[task.dueDate] = [];
      }
      groups[task.dueDate].push(task);
    });

    // Sort dates
    const sortedDates = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    return sortedDates.map((date) => ({
      date,
      dday: calculateDDay(date),
      tasks: groups[date],
    }));
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-slate-700 px-1">
        <span className="font-bold text-slate-900">
          📅 날짜별 학교 스케줄 타임라인
        </span>
        <span className="text-slate-700 font-medium">
          D-Day 기준으로 정렬된 마감 캘린더
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100 space-y-8 ml-2">
        {groupedTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500">등록된 일정이 없습니다.</p>
          </div>
        ) : (
          groupedTasks.map(({ date, dday, tasks: dayTasks }) => {
            const isToday = dday.diff === 0;
            const completedCount = dayTasks.filter((t) => t.completed).length;

            return (
              <div key={date} className="relative">
                {/* Timeline Node Icon */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center transition-colors ${
                    isToday
                      ? 'border-rose-500 text-rose-500 shadow-sm ring-4 ring-rose-100'
                      : dday.diff < 0
                      ? 'border-red-400 text-red-500'
                      : 'border-indigo-400 text-indigo-600'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isToday ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                  />
                </div>

                {/* Date Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {formatKoreanDate(date)}
                    </h3>
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-md ${dday.colorClasses.badgeBg}`}
                    >
                      {dday.text} ({dday.label})
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-700">
                    {dayTasks.length}개 일정 중 {completedCount}개 완료
                  </span>
                </div>

                {/* Day Tasks Cards */}
                <div className="space-y-2.5">
                  {dayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
