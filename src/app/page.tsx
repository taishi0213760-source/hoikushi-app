"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getTodayStr,
  getTasksByDate,
  saveTask,
  updateTask,
  deleteTask,
  getRecords,
  getExamSettings,
  saveExamSettings,
  type DailyTask,
  type StudyRecord,
} from "@/lib/storage";
import { getExamByTerm, getDaysUntilExamByTerm, formatJpDate } from "@/data/examDates";

// おすすめ学習の候補プール（日ごとにローテーション）
const SUGGESTION_POOL: Record<string, string[]> = {
  veryUrgent: [
    "苦手科目の最終確認をしよう",
    "過去問を全科目1周しよう",
    "時間配分を意識して解いてみよう",
    "間違えた問題だけ集中して見直そう",
    "解説を声に出して読んで記憶を定着させよう",
    "今日は1時間集中して過去問演習しよう",
    "本番と同じ時間帯に問題を解いてみよう",
    "残り時間、できることを全力でやろう！",
  ],
  urgent: [
    "直前対策モードで過去問を繰り返そう",
    "間違えた問題を重点的に復習しよう",
    "全9科目を1日1科目ずつ確認しよう",
    "苦手な科目に集中して取り組もう",
    "正解できた問題も解説を確認しよう",
    "毎日必ず1セット解こう",
    "試験前は新問題より復習を優先しよう",
    "今日の目標は正答率70%以上！",
    "15分でいいから毎日続けよう",
  ],
  medium: [
    "保育の心理学・保育原理を優先しよう",
    "毎日10問以上解く習慣をつけよう",
    "解説をしっかり読んで理解を深めよう",
    "間違えた問題に印をつけて繰り返そう",
    "隙間時間にアプリで1問解こう",
    "今日は社会福祉に集中しよう",
    "正答率60%を科目ごとに確認しよう",
    "苦手分野を洗い出して計画を立てよう",
    "子どもの保健は暗記が多い、早めに始めよう",
    "教育原理と保育原理の違いを整理しよう",
  ],
  early: [
    "まず保育の心理学から始めよう",
    "1日5問からコツコツ積み上げよう",
    "正答率60%を目標に進めよう",
    "全9科目の出題傾向をざっくり把握しよう",
    "得意科目を1つ作って自信をつけよう",
    "子どもの食と栄養は暗記が鍵",
    "保育実習理論の音楽・造形もチェックしよう",
    "毎日少しずつでも続けることが合格への近道",
    "子ども家庭福祉の法律用語を整理しよう",
    "社会的養護は事例問題が多い、イメージして覚えよう",
    "今日は1科目だけでもOK、継続が大切！",
    "解いた後の解説読みが合否を分ける",
  ],
};

function getStudySuggestions(daysLeft: number | null): string[] {
  const key =
    daysLeft === null
      ? "early"
      : daysLeft <= 7
      ? "veryUrgent"
      : daysLeft <= 30
      ? "urgent"
      : daysLeft <= 60
      ? "medium"
      : "early";
  const pool = SUGGESTION_POOL[key];
  const seed = Math.floor(Date.now() / 86400000);
  return [0, 1, 2].map((i) => pool[(seed + i) % pool.length]);
}

