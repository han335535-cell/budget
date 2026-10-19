import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Grid,
  ListTodo,
  CalendarDays,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  Clock,
  Heart,
  Plus,
} from 'lucide-react';
import { Task, PriorityQuadrant, AchievementBadge } from './types';
import { getInitialTasks } from './data/initialTasks';
import { calculateDDay, getQuadrant } from './utils/dday';
import {
  INITIAL_ACHIEVEMENTS,
  TASK_COMPLETION_PRAISES,
  triggerCelebrationConfetti,
  triggerMiniConfetti,
} from './utils/praise';
import { soundEffects } from './utils/audio';

import { Header } from './components/Header';
import { DDayAlertBanner } from './components/DDayAlertBanner';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { TaskListView } from './components/TaskListView';
import { TimelineView } from './components/TimelineView';
import { TaskModal } from './components/TaskModal';
import { AllClearCelebrationModal } from './components/AllClearCelebrationModal';
import { PraiseArchiveModal } from './components/PraiseArchiveModal';
import { PraiseToast } from './components/PraiseToast';

type ViewMode = 'matrix' | 'list' | 'timeline';

export default function App() {
  // Load tasks from localStorage or default sample data
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('school_planner_tasks_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return getInitialTasks();
  });

  // Achievements state
  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem('school_planner_badges_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // App UI states
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultQuadrantForNew, setDefaultQuadrantForNew] = useState<PriorityQuadrant>('Q1');
  const [isAllClearModalOpen, setIsAllClearModalOpen] = useState(false);
  const [isPraiseArchiveOpen, setIsPraiseArchiveOpen] = useState(false);

  // Toast praise state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem('school_planner_tasks_v1', JSON.stringify(tasks));
    } catch {
      // Ignore
    }
  }, [tasks]);

  // Persist achievements
  useEffect(() => {
    try {
      localStorage.setItem('school_planner_badges_v1', JSON.stringify(achievements));
    } catch {
      // Ignore
    }
  }, [achievements]);

  // Helper to show transient toast praise
  const showToastPraise = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Evaluate & unlock achievements
  const checkAchievements = (updatedTasks: Task[]) => {
    const completed = updatedTasks.filter((t) => t.completed);
    const newAchievements = achievements.map((badge) => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      if (badge.id === 'first-step' && completed.length >= 1) {
        shouldUnlock = true;
      } else if (
        badge.id === 'd-day-conqueror' &&
        completed.some((t) => calculateDDay(t.dueDate).diff === 0)
      ) {
        shouldUnlock = true;
      } else if (
        badge.id === 'q1-master' &&
        completed.filter((t) => t.isImportant && t.isUrgent).length >= 2
      ) {
        shouldUnlock = true;
      } else if (
        badge.id === 'all-clear-hero' &&
        updatedTasks.length > 0 &&
        updatedTasks.every((t) => t.completed)
      ) {
        shouldUnlock = true;
      } else if (
        badge.id === 'planner-king' &&
        completed.some((t) => t.isImportant && !t.isUrgent)
      ) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        return {
          ...badge,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }
      return badge;
    });

    setAchievements(newAchievements);
  };

  // Toggle task completion
  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const willBeCompleted = !targetTask.completed;

    if (willBeCompleted) {
      // 1. Play sound
      soundEffects.playCheck();

      // 2. Spawn micro-confetti
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        triggerMiniConfetti(x, y);
      } else {
        triggerMiniConfetti(0.5, 0.5);
      }

      // 3. Random cheerful praise message
      const randomPraise =
        TASK_COMPLETION_PRAISES[Math.floor(Math.random() * TASK_COMPLETION_PRAISES.length)];
      showToastPraise(randomPraise);
    }

    const updatedTasks = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    checkAchievements(updatedTasks);

    // If all tasks are now completed, trigger Grand All Clear Celebration!
    const allDone = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);
    if (willBeCompleted && allDone) {
      setTimeout(() => {
        setIsAllClearModalOpen(true);
      }, 500);
    }
  };

  // Task save handler (Add or Edit)
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Edit
      const updated = tasks.map((t) => (t.id === editId ? { ...t, ...taskData } : t));
      setTasks(updated);
      showToastPraise('일정이 성공적으로 수정되었습니다.');
    } else {
      // Add
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
      soundEffects.playSparkle();
      showToastPraise('새 일정이 우선순위 매트릭스에 등록되었습니다!');
    }
    setTaskToEdit(null);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      showToastPraise('일정이 삭제되었습니다.');
    }
  };

  // Reset to initial sample tasks
  const handleResetData = () => {
    if (window.confirm('기본 예시 학교 일정 데이터로 다시 초기화할까요?')) {
      const init = getInitialTasks();
      setTasks(init);
      setAchievements(INITIAL_ACHIEVEMENTS);
      localStorage.removeItem('school_planner_tasks_v1');
      localStorage.removeItem('school_planner_badges_v1');
      showToastPraise('예시 일정이 새롭게 로드되었습니다.');
    }
  };

  // Counts
  const todayTasks = tasks.filter(
    (t) => !t.completed && calculateDDay(t.dueDate).diff === 0
  );
  const totalPending = tasks.filter((t) => !t.completed).length;
  const totalCompleted = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Sticky Header */}
      <Header
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setDefaultQuadrantForNew('Q1');
          setIsTaskModalOpen(true);
        }}
        onOpenPraiseArchive={() => setIsPraiseArchiveOpen(true)}
        onTriggerRandomPraise={() => setIsPraiseArchiveOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        todayCount={todayTasks.length}
        totalPendingCount={totalPending}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* D-Day Alert & Urgency Banner (화면에서 자동으로 일정을 띄워주는 배너) */}
        <DDayAlertBanner
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onSelectTask={(task) => {
            setTaskToEdit(task);
            setIsTaskModalOpen(true);
          }}
        />

        {/* View Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                viewMode === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>우선순위 4분면 매트릭스</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>스마트 목록 뷰</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>D-Day 캘린더 타임라인</span>
            </button>
          </div>

          {/* Quick Actions (All Clear Modal trigger if all done, or preview praise) */}
          <div className="flex items-center gap-2">
            {totalCompleted > 0 && totalPending === 0 && (
              <button
                onClick={() => setIsAllClearModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 shadow-xs animate-pulse transition-all"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>올클리어 축하장 다시보기</span>
              </button>
            )}

            <button
              onClick={() => {
                setTaskToEdit(null);
                setDefaultQuadrantForNew('Q1');
                setIsTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>새 과업 추가</span>
            </button>
          </div>
        </div>

        {/* View Contents */}
        {viewMode === 'matrix' && (
          <EisenhowerMatrix
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onQuickAdd={(quadrant) => {
              setTaskToEdit(null);
              setDefaultQuadrantForNew(quadrant);
              setIsTaskModalOpen(true);
            }}
          />
        )}

        {viewMode === 'list' && (
          <TaskListView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
        )}

        {viewMode === 'timeline' && (
          <TimelineView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">스쿨플래너 D-Day</span>
            <span>·</span>
            <span>학업 우선순위 매트릭스 & 따뜻한 칭찬 인정 서비스</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 font-medium"
              title="예시 데이터로 리셋"
            >
              <RotateCcw className="w-3 h-3" />
              <span>예시 일정 불러오기</span>
            </button>
            <span>·</span>
            <span className="text-slate-400">데이터는 브라우저에 안전하게 보관됩니다.</span>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultQuadrant={defaultQuadrantForNew}
      />

      <AllClearCelebrationModal
        isOpen={isAllClearModalOpen}
        onClose={() => setIsAllClearModalOpen(false)}
        completedCount={totalCompleted}
      />

      <PraiseArchiveModal
        isOpen={isPraiseArchiveOpen}
        onClose={() => setIsPraiseArchiveOpen(false)}
        tasks={tasks}
        achievements={achievements}
      />

      <PraiseToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
