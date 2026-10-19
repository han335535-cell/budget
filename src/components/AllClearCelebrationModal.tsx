import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Check,
  Copy,
  ThumbsUp,
  RefreshCw,
  Award,
} from 'lucide-react';
import { ALL_CLEAR_PRAISES, speakPraiseKorean, stopSpeaking, triggerCelebrationConfetti, triggerMiniConfetti } from '../utils/praise';
import { soundEffects } from '../utils/audio';

interface AllClearCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedCount: number;
}

export const AllClearCelebrationModal: React.FC<AllClearCelebrationModalProps> = ({
  isOpen,
  onClose,
  completedCount,
}) => {
  const [selectedTone, setSelectedTone] = useState<'mentor' | 'coach' | 'friend' | 'teacher'>('mentor');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [claps, setClaps] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pick praise matching current tone
  const currentPraise =
    ALL_CLEAR_PRAISES.find((p) => p.tone === selectedTone) || ALL_CLEAR_PRAISES[0];

  useEffect(() => {
    if (isOpen) {
      triggerCelebrationConfetti();
      soundEffects.playFanfare();
      setClaps(1);
    } else {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const fullText = `${currentPraise.title}. ${currentPraise.message}`;
      const started = speakPraiseKorean(fullText);
      if (started) {
        setIsSpeaking(true);
        // Reset speech state after reasonable duration
        setTimeout(() => setIsSpeaking(false), 15000);
      }
    }
  };

  const handleClap = (e: React.MouseEvent) => {
    setClaps((prev) => prev + 1);
    soundEffects.playSparkle();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerMiniConfetti(x, y);
  };

  const handleCopy = () => {
    const textToCopy = `[스쿨플래너 성취 인정서]\n✨ ${currentPraise.title}\n\n"${currentPraise.message}"\n\n- ${currentPraise.quote || ''}\n(오늘 ${completedCount}개의 모든 학업 과업을 완벽히 마쳤습니다!)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toneOptions = [
    { key: 'mentor', label: '🌟 따뜻한 멘토', desc: '깊은 존중과 지혜' },
    { key: 'coach', label: '🔥 열정 코치', desc: '자신감 폭발 에너지' },
    { key: 'friend', label: '☕ 다정한 친구', desc: '마음 편한 위로와 공감' },
    { key: 'teacher', label: '🎓 자상한 선생님', desc: '성실함에 대한 인정' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-amber-200/80">
        {/* Background decorative glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-100/70 via-indigo-50/50 to-transparent pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-200">
              <Trophy className="w-6 h-6 animate-bounce" />
            </span>
            <div>
              <span className="text-xs font-black tracking-wider text-amber-600 uppercase">
                ALL CLEAR · 인정의 전당
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                오늘의 모든 과업 올클리어! 🎉
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector Tabs */}
        <div className="relative px-6 pt-2 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">
              칭찬의 목소리 선택 (나에게 맞는 위로 고르기):
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {toneOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setSelectedTone(opt.key);
                  if (isSpeaking) {
                    stopSpeaking();
                    setIsSpeaking(false);
                  }
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedTone === opt.key
                    ? 'bg-amber-50/90 border-amber-400 text-amber-950 ring-2 ring-amber-200 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-600 truncate">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Praise Card Body (The heartfelt recognition letter) */}
        <div className="px-6 py-2">
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/30 to-indigo-50/60 border border-amber-200/90 shadow-sm text-slate-800">
            {/* Stamp Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 rotate-6 pointer-events-none">
              <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-amber-600 text-amber-700 font-black text-center p-1 bg-white/80 shadow-xs">
                <span className="text-[10px] tracking-widest uppercase">참 잘했어요</span>
                <span className="text-xs sm:text-sm font-black">100점 만점</span>
                <span className="text-[9px] text-amber-600">인정 보증</span>
              </div>
            </div>

            {/* Praise Category & Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300">
                {currentPraise.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                총 {completedCount}개 과업 완수
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4 pr-16 leading-snug">
              "{currentPraise.title}"
            </h3>

            {/* Warm Affectionate Message */}
            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-700 mb-6 bg-white/70 p-4 sm:p-5 rounded-xl border border-amber-100">
              <p className="font-normal">{currentPraise.message}</p>
            </div>

            {/* Motivational Quote */}
            {currentPraise.quote && (
              <div className="border-t border-amber-200/70 pt-4 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold text-amber-900 italic">
                  "{currentPraise.quote}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Praise Actions & Recognition Boosters */}
        <div className="p-6 pt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Clapping counter */}
            <button
              onClick={handleClap}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-sm transition-all active:scale-95 shadow-xs"
              title="오늘 최선을 다한 나에게 아낌없는 박수 보내기"
            >
              <span className="text-lg">👏</span>
              <span>나에게 박수 보내기</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-black">
                {claps}회
              </span>
            </button>

            {/* Audio Speech toggle */}
            <button
              onClick={handleToggleSpeak}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                isSpeaking
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md animate-pulse'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
              title="따뜻한 한국어 음성으로 칭찬 메시지 듣기"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>음성 정지하기</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>목소리로 듣기 (TTS)</span>
                </>
              )}
            </button>

            {/* Copy / Save Recognition */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors border border-slate-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '복사 완료!' : '칭찬 인정서 복사'}</span>
            </button>
          </div>

          {/* Bottom dismiss */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              기분 좋게 확인 완료 ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
