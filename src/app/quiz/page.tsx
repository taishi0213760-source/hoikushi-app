"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import { questions, type Question } from "@/data/questions";
import { saveRecord, getTodayStr } from "@/lib/storage";

type Phase = "select" | "quiz" | "result";

// 保育士試験 9科目
const SUBJECTS = [
  { name: "保育の心理学", icon: "psychology" },
  { name: "保育原理", icon: "menu_book" },
  { name: "子ども家庭福祉", icon: "family_restroom" },
  { name: "社会福祉", icon: "volunteer_activism" },
  { name: "教育原理", icon: "school" },
  { name: "社会的養護", icon: "shield" },
  { name: "子どもの保健", icon: "health_and_safety" },
  { name: "子どもの食と栄養", icon: "nutrition" },
  { name: "保育実習理論", icon: "assignment" },
];

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [quizList, setQuizList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const getQuestionCount = (subjectName: string) =>
    questions.filter((q) => q.subject === subjectName).length;

  const handleSelectSubject = (subjectName: string) => {
    const filtered = questions.filter((q) => q.subject === subjectName);
    if (filtered.length === 0) return; // 問題なしは押せない
    setSelectedSubject(subjectName);
    setQuizList(filtered);
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
        subject: selectedSubject,
        mode: "quiz",
        total: quizList.length,
        correct: newCorrect,
      });
      setPhase("result");
    }
  };

  const handleRetry = () => {
    setPhase("select");
    setSelectedSubject("");
    setCurrentIndex(0);
    setCorrectCount(0);
  };

  const scorePercent =
    quizList.length > 0 ? Math.round((correctCount / quizList.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-blue-800">クイズ</h1>
          <p className="text-sm text-gray-500 mt-1">科目を選んでチャレンジしよう</p>
        </div>

        {/* 科目選択画面 */}
        {phase === "select" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500 text-center mb-1">科目を選んでください</p>
            {SUBJECTS.map((subject) => {
              const count = getQuestionCount(subject.name);
              const available = count > 0;
              return (
                <button
                  key={subject.name}
                  onClick={() => handleSelectSubject(subject.name)}
                  disabled={!available}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                    available
                      ? "border-blue-100 bg-white hover:border-blue-400 hover:shadow-sm active:scale-98"
                      : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined shrink-0 ${
                      available ? "text-blue-500" : "text-gray-400"
                    }`}
                    style={{ fontSize: "28px" }}
                  >
                    {subject.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm ${
                        available ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {subject.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {available ? `${count}問` : "準備中"}
                    </p>
                  </div>
                  {available && (
                    <span className="text-blue-300 text-lg shrink-0">›</span>
                  )}
                  {!available && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full shrink-0">
                      準備中
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* クイズ画面 */}
        {phase === "quiz" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-xs text-blue-600 font-medium mb-3">{selectedSubject}</p>
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
              <p className="text-xs text-gray-400 mb-1">{selectedSubject}</p>
              <p className="text-gray-500 text-sm">スコア</p>
              <p className="text-5xl font-bold text-blue-700 mt-1">
                {correctCount}
                <span className="text-2xl text-gray-400"> / {quizList.length}</span>
              </p>
              <p className="text-2xl font-semibold text-blue-500 mt-1">{scorePercent}%</p>
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
            <div className="w-full flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setCorrectCount(0);
                  setPhase("quiz");
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
              >
                もう一度チャレンジ
              </button>
              <button
                onClick={handleRetry}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                科目選択に戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
