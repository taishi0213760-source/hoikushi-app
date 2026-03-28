"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import { questions } from "@/data/questions";
import { saveRecord, getTodayStr } from "@/lib/storage";
import { getDaysUntilExam, getNextExam } from "@/data/examDates";

type Phase = "menu" | "quiz" | "result" | "practical";

// 問題をシャッフル
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PRACTICE_SETS = [
  { id: "all", label: "全科目ランダム", description: "全問題からランダムに出題", icon: "casino" },
  { id: "psychology", label: "保育の心理学", description: "心理学分野を集中演習", icon: "psychology" },
];

// 実技試験の種別と対策ポイント
const PRACTICAL_TYPES = [
  {
    id: "music",
    label: "音楽表現",
    icon: "music_note",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    description: "ピアノ伴奏しながら歌う（課題曲2曲）",
    tips: [
      "課題曲を繰り返し練習して、安定したテンポで弾けるようにしよう",
      "弾き歌いは「歌いながら弾く」がポイント。声が小さくならないよう注意",
      "受験者と子どもたちの前での演奏を意識して練習する",
      "間違えても止まらず、笑顔で続けることが大切",
      "ピアノが苦手な場合はギター・アコーディオンも選択可能",
    ],
  },
  {
    id: "art",
    label: "造形表現",
    icon: "palette",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    description: "保育の場面を色鉛筆で描く（45分・A4用紙）",
    tips: [
      "人物（子ども・保育士）を正確に描く練習をしよう",
      "背景・小物も含めて画面全体を使って描くこと",
      "色鉛筆は豊富な色数を持参するのがおすすめ（36色以上）",
      "試験当日は課題が当日発表。様々な保育シーンを練習しておこう",
      "時間配分：下書き10分→彩色30分→仕上げ5分が目安",
    ],
  },
  {
    id: "language",
    label: "言語表現",
    icon: "record_voice_over",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description: "課題のお話を3分間で語る（絵本・道具なし）",
    tips: [
      "課題の素話（すばなし）4題から当日1題選択して3分間語る",
      "絵本や小道具は使用不可。身振り手振りと声のトーンで表現する",
      "3分間でちょうど終わるよう練習しよう（時間オーバーに注意）",
      "子どもに語りかけるイメージで、ゆっくりはっきり話す",
      "繰り返しの表現やオノマトペを活かして表情豊かに",
    ],
  },
];

