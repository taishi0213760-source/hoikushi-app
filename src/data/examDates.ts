export type RegistrationPeriod = {
  start: string;  // "YYYY-MM-DD"
  end: string;    // "YYYY-MM-DD"
  confirmed: boolean;
};

export type ExamDate = {
  year: string;
  term: "前期" | "後期";
  dates: string[]; // ["YYYY-MM-DD", "YYYY-MM-DD"] 筆記試験日
  confirmed: boolean;
  registration?: RegistrationPeriod;
  practicalDate?: string; // 実技試験日 "YYYY-MM-DD"
  practicalConfirmed?: boolean;
};

// 保育士試験日程（例年4月・10月の第3土日が筆記、約2か月後が実技）
// 公式: https://www.hoyokyo.or.jp/exam/
export const examDates: ExamDate[] = [
  {
    year: "令和8年",
    term: "前期",
    dates: ["2026-04-18", "2026-04-19"],
    confirmed: false,
    registration: {
      start: "2025-11-25",
      end: "2025-12-09",
      confirmed: false,
    },
    practicalDate: "2026-06-27",
    practicalConfirmed: false,
  },
  {
    year: "令和8年",
    term: "後期",
    dates: ["2026-10-17", "2026-10-18"],
    confirmed: false,
    registration: {
      start: "2026-07-01",
      end: "2026-07-15",
      confirmed: false,
    },
    practicalDate: "2026-12-12",
    practicalConfirmed: false,
  },
];

export function getExamByTerm(term: "前期" | "後期"): ExamDate | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    examDates.find((e) => e.term === term && new Date(e.dates[0]) >= today) ??
    null
  );
}

export function getDaysUntilExamByTerm(term: "前期" | "後期"): number | null {
  const exam = getExamByTerm(term);
  if (!exam) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil(
    (new Date(exam.dates[0]).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

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

export function formatJpDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
