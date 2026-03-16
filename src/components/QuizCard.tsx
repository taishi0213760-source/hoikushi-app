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
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requiredCount = question.correctLabels.length;
  const isMultiple = requiredCount > 1;

  // 正解判定：選んだラベルと正解ラベルが完全一致
  const isCorrect =
    isSubmitted &&
    selectedLabels.length === requiredCount &&
    question.correctLabels.every((l) => selectedLabels.includes(l));

  const handleSelect = (label: string) => {
    if (isSubmitted) return;
    if (!isMultiple) {
      // 1択：選んだ瞬間に確定
      setSelectedLabels([label]);
      setIsSubmitted(true);
    } else {
      // 複数択：トグル選択
      setSelectedLabels((prev) =>
        prev.includes(label)
          ? prev.filter((l) => l !== label)
          : prev.length < requiredCount
          ? [...prev, label]
          : prev
      );
    }
  };

  const handleSubmit = () => {
    if (selectedLabels.length === requiredCount) setIsSubmitted(true);
  };

  const choiceBorderStyle = (label: string): string => {
    if (!isSubmitted) {
      const isSelected = selectedLabels.includes(label);
      return isSelected
        ? "bg-blue-50 border-2 border-blue-500 cursor-pointer"
        : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-[0.99]";
    }
    if (question.correctLabels.includes(label)) return "bg-green-50 border-2 border-green-500";
    if (selectedLabels.includes(label)) return "bg-red-50 border-2 border-red-400";
    return "bg-white border-2 border-gray-200";
  };

  const choiceTextStyle = (label: string): string => {
    if (!isSubmitted) return "text-gray-800";
    if (question.correctLabels.includes(label)) return "text-green-800";
    if (selectedLabels.includes(label)) return "text-red-700";
    return "text-gray-800";
  };

  const labelBadgeStyle = (label: string): string => {
    if (!isSubmitted) {
      return selectedLabels.includes(label)
        ? "bg-blue-500 border-blue-500 text-white"
        : "border-gray-300 text-gray-500";
    }
    if (question.correctLabels.includes(label)) return "bg-green-500 border-green-500 text-white";
    if (selectedLabels.includes(label)) return "bg-red-400 border-red-400 text-white";
    return "border-gray-300 text-gray-600";
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

      {/* 複数選択の場合はガイダンス */}
      {isMultiple && !isSubmitted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-800">
          {selectedLabels.length < requiredCount
            ? `あと ${requiredCount - selectedLabels.length} 個選んでください（計${requiredCount}個）`
            : `${requiredCount}個選びました。「答え合わせ」を押してください。`}
        </div>
      )}

      {/* 問題文 */}
      <p className="text-sm font-medium text-gray-800 leading-relaxed border-l-4 border-blue-400 pl-3 whitespace-pre-wrap">
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
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${labelBadgeStyle(choice.label)}`}
                >
                  {choice.label}
                </span>
                <span className={`text-sm leading-relaxed ${choiceTextStyle(choice.label)}`}>
                  {choice.text}
                </span>
                {isSubmitted && question.correctLabels.includes(choice.label) && (
                  <span className="shrink-0 ml-auto text-green-600 font-bold text-sm">✓</span>
                )}
                {isSubmitted &&
                  selectedLabels.includes(choice.label) &&
                  !question.correctLabels.includes(choice.label) && (
                    <span className="shrink-0 ml-auto text-red-500 font-bold text-sm">✗</span>
                  )}
              </div>
            </button>

            {/* 解説（回答後） */}
            {isSubmitted && (
              <div
                className={`mt-1 mx-1 px-3 py-2 rounded-lg text-xs leading-relaxed ${
                  question.correctLabels.includes(choice.label)
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : selectedLabels.includes(choice.label)
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

      {/* 複数選択の答え合わせボタン */}
      {isMultiple && !isSubmitted && selectedLabels.length === requiredCount && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors"
        >
          答え合わせ
        </button>
      )}

      {/* 結果サマリー */}
      {isSubmitted && (
        <div
          className={`p-3 rounded-xl text-center font-bold text-sm ${
            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isCorrect
            ? "正解！よくできました"
            : `不正解... 正解は「${question.correctLabels.join("・")}」でした`}
        </div>
      )}

      {/* 次へボタン */}
      {isSubmitted && (
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
