# 保育士試験対策アプリ — CLAUDE.md

## WHY（なぜ作るか）

保育士試験は科目が多く、独学では出題傾向を掴みにくい。
一問一答形式で繰り返し解くことで、苦手分野を特定し合格率を上げることが目的。
ターゲットは試験勉強中の社会人・学生で、スマホで隙間時間に使う想定。

## WHAT（何を作っているか）

Next.js 16 (App Router) + TypeScript + Tailwind CSS のクイズアプリ。

**3フェーズ構成:**
1. **スタート画面** — 科目選択・問題数設定（予定）
2. **クイズ画面** — 1問ずつ表示、回答後に全選択肢の解説を表示
3. **結果画面** — スコア・正答率表示

**UI 仕様:**
- 正解 → 緑背景・緑文字
- 選んだ誤答 → 赤背景・赤文字
- その他の不正解 → 白背景・黒文字（薄くしない）
- スマホ対応（max-w-lg）

## HOW（開発ルール）

### セットアップ
```bash
export PATH="/tmp/node-v22.14.0-darwin-arm64/bin:$PATH"
npm run dev   # → http://localhost:3000
npm run build # ビルド確認
npm run lint  # ESLint
```

> Node.js は `/tmp/node-v22.14.0-darwin-arm64/bin` に手動インストール済み。
> Homebrew・nvm は使っていない。コマンド実行前に必ず PATH を通すこと。

### やること
- 問題データは `src/data/questions.ts` に追加する（詳細は `src/data/CLAUDE.md`）
- コンポーネントは `src/components/` に置く（詳細は `src/components/CLAUDE.md`）
- 状態管理は現状 `page.tsx` の useState で完結させる（Redux 等は不要）

### やらないこと
- データベース・バックエンド API の導入（静的データで運用）
- `any` 型の使用（TypeScript の型を必ず定義する）
- `orm.raw()` 相当の生クエリ（DBがないので該当なし、が将来も静的優先）
- 不必要な依存ライブラリの追加（軽量を維持する）

### ディレクトリ構成
```
src/
  app/
    page.tsx        # メイン画面（フェーズ管理）
    layout.tsx      # メタ情報・lang="ja"
    globals.css     # Tailwind CSS
  components/
    QuizCard.tsx    # 1問分の表示・回答・解説ロジック
  data/
    questions.ts    # 問題データ（Question型・Choice型）
docs/
  architecture.md  # アーキテクチャ詳細
  data-model.md    # データ構造・設計判断
```
