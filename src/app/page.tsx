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
  type DailyTask,
  type StudyRecord,
} from "@/lib/storage";
import { getDaysUntilExam, getNextExam } from "@/data/examDates";

// 科目ごとの推奨学習（試験日まで日数に応じて変化）
function getStudySuggestions(daysLeft: number | null): string[] {
  if (daysLeft === null) return ["問題を解いて実力を確認しましょう"];
  if (daysLeft <= 7) return ["苦手科目の最終確認", "過去問を全科目1周", "時間配分を意識して解く"];
  if (daysLeft <= 30) return ["直前対策モードで過去問を繰り返す", "間違えた問題を重点復習", "全9科目を1日1科目ずつ"];
  if (daysLeft <= 60) return ["保育の心理学・保育原理を優先", "毎日10問以上解く習慣をつける", "解説をしっかり読む"];
  return ["まず保育の心理学から始めよう", "1日5問からコツコツ積み上げる", "正答率60%を目標に"];
}

export default function DashboardPage() {
  const today = getTodayStr();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(getTasksByDate(today));
    setRecords(getRecords());
    setMounted(true);
  }, [today]);

  const days = getDaysUntilExam();
  const next = getNextExam();
  const suggestions = getStudySuggestions(days);

  // 今日の学習実績
  const todayRecords = records.filter((r) => r.date === today);
  const todayTotal = todayRecords.reduce((s, r) => s + r.total, 0);
  const todayCorrect = todayRecords.reduce((s, r) => s + r.correct, 0);

  // 全体統計
  const allTotal = records.reduce((s, r) => s + r.total, 0);
  const allCorrect = records.reduce((s, r) => s + r.correct, 0);
  const accuracy = allTotal > 0 ? Math.round((allCorrect / allTotal) * 100) : 0;

  // 連続学習日数
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
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-lg flex flex-col gap-4">

        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-800">保育士試験 対策アプリ</h1>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(today)}</p>
        </div>

        {/* 試験まで大きく表示 */}
        {next && days !== null && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 text-center">
            <p className="text-xs text-gray-500 mb-1">
              {next.year} {next.term} 筆記試験{next.confirmed ? "" : "（予定）"}
            </p>
            <p className="text-6xl font-bold text-blue-700 leading-none">{days}</p>
            <p className="text-sm text-gray-500 mt-1">日後</p>
            {days <= 30 && (
              <p className="mt-2 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full px-3 py-1 inline-block">
                ⚡ 直前期！直前対策モードを活用しよう
              </p>
            )}
          </div>
        )}

        {/* 今日の実績 */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="今日の問題数" value={todayTotal} unit="問" />
          <StatCard
            label="今日の正答率"
            value={todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : "-"}
            unit={todayTotal > 0 ? "%" : ""}
          />
          <StatCard label="連続学習" value={streak} unit="日" />
        </div>

        {/* 今日のタスク */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">📋 今日のタスク</h2>
          <ul className="flex flex-col gap-2 mb-3">
            {tasks.length === 0 && (
              <li className="text-xs text-gray-400 text-center py-2">
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
                    task.completed ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-300 hover:text-red-400 text-xs shrink-0"
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
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="タスクを追加..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              追加
            </button>
          </div>
        </div>

        {/* 今日のおすすめ学習 */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
          <h2 className="font-bold text-blue-800 mb-2 text-sm">💡 今日のおすすめ</h2>
          <ul className="flex flex-col gap-1.5">
            {suggestions.map((s, i) => (
              <li key={i} className="text-xs text-blue-700 flex gap-1.5 items-start">
                <span className="shrink-0 text-blue-400">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/quiz"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 flex flex-col items-center gap-1 transition-colors"
          >
            <span className="text-2xl">📝</span>
            <span className="text-sm font-semibold">クイズを解く</span>
            <span className="text-xs opacity-80">全{allTotal}問解答済み</span>
          </Link>
          <Link
            href="/practice"
            className={`rounded-2xl p-4 flex flex-col items-center gap-1 transition-colors ${
              days !== null && days <= 30
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-semibold">直前対策</span>
            <span className="text-xs opacity-70">過去問を集中演習</span>
          </Link>
        </div>

        {/* 累計統計 */}
        {allTotal > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">📈 累計実績</h2>
            <div className="flex justify-between text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700">{allTotal}</p>
                <p className="text-xs text-gray-500">総問題数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-xs text-gray-500">正答率</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{studyDays.size}</p>
                <p className="text-xs text-gray-500">学習日数</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${accuracy}%` }}
              />
            </div>
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
}: {
  label: string;
  value: number | string;
  unit: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
      <p className="text-xl font-bold text-blue-700">
        {value}
        <span className="text-xs font-normal text-gray-400">{unit}</span>
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
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