export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [quizList, setQuizList] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedSet, setSelectedSet] = useState("");
  const [expandedPractical, setExpandedPractical] = useState<string | null>(null);

  const days = getDaysUntilExam();
  const next = getNextExam();
  const isUrgent = days !== null && days <= 30;

  const handleStart = (setId: string) => {
    const list = shuffle(questions);
    setQuizList(list);
    setSelectedSet(setId);
    setCurrentIndex(0);
    setCorrectCount(0);
    setPhase("quiz");
  };

  const handleNext = (isCorrect: boolean) => {
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    if (currentIndex + 1 < quizList.length) {
      setCorrectCount(newCorrect);
      setCurrentIndex(currentIndex + 1);
    } else {
      setCorrectCount(newCorrect);
      saveRecord({
        date: getTodayStr(),
        subject: selectedSet === "psychology" ? "保育の心理学" : "全科目",
        mode: "practice",
        total: quizList.length,
        correct: newCorrect,
      });
      setPhase("result");
    }
  };

  const handleRetry = () => {
    setPhase("menu");
  };

  const togglePractical = (id: string) => {
    setExpandedPractical((prev) => (prev === id ? null : id));
  };

  const scorePercent = Math.round((correctCount / quizList.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-orange-700">直前対策</h1>
          <p className="text-sm text-gray-500 mt-1">過去問を繰り返し解いて本番に備えよう</p>
        </div>

        {/* メニュー画面 */}
        {phase === "menu" && (
          <div className="flex flex-col gap-4">
            {/* 直前期バナー */}
            {next && days !== null && (
              <div
                className={`rounded-2xl p-4 text-center ${
                  isUrgent
                    ? "bg-orange-500 text-white"
                    : "bg-white border border-orange-200 text-orange-700"
                }`}
              >
                {isUrgent ? (
                  <>
                    <p className="font-bold text-lg">🔥 直前期です！</p>
                    <p className="text-sm mt-1 opacity-90">
                      {next.year} {next.term} まで残り <strong>{days}日</strong>
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      今すぐ過去問を集中的に解こう
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-sm">
                      {next.year} {next.term} まで残り <strong>{days}日</strong>
                    </p>
                    <p className="text-xs mt-1 text-orange-500">
                      残り30日を切ると直前モードが解禁されます
                    </p>
                  </>
                )}
              </div>
            )}

            {/* 筆記試験 演習セット */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-bold text-gray-800 mb-1 text-sm">📝 筆記試験対策</h2>
              <p className="text-xs text-gray-400 mb-3">演習セットを選ぶ</p>
              <div className="flex flex-col gap-3">
                {PRACTICE_SETS.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => handleStart(set.id)}
                    className="w-full flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                  >
                    <span
                      className="material-symbols-outlined text-orange-400 shrink-0"
                      style={{ fontSize: "28px" }}
                    >
                      {set.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{set.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{set.description}</p>
                    </div>
                    <span className="ml-auto text-gray-300 text-lg">›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 実技試験対策 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-bold text-gray-800 mb-1 text-sm">🎨 実技試験対策</h2>
              <p className="text-xs text-gray-400 mb-3">
                音楽・造形・言語から2つを選択して受験
              </p>
              <div className="flex flex-col gap-3">
                {PRACTICAL_TYPES.map((type) => (
                  <div key={type.id} className="border-2 border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => togglePractical(type.id)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-all text-left"
                    >
                      <span
                        className={`material-symbols-outlined ${type.color} shrink-0`}
                        style={{ fontSize: "28px" }}
                      >
                        {type.icon}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{type.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                      </div>
                      <span
                        className={`material-symbols-outlined text-gray-300 transition-transform ${
                          expandedPractical === type.id ? "rotate-180" : ""
                        }`}
                        style={{ fontSize: "20px" }}
                      >
                        expand_more
                      </span>
                    </button>
                    {expandedPractical === type.id && (
                      <div className={`${type.bg} border-t ${type.border} p-4`}>
                        <p className="text-xs font-semibold text-gray-600 mb-2">📌 対策ポイント</p>
                        <ul className="flex flex-col gap-2">
                          {type.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-gray-700 flex gap-1.5 items-start">
                              <span className="shrink-0 text-gray-400 font-bold">{i + 1}.</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 直前対策のポイント */}
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-4">
              <h2 className="font-bold text-orange-800 mb-2 text-sm">📌 直前対策のポイント</h2>
              <ul className="flex flex-col gap-1.5">
                {[
                  "同じ問題を何度も解いて解説を覚える",
                  "間違えた問題にはパターンがある",
                  "本番は60%以上で合格。苦手科目を底上げしよう",
                  "試験1週間前は新しい問題より復習を優先",
                ].map((tip, i) => (
                  <li key={i} className="text-xs text-orange-700 flex gap-1.5">
                    <span className="shrink-0 text-orange-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* クイズ画面 */}
        {phase === "quiz" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <QuizCard
              key={currentIndex}
              question={quizList[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={quizList.length}
              onNext={handleNext}
            />
          </div>
        )}

        {/* 結果画面 */}
        {phase === "result" && (
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-5">
            <div className="text-5xl">
              {scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "👍" : "📖"}
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">直前対策スコア</p>
              <p className="text-5xl font-bold text-orange-600 mt-1">
                {correctCount}
                <span className="text-2xl text-gray-400"> / {quizList.length}</span>
              </p>
              <p className="text-2xl font-semibold text-orange-400 mt-1">{scorePercent}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  scorePercent >= 80
                    ? "bg-green-500"
                    : scorePercent >= 60
                    ? "bg-orange-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {scorePercent >= 80
                ? "合格圏内！この調子でいこう 🔥"
                : scorePercent >= 60
                ? "合格ライン到達！さらに上を目指そう"
                : "もう一度チャレンジ！繰り返しが力になる"}
            </p>
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => handleStart(selectedSet)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                もう一度解く（シャッフル）
              </button>
              <button
                onClick={handleRetry}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                セット選択に戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
