// クイズ・直前対策の結果ログ
export type StudyRecord = {
  id: string;
  date: string; // "YYYY-MM-DD"
  subject: string;
  mode: "quiz" | "practice";
  total: number;
  correct: number;
};

// 1日のタスク
export type DailyTask = {
  id: string;
  date: string; // "YYYY-MM-DD"
  text: string;
  completed: boolean;
};

const RECORDS_KEY = "hoikushi_study_records";
const TASKS_KEY = "hoikushi_daily_tasks";

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// --- StudyRecord ---

export function getRecords(): StudyRecord[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(RECORDS_KEY);
  return raw ? (JSON.parse(raw) as StudyRecord[]) : [];
}

export function saveRecord(record: Omit<StudyRecord, "id">): void {
  const records = getRecords();
  records.push({ ...record, id: Date.now().toString() });
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getRecordsByDate(date: string): StudyRecord[] {
  return getRecords().filter((r) => r.date === date);
}

// --- DailyTask ---

export function getTasksAll(): DailyTask[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TASKS_KEY);
  return raw ? (JSON.parse(raw) as DailyTask[]) : [];
}

export function getTasksByDate(date: string): DailyTask[] {
  return getTasksAll().filter((t) => t.date === date);
}

export function saveTask(task: Omit<DailyTask, "id">): DailyTask {
  const all = getTasksAll();
  const newTask: DailyTask = { ...task, id: Date.now().toString() };
  all.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(all));
  return newTask;
}

export function updateTask(id: string, patch: Partial<DailyTask>): void {
  const all = getTasksAll().map((t) => (t.id === id ? { ...t, ...patch } : t));
  localStorage.setItem(TASKS_KEY, JSON.stringify(all));
}

export function deleteTask(id: string): void {
  const all = getTasksAll().filter((t) => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(all));
}
