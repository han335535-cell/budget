import React from 'react';
import { Check, Edit2, Trash2, Clock, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { calculateDDay, formatKoreanDate, getQuadrant, QUADRANT_CONFIGS } from '../utils/dday';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const dday = calculateDDay(task.dueDate);
  const quadrant = getQuadrant(task.isImportant, task.isUrgent);
  const quadConfig = QUADRANT_CONFIGS[quadrant];

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200 opacity-70'
          : `hover:shadow-md hover:-translate-y-0.5 ${quadConfig.cardAccentClass} ${
              dday.status === 'today' ? 'border-rose-300 ring-1 ring-rose-200/50' : 'border-slate-200'
            }`
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start gap-3">
        {/* Satisfying interactive checkbox */}
        <button
          type="button"
          onClick={(e) => onToggleComplete(task.id, e)}
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-transparent'
          }`}
          title={task.completed ? '미완료로 변경' : '과업 완료 처리하기 (칭찬 팡팡!)'}
          aria-label={task.completed ? '완료 취소' : '과업 완료'}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          {/* Header Row: D-Day Badge & Metadata */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {/* D-Day badge - automatic high visibility */}
            <span
              className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                task.completed
                  ? 'bg-slate-100 text-slate-500 line-through'
                  : dday.colorClasses.badgeBg
              }`}
            >
              {dday.text}
            </span>

            {/* Priority Quadrant Badge */}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                task.completed ? 'bg-slate-100 text-slate-400' : quadConfig.badgeClass
              }`}
            >
              {quadConfig.rank}
            </span>

            {/* Subject / Category inline metadata (Zero-pill text separator) */}
            <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium ml-1">
              {task.subject && (
                <>
                  <span className="font-semibold text-slate-700">{task.subject}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{task.category}</span>
            </div>
          </div>

          {/* Task Title */}
          <h4
            className={`text-sm font-bold tracking-tight mb-1 text-slate-900 break-words ${
              task.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && !compact && (
            <p
              className={`text-xs text-slate-700 mb-2 line-clamp-2 leading-relaxed ${
                task.completed ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Bottom Row: Due Date & Action Buttons */}
          <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>
                {formatKoreanDate(task.dueDate)} {task.dueTime ? `${task.dueTime}까지` : ''}
              </span>
            </div>

            {/* Action buttons (revealed on hover or focus) */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                title="수정"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="p-1 rounded-md text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
