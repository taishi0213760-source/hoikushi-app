# src/data/ — ローカルルール

## このディレクトリについて

試験問題データを管理するディレクトリ。現在は `questions.ts` のみ。

## 編集時の注意

**型構造を壊さないこと。**

`Question` 型と `Choice` 型は `src/components/QuizCard.tsx` と `src/app/page.tsx` が依存している。
フィールド名・型の変更は必ず両ファイルへの影響を確認すること。

```
絶対に変えてはいけないフィールド:
- Choice.label     → 正解判定に使用
- Question.correctLabel → 正解判定に使用
- Question.id      → 将来的なルーティング・進捗管理の基準
```

## 問題追加のフロー

`.claude/skills/add-questions.md` を使う:

```
/add-questions
```

## 編集後の確認

```bash
export PATH="/tmp/node-v22.14.0-darwin-arm64/bin:$PATH"
npx tsc --noEmit
```
