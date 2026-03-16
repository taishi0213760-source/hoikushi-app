export type ExamDate = {
  year: string;
  term: "前期" | "後期";
  dates: string[]; // ["YYYY-MM-DD", "YYYY-MM-DD"]
  confirmed: boolean;
};

// 保育士試験日程（例年4月・10月の第3土日）
// 公式: https://www.hoyokyo.or.jp/exam/
export const examDates: ExamDate[] = [
  {
    year: "令和8年",
    term: "前期",
    dates: ["2026-04-18", "2026-04-19"],
    confirmed: false, // 公式発表前は予定として扱う
  },
  {
    year: "令和8年",
    term: "後期",
    dates: ["2026-10-17", "2026-10-18"],
    confirmed: false,
  },
];

export function getNextExam(): ExamDate | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const exam of examDates) {
    const first = new Date(exam.dates[0]);
    if (first >= today) return exam;
  }
  return null;
}

export function getDaysUntilExam(): number | null {
  const next = getNextExam();
  if (!next) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = new Date(next.dates[0]).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
