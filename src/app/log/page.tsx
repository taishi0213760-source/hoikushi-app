"use client";

import { useState, useEffect } from "react";
import {
  getRecords,
  getTodayStr,
  type StudyRecord,
} from "@/lib/storage";

export default function LogPage() {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRecords(getRecords().sort((a, b) => b.date.localeCompare(a.date)));
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white" />;
  }

  // 日付ごとにグループ化
  const grouped = groupByDate(records);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // 累計統計
  const totalQ = records.reduce((s, r) => s + r.total, 0);
  const totalC = records.reduce((s, r) => s + r.correct, 0);
  const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
  const studyDays = new Set(records.map((r) => r.date)).size;

  // 科目別正答率
  const subjectStats = calcSubjectStats(records);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold text-purple-800">📊 学習ログ</h1>
          <p className="text-sm text-gray-500 mt-1">これまでの学習履歴</p>
        </div>

        {/* 累計サマリー */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">累計実績</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-700">{totalQ}</p>
              <p className="text-xs text-gray-500">総問題数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
              <p className="text-xs text-gray-500">正答率</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{studyDays}</p>
              <p className="text-xs text-gray-500">学習日数</p>
            </div>
          </div>
          {totalQ > 0 && (
            <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          )}
        </div>

        {/* 科目別正答率 */}
        {subjectStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">科目別 正答率</h2>
            <div className="flex flex-col gap-3">
              {subjectStats.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">{s.subject}</span>
                    <span className="text-gray-500">
                      {s.correct}/{s.total}問 ({s.accuracy}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        s.accuracy >= 80
                          ? "bg-green-500"
                          : s.accuracy >= 60
                          ? "bg-blue-500"
                          : "bg-orange-400"
                      }`}
                      style={{ width: `${s.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 日付別ログ */}
        {dates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-gray-500 text-sm">まだ学習記録がありません</p>
            <p className="text-gray-400 text-xs mt-1">
              クイズや直前対策を解くと自動的に記録されます
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-gray-800 text-sm">学習履歴</h2>
            {dates.map((date) => {
              const dayRecords = grouped[date];
              const dayTotal = dayRecords.reduce((s, r) => s + r.total, 0);
              const dayCorrect = dayRecords.reduce((s, r) => s + r.correct, 0);
              const dayAccuracy = Math.round((dayCorrect / dayTotal) * 100);
              const isToday = date === getTodayStr();

              return (
                <div
                  key={date}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {formatLogDate(date)}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          今日
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        dayAccuracy >= 80
                          ? "text-green-600"
                          : dayAccuracy >= 60
                          ? "text-blue-600"
                          : "text-orange-500"
                      }`}
                    >
                      {dayAccuracy}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {dayRecords.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{r.mode === "practice" ? "⚡" : "📝"}</span>
                          <span>{r.subject}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-xs ${
                              r.mode === "practice"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {r.mode === "practice" ? "直前対策" : "クイズ"}
                          </span>
                        </div>
                        <span className="font-medium">
                          {r.correct}/{r.total}問
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function groupByDate(records: StudyRecord[]): Record<string, StudyRecord[]> {
  return records.reduce<Record<string, StudyRecord[]>>((acc, r) => {
    (acc[r.date] ??= []).push(r);
    return acc;
  }, {});
}

function calcSubjectStats(records: StudyRecord[]) {
  const map: Record<string, { total: number; correct: number }> = {};
  for (const r of records) {
    if (!map[r.subject]) map[r.subject] = { total: 0, correct: 0 };
    map[r.subject].total += r.total;
    map[r.subject].correct += r.correct;
  }
  return Object.entries(map).map(([subject, s]) => ({
    subject,
    total: s.total,
    correct: s.correct,
    accuracy: Math.round((s.correct / s.total) * 100),
  }));
}

function formatLogDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}
