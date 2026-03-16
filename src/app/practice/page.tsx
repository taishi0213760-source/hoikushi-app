"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import { questions } from "@/data/questions";
import { saveRecord, getTodayStr } from "@/lib/storage";
import { getDaysUntilExam, getNextExam } from "@/data/examDates";

type Phase = "menu" | "quiz" | "result";

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
  { id: "all", label: "全科目ランダム", description: "全問題からランダムに出題", icon: "🎲" },
  { id: "psychology", label: "保育の心理学", description: "心理学分野を集中演習", icon: "🧠" },
];

export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [quizList, setQuizList] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedSet, setSelectedSet] = useState("");

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

  const scorePercent = Math.round((correctCount / quizList.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-orange-700">⚡ 直前対策</h1>
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

            {/* 演習セット */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-bold text-gray-800 mb-3 text-sm">演習セットを選ぶ</h2>
              <div className="flex flex-col gap-3">
                {PRACTICE_SETS.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => handleStart(set.id)}
                    className="w-full flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                  >
                    <span className="text-3xl shrink-0">{set.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{set.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{set.description}</p>
                    </div>
                    <span className="ml-auto text-gray-300 text-lg">›</span>
                  </button>
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
