# データモデル

## 型定義（src/data/questions.ts）

```typescript
type Choice = {
  label: string;       // "A" | "B" | "C" | "D"
  text: string;        // 選択肢テキスト
  explanation: string; // 回答後に表示する各選択肢の解説
};

type Question = {
  id: number;
  subject: string;      // 例: "保育の心理学"
  source: string;       // 例: "令和4年前期 問3" / "オリジナル問題"
  text: string;         // 問題文
  choices: Choice[];    // 必ず4択（A/B/C/D）
  correctLabel: string; // 正解のラベル（"A" | "B" | "C" | "D"）
};
```

## 設計ルール

- `choices` は必ず A・B・C・D の4択、順番通りに並べる
- `correctLabel` は `choices[].label` のいずれかと完全一致させる（大文字固定）
- `explanation` は正誤に関わらず全選択肢に書く（なぜ正解か・なぜ不正解かを両方記載）
- `id` は 1 からの連番、欠番なし
- `subject` は科目名を統一する（表記ゆれ注意）

## 現在の科目一覧

| subject | 問題数 |
|---------|--------|
| 保育の心理学 | 3 |

## 今後追加予定の科目

保育士試験の必修9科目:
1. 保育の心理学 ✅
2. 保育原理
3. 子ども家庭福祉
4. 社会福祉
5. 教育原理
6. 社会的養護
7. 子どもの保健
8. 子どもの食と栄養
9. 保育実習理論

## 問題追加の手順

→ `.claude/skills/add-questions.md` を参照
