# スキル: コードレビュー（review）

このプロジェクトのコードレビューを行う手順。

## レビュー観点

### 型安全性
- `any` 型が使われていないか
- `Question` / `Choice` 型の構造が守られているか
- `correctLabel` が choices の label と一致しているか（実行時エラーの原因）

### UI 仕様の遵守
- 正解 → `bg-green-*` + `text-green-*`
- 選んだ誤答 → `bg-red-*` + `text-red-*`
- その他の不正解 → 白背景・黒文字（`opacity` や `text-gray-*` で薄くしていないか）
- `max-w-lg` のスマホ対応レイアウトが崩れていないか

### パフォーマンス
- `questions.ts` の import が不必要に重くなっていないか
- 不要な再レンダリングが発生していないか（`useCallback` / `useMemo` の使いすぎも NG）

### 保守性
- コンポーネントが `src/components/` に正しく分離されているか
- `page.tsx` にロジックが詰め込まれすぎていないか

## 実行コマンド
```bash
export PATH="/tmp/node-v22.14.0-darwin-arm64/bin:$PATH"
npm run lint
npx tsc --noEmit
```
