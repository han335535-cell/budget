import React from 'react';
import { Sparkles, Calendar, Plus, Trophy, Volume2, VolumeX, HeartHandshake } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  onOpenNewTaskModal: () => void;
  onOpenPraiseArchive: () => void;
  onTriggerRandomPraise: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  todayCount: number;
  totalPendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewTaskModal,
  onOpenPraiseArchive,
  onTriggerRandomPraise,
  soundEnabled,
  onToggleSound,
  todayCount,
  totalPendingCount,
}) => {
  const today = new Date();
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${dayNames[today.getDay()]}`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  스쿨플래너 <span className="text-indigo-600 font-black">D-Day</span>
                </h1>
                <span className="hidden md:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  우선순위 매트릭스 & 인정칭찬
                </span>
              </div>
              <p className="text-xs text-slate-700 flex items-center gap-1.5 mt-0.5">
                <span>{formattedDate}</span>
                <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
                <span className="font-semibold text-slate-700">
                  남은 일정 <strong className="text-indigo-600 font-bold">{totalPendingCount}</strong>개
                </span>
                {todayCount > 0 && (
                  <>
                    <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
                    <span className="text-rose-600 font-semibold">오늘 마감 {todayCount}건!</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                soundEffects.enabled = !soundEnabled;
              }}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                soundEnabled
                  ? 'text-indigo-700 bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100'
                  : 'text-slate-400 bg-slate-50 border-slate-200 hover:text-slate-600'
              }`}
              title={soundEnabled ? '효과음 켜짐 (클릭하여 끄기)' : '효과음 꺼짐 (클릭하여 켜기)'}
              aria-label="효과음 설정"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Praise Vending Machine (칭찬 받기) */}
            <button
              onClick={onTriggerRandomPraise}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all hover:shadow-xs active:scale-95"
              title="지치고 힘들 때 나를 위로해주는 따뜻한 칭찬 메시지"
            >
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>칭찬 한마디 받기</span>
            </button>

            {/* Praise & Achievements archive */}
            <button
              onClick={onOpenPraiseArchive}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
              title="나의 칭찬 보관함 & 성취 뱃지"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">명예의 전당</span>
              <span className="md:hidden">성취</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>일정·과업 등록</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
