"use client";

import { useState } from "react";
import { Question } from "@/data/questions";

type Props = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: (isCorrect: boolean) => void;
};

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onNext,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const isAnswered = selected !== null;
  const isCorrect = selected === question.correctLabel;

  const handleSelect = (label: string) => {
    if (!isAnswered) setSelected(label);
  };

  const choiceBorderStyle = (label: string): string => {
    if (!isAnswered) {
      return "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-[0.99]";
    }
    if (label === question.correctLabel) {
      return "bg-green-50 border-2 border-green-500";
    }
    if (label === selected) {
      return "bg-red-50 border-2 border-red-400";
    }
    return "bg-white border-2 border-gray-200";
  };

  const choiceTextStyle = (label: string): string => {
    if (!isAnswered) return "text-gray-800";
    if (label === question.correctLabel) return "text-green-800";
    if (label === selected) return "text-red-700";
    return "text-gray-800";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 進捗バー */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {questionNumber} / {totalQuestions}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 科目・出典 */}
      <div className="flex flex-col gap-1">
        <span className="inline-block self-start bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          {question.subject}
        </span>
        <span className="text-xs text-gray-400">{question.source}</span>
      </div>

      {/* 問題文 */}
      <p className="text-sm font-medium text-gray-800 leading-relaxed border-l-4 border-blue-400 pl-3">
        {question.text}
      </p>

      {/* 選択肢 */}
      <div className="flex flex-col gap-2">
        {question.choices.map((choice) => (
          <div key={choice.label}>
            <button
              onClick={() => handleSelect(choice.label)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${choiceBorderStyle(choice.label)}`}
            >
              <div className="flex items-start gap-2">
                {/* ラベル */}
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                    ${
                      !isAnswered
                        ? "border-gray-300 text-gray-500"
                        : choice.label === question.correctLabel
                        ? "bg-green-500 border-green-500 text-white"
                        : choice.label === selected
                        ? "bg-red-400 border-red-400 text-white"
                        : "border-gray-300 text-gray-600"
                    }`}
                >
                  {choice.label}
                </span>

                {/* 選択肢テキスト */}
                <span
                  className={`text-sm leading-relaxed ${choiceTextStyle(choice.label)}`}
                >
                  {choice.text}
                </span>

                {/* 正解・不正解アイコン */}
                {isAnswered && choice.label === question.correctLabel && (
                  <span className="shrink-0 ml-auto text-green-600 font-bold text-sm">
                    ✓
                  </span>
                )}
                {isAnswered &&
                  choice.label === selected &&
                  choice.label !== question.correctLabel && (
                    <span className="shrink-0 ml-auto text-red-500 font-bold text-sm">
                      ✗
                    </span>
                  )}
              </div>
            </button>

            {/* 各選択肢の解説（回答後に表示） */}
            {isAnswered && (
              <div
                className={`mt-1 mx-1 px-3 py-2 rounded-lg text-xs leading-relaxed
                  ${
                    choice.label === question.correctLabel
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : choice.label === selected
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-gray-50 text-gray-800 border border-gray-200"
                  }`}
              >
                {choice.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 結果サマリー */}
      {isAnswered && (
        <div
          className={`p-3 rounded-xl text-center font-bold text-sm
            ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {isCorrect ? "正解！よくできました" : `不正解... 正解は「${question.correctLabel}」でした`}
        </div>
      )}

      {/* 次へボタン */}
      {isAnswered && (
        <button
          onClick={() => onNext(isCorrect)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          {questionNumber < totalQuestions ? "次の問題へ →" : "結果を見る"}
        </button>
      )}
    </div>
  );
}
