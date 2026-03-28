"use client";

import { useState, useEffect } from "react";
import { getExamSettings } from "@/lib/storage";
import { getExamByTerm, getDaysUntilExamByTerm } from "@/data/examDates";

export default function ExamCountdown() {
  const [selectedTerm, setSelectedTerm] = useState<"前期" | "後期">("前期");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const load = () => setSelectedTerm(getExamSettings().selectedTerm);
    load();
    setMounted(true);
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  if (!mounted) return <div className="h-10 bg-blue-700" />;

  const exam = getExamByTerm(selectedTerm);
  const days = getDaysUntilExamByTerm(selectedTerm);

  if (!exam || days === null) return null;

  // 前期・後期とも30日以内でオレンジ、7日以内で赤
  const isUrgent = days <= 30;
  const isVeryUrgent = days <= 7;

  const bgClass = isVeryUrgent
    ? "bg-red-600"
    : isUrgent
    ? "bg-orange-500"
    : "bg-blue-700";

  return (
    <div className={`${bgClass} text-white text-center py-2 px-4 text-sm font-medium transition-colors duration-500`}>
      <span>
        {exam.year} {exam.term} 筆記試験まで
      </span>
      <span className="font-bold text-lg mx-2">{days}</span>
      <span>日{exam.confirmed ? "" : "（予定）"}</span>
      {isUrgent && (
        <span className="ml-2 bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
          直前期
        </span>
      )}
    </div>
  );
}
