# Project guidance

## Project scope

- ブラウザゲーム「ジャズ研検定」。5科目のミニゲーム（カウントオフ／2&4ハイハット／耳コーデ／セッション常識／ジャイアント・ステップス）でジャズ度を採点し段位を認定する。
- Source of truth: `index.html`（UI・ゲームロジック・採点・音声合成をすべて内蔵）。`README.md` が科目構成・遊び方・配布方法の正本。
- Read order: `README.md` → `index.html`
- Supported: モダンブラウザ（PC＋スマホ）。タップとキーボード（スペース／数字キー）両対応。最高段位は端末ローカルに保存。

## Change boundaries

- Preserve: `index.html` 単一ファイル構成。外部ライブラリ・画像・音声ファイルを持たず、音はすべてWeb Audio APIで合成する。依存追加・ビルド工程の導入は行わない。
- 科目構成・採点方式・段位体系などのゲームデザインは `README.md` の記載と整合させる。
- タイミング判定はAudioContextクロック基準（±ms精度）で、タップ遅延補正（タッチ約35ms／PC約12ms）を維持する。

## Required validation

- Commands: ビルド・テスト基盤なし。動作確認は `index.html` をブラウザで開くか、`python -m http.server` → `http://localhost:8000`。
- Acceptance: 5科目すべてが開始〜採点まで動作し、総合成績で段位が表示されること。スマホ幅レイアウトと音声再生を確認する。

## External actions

- Publication boundary: リポジトリ `Ranats/jazz-game` はpublic、GitHub Pagesで https://ranats.github.io/jazz-game/ を公開中。`main`へのmergeで自動デプロイされる。push・merge等の外部操作は明示依頼がある場合のみ行う。
- `ogp.png` はリンクカード用の生成画像（`index.html` のOGPメタから参照）。ゲーム自体の単一ファイル性とは別物として扱う。
