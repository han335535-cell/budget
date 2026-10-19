import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { Task, TaskCategory, PriorityQuadrant } from '../types';
import { getQuadrant, QUADRANT_CONFIGS } from '../utils/dday';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>, editId?: string) => void;
  taskToEdit?: Task | null;
  defaultQuadrant?: PriorityQuadrant;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultQuadrant,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('과제');
  const [subject, setSubject] = useState('수학');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');

  // Core requirement: 중요함/안중요함, 시급함/여유있음
  const [isImportant, setIsImportant] = useState(true);
  const [isUrgent, setIsUrgent] = useState(true);

  // Initialize form state
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setSubject(taskToEdit.subject || '');
      setDueDate(taskToEdit.dueDate);
      setDueTime(taskToEdit.dueTime || '23:59');
      setIsImportant(taskToEdit.isImportant);
      setIsUrgent(taskToEdit.isUrgent);
    } else {
      // Default to today
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      setDueDate(`${yyyy}-${mm}-${dd}`);
      setDueTime('23:59');
      setTitle('');
      setDescription('');
      setCategory('과제');
      setSubject('수학');

      if (defaultQuadrant === 'Q1') {
        setIsImportant(true);
        setIsUrgent(true);
      } else if (defaultQuadrant === 'Q2') {
        setIsImportant(true);
        setIsUrgent(false);
      } else if (defaultQuadrant === 'Q3') {
        setIsImportant(false);
        setIsUrgent(true);
      } else if (defaultQuadrant === 'Q4') {
        setIsImportant(false);
        setIsUrgent(false);
      } else {
        setIsImportant(true);
        setIsUrgent(true);
      }
    }
  }, [taskToEdit, defaultQuadrant, isOpen]);

  if (!isOpen) return null;

  // Auto-calculated quadrant based on importance & urgency
  const currentQuadrant = getQuadrant(isImportant, isUrgent);
  const quadConfig = QUADRANT_CONFIGS[currentQuadrant];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        subject: subject.trim() || undefined,
        dueDate,
        dueTime: dueTime || undefined,
        isImportant,
        isUrgent,
      },
      taskToEdit?.id
    );
    onClose();
  };

  // Quick date selector helper
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
  };

  const categories: TaskCategory[] = [
    '과제',
    '시험',
    '수행평가',
    '동아리',
    '학교행사',
    '개인공부',
    '기타',
  ];

  const subjects = ['수학', '국어', '영어', '과학', '사회', '역사', '정보/코딩', '체육', '음악/미술', '진로', '학급'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {taskToEdit ? '학교 일정·과업 수정' : '새 학교 일정·과업 등록'}
              </h3>
              <p className="text-xs text-slate-500">
                중요도와 시급성을 설정하면 우선순위가 자동 분류됩니다.
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              일정 및 과업명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 수학 중간고사 대비 오답노트 정리, 영어 발표 PPT 작성"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Category & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                과업 분류
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                과목 / 활동
              </label>
              <input
                type="text"
                list="subjects-list"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 수학, 영어, 과학 등"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="subjects-list">
                {subjects.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Due Date & Time */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                마감일 (D-Day 자동 계산) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  내일
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(3)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  3일 뒤
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  1주일 뒤
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* USER REQUIREMENT: 중요함/안중요함 & 시급함/여유있음 옵션 설정 */}
          {/* ======================================================== */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                우선순위 자동 분류 설정 (아이젠하워 매트릭스)
              </h4>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                자동 분류 엔진
              </span>
            </div>

            {/* 1. 중요도 (Important vs Not Important) */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-2">
                1) 중요도 설정:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportant(true)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isImportant
                      ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-200 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>🔥 중요함</span>
                    {isImportant && <Check className="w-3.5 h-3.5 text-rose-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    성적, 입시, 핵심 학업에 직결되는 중요한 일
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportant(false)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !isImportant
                      ? 'bg-sky-50 border-sky-300 text-sky-900 ring-2 ring-sky-200 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>☕ 안 중요함</span>
                    {!isImportant && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    단순 참고, 가벼운 활동, 부차적인 업무
                  </p>
                </button>
              </div>
            </div>

            {/* 2. 시급성 (Urgent vs Not Urgent) */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-2">
                2) 시급성 설정:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUrgent(true)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isUrgent
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-200 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>⚡ 시급함</span>
                    {isUrgent && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    마감이 임박하여 오늘/내일 즉시 시작해야 함
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsUrgent(false)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !isUrgent
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-200 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>🌱 여유있음</span>
                    {!isUrgent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    마감에 여유가 있어 계획적으로 준비 가능
                  </p>
                </button>
              </div>
            </div>

            {/* Live Priority Result Feedback Banner */}
            <div
              className={`p-3 rounded-xl border transition-all ${quadConfig.bgLightClass} ${quadConfig.borderClass}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${quadConfig.badgeClass}`}>
                    {quadConfig.rank} · {quadConfig.id}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {quadConfig.name} ({quadConfig.subtitle})
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700">자동 판정 완료</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                👉 {quadConfig.actionGuide}
              </p>
            </div>
          </div>

          {/* Description / Memo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              세부 준비물 및 메모 (선택)
            </label>
            <textarea
              rows={2}
              placeholder="제출처, 준비물, 시험 범위, 참고 링크 등을 적어두세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all"
            >
              {taskToEdit ? '수정 완료' : '일정 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
