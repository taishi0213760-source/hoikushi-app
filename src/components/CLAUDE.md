# src/components/ — ローカルルール

## このディレクトリについて

再利用可能な UI コンポーネントを置く。現在は `QuizCard.tsx` のみ。

## QuizCard.tsx の責務

- 1問分の表示（問題文・4択）
- 回答受付（選択肢クリック）
- 回答後の解説表示（全選択肢の色分け）
- 「次の問題」ボタンの表示

**責務外（page.tsx が担う）:**
- フェーズ遷移（クイズ→結果）
- 問題のシャッフル・選択
- スコア集計

## コンポーネント追加のルール

- ファイル名は PascalCase（例: `SubjectSelector.tsx`）
- `'use client'` ディレクティブを先頭に付ける
- props の型は同ファイル内に定義する（外部ファイルへの分離は不要）

## UI 色ルール（Tailwind）

動的クラスは Tailwind のパージ対象にならないため、**三項演算子で静的クラスを切り替えること。**

```typescript
// OK
className={isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}

// NG（ビルド後にクラスが消える）
className={`bg-${color}-100 text-${color}-800`}
```

| 状態 | 背景 | 文字 |
|------|------|------|
| 正解 | `bg-green-100` | `text-green-800` |
| 選んだ誤答 | `bg-red-100` | `text-red-800` |
| その他の不正解 | （デフォルト白背景） | （デフォルト黒文字） |
