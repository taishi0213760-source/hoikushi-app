# アーキテクチャ概要

## スタック

| 役割 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| 言語 | TypeScript | ^5 |
| スタイリング | Tailwind CSS | ^4 |
| ランタイム | Node.js | 22.14.0 |

## 画面フロー

```
[スタート画面]
   ↓ 「スタートする」ボタン
[クイズ画面] × 問題数
   ↓ 全問終了
[結果画面]
   ↓ 「もう一度」ボタン
[スタート画面]
```

## 状態管理

`src/app/page.tsx` の `useState` でフェーズと回答状態を一元管理。

```typescript
type Phase = 'start' | 'quiz' | 'result'
```

- `phase`: 現在のフェーズ
- `currentIndex`: 表示中の問題インデックス
- `answers`: ユーザーの回答履歴（結果画面で集計）

外部状態管理ライブラリ（Redux, Zustand 等）は導入していない。
問題数が増えてもこの構成で対応できる想定。

## データフロー

```
src/data/questions.ts  →  page.tsx (シャッフル・フィルタ)  →  QuizCard.tsx
```

問題データは静的ファイル（questions.ts）のみ。API・DB なし。

## コンポーネント構成

```
app/page.tsx
  └── components/QuizCard.tsx   # 1問の表示・回答・解説
```

QuizCard は「表示と回答受付」に専念し、フェーズ遷移は page.tsx が担う。

## 設計判断の記録

### なぜ静的データか
試験問題は頻繁に変わらないため、DB や API は過剰。
問題を追加するときは `questions.ts` を直接編集する運用で十分。

### なぜ App Router か
Next.js 16 のデフォルト。Pages Router への移行は不要。
現状はすべて Client Component（`'use client'`）で動作している。
