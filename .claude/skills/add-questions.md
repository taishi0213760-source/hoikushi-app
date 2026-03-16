# スキル: 問題追加（add-questions）

`src/data/questions.ts` に新しい問題を追加する手順。

## 手順

1. **ユーザーから問題データを受け取る**
   - 科目名・出典（例: 令和○年○期 問○）・問題文・4択・正解・各選択肢の解説

2. **既存の id の最大値を確認する**
   ```bash
   grep 'id:' src/data/questions.ts | tail -5
   ```

3. **Question 型に従って追加する**
   ```typescript
   {
     id: <既存最大値 + 1>,
     subject: "科目名",
     source: "出典（例: 令和4年前期 問3）",
     text: "問題文",
     choices: [
       { label: "A", text: "選択肢A", explanation: "解説A" },
       { label: "B", text: "選択肢B", explanation: "解説B" },
       { label: "C", text: "選択肢C", explanation: "解説C" },
       { label: "D", text: "選択肢D", explanation: "解説D" },
     ],
     correctLabel: "正解のラベル（A/B/C/D）",
   }
   ```

4. **型チェックで確認する**
   ```bash
   export PATH="/tmp/node-v22.14.0-darwin-arm64/bin:$PATH"
   npx tsc --noEmit
   ```

## 注意事項
- `explanation` は「なぜ正解/不正解か」を具体的に書く（単なる正誤だけでなく）
- `source` は実際の試験問題をベースにした場合のみ記載、オリジナルは `"オリジナル問題"` とする
- id は連番で欠番を作らない
