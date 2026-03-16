# スキル: デバッグフロー（debug）

問題が起きたときの調査・解決手順。

## よくある問題と対処

### 開発サーバーが起動しない
```bash
export PATH="/tmp/node-v22.14.0-darwin-arm64/bin:$PATH"
node --version   # v22.x.x が出ることを確認
npm run dev
```
Node が見つからない場合 → `/tmp/node-v22.14.0-darwin-arm64/bin` に node があるか確認。

### TypeScript エラー
```bash
export PATH="/tmp/node-v22.14.0-darwin-arm64/bin:$PATH"
npx tsc --noEmit
```
エラーが出た場合 → `src/data/questions.ts` の型構造（Question/Choice）が壊れていないか確認。

### クイズで正解判定がおかしい
- `questions.ts` の `correctLabel` と `choices[].label` の値が一致しているか確認
- 大文字/小文字の違い（"A" vs "a"）に注意

### スタイルが適用されない
- Tailwind クラスが動的生成（テンプレートリテラル）になっていないか確認
  - NG: `` `bg-${color}-100` `` → Tailwind はビルド時に静的解析するので動的クラスは消える
  - OK: `isCorrect ? 'bg-green-100' : 'bg-red-100'`

## デバッグの進め方
1. ブラウザの DevTools Console でエラーを確認
2. `npx tsc --noEmit` で型エラーを確認
3. `npm run lint` で ESLint エラーを確認
4. 問題を最小再現ケースに絞り込む
