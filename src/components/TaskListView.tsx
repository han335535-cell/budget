import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { TaskCard } from './TaskCard';
import { calculateDDay, getQuadrant } from '../utils/dday';

interface TaskListViewProps {
  tasks: Task[];
  onToggleComplete: (id: string, e?: React.MouseEvent) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'today' | 'urgent3' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dday' | 'date'>('priority');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchSubject = task.subject?.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchSubject && !matchDesc) return false;
      }

      // Status Filter
      const dday = calculateDDay(task.dueDate);
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'today' && (dday.diff !== 0 || task.completed)) return false;
      if (statusFilter === 'urgent3' && (dday.diff > 3 || dday.diff < 0 || task.completed)) return false;

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Completed always down
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === 'priority') {
        // Priority Quadrant ranking: Q1 (1) -> Q2 (2) -> Q3 (3) -> Q4 (4)
        const quadWeights: Record<string, number> = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
        const quadA = getQuadrant(a.isImportant, a.isUrgent);
        const quadB = getQuadrant(b.isImportant, b.isUrgent);
        if (quadWeights[quadA] !== quadWeights[quadB]) {
          return quadWeights[quadA] - quadWeights[quadB];
        }
        // Subsort by D-day diff
        return calculateDDay(a.dueDate).diff - calculateDDay(b.dueDate).diff;
      } else if (sortBy === 'dday') {
        // Closest D-Day first
        return calculateDDay(a.dueDate).diff - calculateDDay(b.dueDate).diff;
      } else {
        // Due Date chronological
        return a.dueDate.localeCompare(b.dueDate);
      }
    });
  }, [filteredTasks, sortBy]);

  const categories = ['과제', '시험', '수행평가', '동아리', '학교행사', '개인공부'];

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="과업명, 과목, 메모 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> 정렬:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'dday' | 'date')}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="priority">우선순위순 (1순위 최우선 → 4순위)</option>
              <option value="dday">D-Day 마감 임박순</option>
              <option value="date">날짜순 (가장 빠른 일정부터)</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              전체 ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              진행 중 ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'today'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
              }`}
            >
              오늘 마감 (D-Day)
            </button>
            <button
              onClick={() => setStatusFilter('urgent3')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'urgent3'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              D-3 이내 임박
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              완료됨 ({tasks.filter((t) => t.completed).length})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-600 font-semibold">분류:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">모든 분류</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="space-y-2.5">
        {sortedTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 mb-1">
              조건에 맞는 일정이 없습니다
            </h4>
            <p className="text-xs text-slate-600">
              필터를 변경하거나 새로운 학교 과업을 등록해보세요!
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
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
