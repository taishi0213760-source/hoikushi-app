"use client";

import { useState } from "react";
import Link from "next/link";

const PRACTICAL_TYPES = [
  {
    id: "music",
    label: "音楽表現",
    icon: "music_note",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "bg-pink-600",
    description: "ピアノ伴奏しながら歌う（課題曲2曲）",
    tips: [
      "課題曲を繰り返し練習し、弾き歌いを安定させる",
      "弾き歌いは右手メロディ＋左手伴奏の同時演奏が基本",
      "受験者と子どもたちの前での演奏を意識して練習する",
      "間違えても止まらず最後まで演奏しきることが大切",
      "ピアノが苦手な場合はギター・アコーディオンも選択可能",
    ],
  },
  {
    id: "art",
    label: "造形表現",
    icon: "palette",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    accent: "bg-green-600",
    description: "保育の場面を色鉛筆で描く（45分・A4用紙）",
    tips: [
      "人物（子ども・保育士）を正確に描く練習を重ねる",
      "背景・小物も含めて画面全体を塗り込む",
      "色鉛筆は豊富な色数（24色以上）を用意する",
      "試験当日は課題が当日発表のため、様々な場面を想定しておく",
      "時間配分：下書き10分→彩色30分→仕上げ5分が目安",
    ],
  },
  {
    id: "language",
    label: "言語表現",
    icon: "record_voice_over",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "bg-purple-600",
    description: "課題のお話を3分間で語る（絵本・道具なし）",
    tips: [
      "課題の素話（すばなし）4題から当日1題選択",
      "絵本や小道具は使用不可。暗記して語ること",
      "3分間でちょうど終わるよう時間を計って練習する",
      "子どもに語りかけるイメージで、目線と表情を意識する",
      "繰り返しの表現やオノマトペを活かして生き生きと語る",
    ],
  },
];

export default function PracticalPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600" style={{ fontSize: "22px" }}>
              arrow_back
            </span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">実技試験対策</h1>
            <p className="text-xs text-slate-500">3分野から1分野を選択して受験</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* 概要カード */}
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-violet-600 mt-0.5" style={{ fontSize: "20px" }}>
              info
            </span>
            <div>
              <p className="text-sm font-semibold text-violet-800 mb-1">実技試験について</p>
              <p className="text-xs text-violet-700 leading-relaxed">
                筆記試験合格後に受験できます。音楽・造形・言語の3分野から2分野を選択して受験し、両方で60点以上（100点満点）が合格基準です。
              </p>
            </div>
          </div>
        </div>

        {/* 分野カード */}
        {PRACTICAL_TYPES.map((type) => {
          const isOpen = openId === type.id;
          return (
            <div
              key={type.id}
              className={`bg-white rounded-2xl border ${type.border} shadow-sm overflow-hidden`}
            >
              {/* カードヘッダー（タップで開閉） */}
              <button
                className="w-full text-left p-4 flex items-center gap-4"
                onClick={() => toggle(type.id)}
              >
                <div className={`${type.bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span
                    className={`material-symbols-outlined ${type.color}`}
                    style={{ fontSize: "24px" }}
                  >
                    {type.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-base ${type.color}`}>{type.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{type.description}</p>
                </div>
                <span
                  className={`material-symbols-outlined text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  style={{ fontSize: "20px" }}
                >
                  expand_more
                </span>
              </button>

              {/* 対策ポイント（展開時） */}
              {isOpen && (
                <div className={`${type.bg} border-t ${type.border} px-4 py-3`}>
                  <p className={`text-xs font-bold ${type.color} mb-2 flex items-center gap-1`}>
                    <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                      checklist
                    </span>
                    対策ポイント
                  </p>
                  <ul className="space-y-2">
                    {type.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`text-xs font-bold ${type.color} mt-0.5 flex-shrink-0`}>
                          {i + 1}.
                        </span>
                        <span className="text-xs text-slate-700 leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {/* フッターメモ */}
        <p className="text-center text-xs text-slate-400 pb-2">
          詳細は
          <a
            href="https://www.hoyokyo.or.jp/exam/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-500 underline mx-1"
          >
            全国保育士養成協議会
          </a>
          の公式サイトでご確認ください
        </p>
      </div>
    </div>
  );
}
