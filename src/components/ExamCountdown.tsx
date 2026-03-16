"use client";

import { getDaysUntilExam, getNextExam } from "@/data/examDates";

export default function ExamCountdown() {
  const days = getDaysUntilExam();
  const next = getNextExam();

  if (!next || days === null) return null;

  const isUrgent = days <= 30;
  const isVeryUrgent = days <= 7;

  const bgClass = isVeryUrgent
    ? "bg-red-600"
    : isUrgent
    ? "bg-orange-500"
    : "bg-blue-700";

  return (
    <div className={`${bgClass} text-white text-center py-2 px-4 text-sm font-medium`}>
      <span>
        {next.year} {next.term} 筆記試験まで
      </span>
      <span className="font-bold text-lg mx-2">{days}</span>
      <span>日{next.confirmed ? "" : "（予定）"}</span>
      {isUrgent && (
        <span className="ml-2 bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
          直前期
        </span>
      )}
    </div>
  );
}
