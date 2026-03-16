"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import { questions } from "@/data/questions";

type Phase = "start" | "quiz" | "result";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const handleNext = (isCorrect: boolean) => {
    const newCorrect = correctCount + (isCorrect ? 1 : 0);

    if (currentIndex + 1 < questions.length) {
      setCorrectCount(newCorrect);
      setCurrentIndex(currentIndex + 1);
    } else {
      setCorrectCount(newCorrect);
      setPhase("result");
    }
  };

  const handleRetry = () => {
    setPhase("start");
    setCurrentIndex(0);
    setCorrectCount(0);
  };

  const scorePercent = Math.round((correctCount / questions.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">保育士試験 対策</h1>
          <p className="text-sm text-gray-500 mt-1">過去問チャレンジ</p>
        </div>

        {/* スタート画面 */}
        {phase === "start" && (
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-5">
            <div className="text-5xl">📚</div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800">
                保育の心理学
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                全 {questions.length} 問 · 4択
              </p>
            </div>
            <ul className="text-sm text-gray-600 bg-blue-50 rounded-xl p-4 w-full space-y-1">
              <li>・各問題から1つ選んで回答してください</li>
              <li>・回答後に解説が表示されます</li>
              <li>・最後に正答率が確認できます</li>
            </ul>
            <button
              onClick={() => setPhase("quiz")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              スタート
            </button>
          </div>
        )}

        {/* クイズ画面 */}
        {phase === "quiz" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <QuizCard
              key={currentIndex}
              question={questions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onNext={handleNext}
            />
          </div>
        )}

        {/* 結果画面 */}
        {phase === "result" && (
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-5">
            <div className="text-5xl">
              {scorePercent === 100
                ? "🎉"
                : scorePercent >= 60
                ? "👍"
                : "📖"}
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">スコア</p>
              <p className="text-5xl font-bold text-blue-700 mt-1">
                {correctCount}
                <span className="text-2xl text-gray-400">
                  {" "}
                  / {questions.length}
                </span>
              </p>
              <p className="text-2xl font-semibold text-blue-500 mt-1">
                {scorePercent}%
              </p>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  scorePercent === 100
                    ? "bg-green-500"
                    : scorePercent >= 60
                    ? "bg-blue-500"
                    : "bg-orange-400"
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>

            <p className="text-gray-600 text-sm text-center">
              {scorePercent === 100
                ? "全問正解！素晴らしい！"
                : scorePercent >= 60
                ? "あと少し！復習して再チャレンジしよう。"
                : "もう一度復習してみましょう。"}
            </p>

            <button
              onClick={handleRetry}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              もう一度チャレンジ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