export default function DashboardPage() {
  const today = getTodayStr();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<"前期" | "後期">("前期");

  useEffect(() => {
    setTasks(getTasksByDate(today));
    setRecords(getRecords());
    setSelectedTerm(getExamSettings().selectedTerm);
    setMounted(true);
  }, [today]);

  const days = getDaysUntilExamByTerm(selectedTerm);
  const next = getExamByTerm(selectedTerm);
  const suggestions = getStudySuggestions(days);
  const isUrgent = days !== null && days <= 30;

  const handleTermChange = (term: "前期" | "後期") => {
    setSelectedTerm(term);
    saveExamSettings({ selectedTerm: term });
  };

  const todayRecords = records.filter((r) => r.date === today);
  const todayTotal = todayRecords.reduce((s, r) => s + r.total, 0);
  const todayCorrect = todayRecords.reduce((s, r) => s + r.correct, 0);

  const allTotal = records.reduce((s, r) => s + r.total, 0);
  const allCorrect = records.reduce((s, r) => s + r.correct, 0);
  const accuracy = allTotal > 0 ? Math.round((allCorrect / allTotal) * 100) : 0;

  const studyDays = new Set(records.map((r) => r.date));
  const streak = calcStreak(studyDays);

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const t = saveTask({ date: today, text: newTaskText.trim(), completed: false });
    setTasks((prev) => [...prev, t]);
    setNewTaskText("");
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTask(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-5 px-4">
      <div className="w-full max-w-lg flex flex-col gap-4">

        {/* ヘッダー */}
        <div className="text-center pt-1">
          <h1 className="text-lg font-bold text-slate-800 tracking-wide">保育士試験 対策アプリ</h1>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(today)}</p>
        </div>

        {/* 試験日カウントダウンカード — 最重要情報（視覚的最大要素） */}
        <div className={`rounded-2xl p-5 transition-colors duration-500 ${
          isUrgent
            ? "bg-orange-500 text-white"
            : "bg-white border border-slate-100 shadow-sm"
        }`}>
          {/* 前期/後期トグル */}
          <div className="flex justify-center mb-4">
            <div className={`flex rounded-full p-1 gap-1 ${
              isUrgent ? "bg-orange-400/50" : "bg-slate-100"
            }`}>
              {(["前期", "後期"] as const).map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermChange(term)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTerm === term
                      ? isUrgent
                        ? "bg-white text-orange-600 shadow-sm"
                        : "bg-white text-blue-700 shadow-sm"
                      : isUrgent
                      ? "text-white/80 hover:text-white"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {next && days !== null ? (
            <div className="text-center">
              <p className={`text-xs font-medium mb-1 ${isUrgent ? "text-white" : "text-slate-700"}`}>
                {next.year} {next.term} 筆記試験{next.confirmed ? "" : "（予定）"}
              </p>
              {/* 日数 — 最大フォント・最重要情報 */}
              <div className="flex items-end justify-center gap-1">
                <span className={`text-7xl font-bold leading-none tabular-nums ${
                  isUrgent ? "text-white" : "text-blue-600"
                }`}>
                  {days}
                </span>
                <span className={`text-lg mb-1 ${isUrgent ? "text-white" : "text-slate-700"}`}>
                  日後
                </span>
              </div>

              {/* 筆記試験日程 */}
              <p className={`text-sm font-medium mt-2 ${isUrgent ? "text-white" : "text-slate-800"}`}>
                筆記試験：{formatJpDate(next.dates[0])}・{formatJpDate(next.dates[1])}
                {next.confirmed ? "" : "（予定）"}
              </p>

              {/* 実技試験日程 */}
              {next.practicalDate && (
                <p className={`text-xs font-medium mt-1 ${isUrgent ? "text-white/90" : "text-slate-700"}`}>
                  実技試験：{formatJpDate(next.practicalDate)}
                  {next.practicalConfirmed ? "" : "（予定）"}
                </p>
              )}

              {/* 申込期間 */}
              {next.registration && (
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${
                  isUrgent
                    ? "bg-orange-400/50 text-white"
                    : "bg-blue-50 text-blue-700"
                }`}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                    edit_calendar
                  </span>
                  申込：{formatJpDate(next.registration.start)}〜{formatJpDate(next.registration.end)}
                  {next.registration.confirmed ? "" : "（予定）"}
                </div>
              )}

              {isUrgent && (
                <p className="mt-3 text-xs font-semibold text-orange-600 bg-white rounded-full px-3 py-1 inline-block">
                  ⚡ 直前期！直前対策モードを活用しよう
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-400 text-sm">試験日程なし</p>
          )}
        </div>

        {/* 今日の実績 — 3分割スタット */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="今日の問題数"
            value={todayTotal}
            unit="問"
            color="text-blue-600"
          />
          <StatCard
            label="今日の正答率"
            value={todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : "-"}
            unit={todayTotal > 0 ? "%" : ""}
            color="text-emerald-600"
          />
          <StatCard label="連続学習" value={streak} unit="日" color="text-violet-600" />
        </div>

        {/* クイックアクション — 3ボタン */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/quiz"
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl p-4 flex flex-col items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "30px" }}>
                quiz
              </span>
              <span className="text-sm font-semibold">クイズを解く</span>
              <span className="text-xs opacity-75">全{allTotal}問解答済み</span>
            </Link>
            <Link
              href="/practice"
              className={`active:scale-95 rounded-2xl p-4 flex flex-col items-center gap-1.5 transition-all ${
                isUrgent
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "30px" }}>
                bolt
              </span>
              <span className="text-sm font-semibold">直前対策</span>
              <span className="text-xs opacity-70">過去問を集中演習</span>
            </Link>
          </div>
          {/* 実技試験ボタン */}
          <Link
            href="/practical"
            className="bg-violet-600 hover:bg-violet-700 active:scale-95 text-white rounded-2xl p-4 flex items-center justify-center gap-3 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
              piano
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold">実技試験</p>
              <p className="text-xs opacity-80">音楽・造形・言語の対策</p>
            </div>
            <span className="material-symbols-outlined text-pink-300 ml-auto" style={{ fontSize: "18px" }}>
              chevron_right
            </span>
          </Link>
        </div>

        {/* 今日のタスク */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-slate-500" style={{ fontSize: "18px" }}>
              checklist
            </span>
            今日のタスク
          </h2>
          <ul className="flex flex-col gap-2 mb-3">
            {tasks.length === 0 && (
              <li className="text-xs text-slate-400 text-center py-3">
                タスクを追加して今日の学習を計画しよう
              </li>
            )}
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleToggleTask(task.id, e.target.checked)}
                  className="w-4 h-4 accent-blue-600 shrink-0"
                />
                <span
                  className={`flex-1 text-sm ${
                    task.completed ? "line-through text-slate-400" : "text-slate-800"
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-300 hover:text-red-400 text-xs shrink-0 p-1"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="タスクを追加..."
              className="flex-1 text-sm text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 placeholder:text-slate-600 bg-slate-50"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-600 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-medium"
            >
              追加
            </button>
          </div>
        </div>

        {/* 今日のおすすめ学習 */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
          <h2 className="font-bold text-blue-800 mb-2 text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-500" style={{ fontSize: "18px" }}>
              lightbulb
            </span>
            今日のおすすめ
          </h2>
          <ul className="flex flex-col gap-2">
            {suggestions.map((s, i) => (
              <li key={i} className="text-xs text-blue-700 flex gap-2 items-start">
                <span className="shrink-0 w-4 h-4 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* 累計統計 */}
        {allTotal > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h2 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-slate-500" style={{ fontSize: "18px" }}>
                trending_up
              </span>
              累計実績
            </h2>
            <div className="flex justify-between text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{allTotal}</p>
                <p className="text-xs text-slate-400">総問題数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{accuracy}%</p>
                <p className="text-xs text-slate-400">正答率</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600">{studyDays.size}</p>
                <p className="text-xs text-slate-400">学習日数</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-right text-xs text-slate-400 mt-1">{accuracy}% 達成</p>
          </div>
        )}

      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number | string;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
      <p className={`text-xl font-bold ${color}`}>
        {value}
        <span className="text-xs font-normal text-slate-400">{unit}</span>
      </p>
      <p className="text-xs text-slate-400 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}

function calcStreak(studyDays: Set<string>): number {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (true) {
    const key = d.toISOString().split("T")[0];
    if (!studyDays.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
