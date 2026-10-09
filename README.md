# ジャズ研検定

Coda Intelligence Lab 非公式認定試験。5科目のミニゲームで「ジャズ度」を採点するブラウザゲームです。

**index.html 1ファイルだけで動きます。** ゲームには外部ライブラリ・画像・音声ファイル不要（音はすべてWeb Audio APIで合成）。本番では任意のアクセス解析スクリプトだけを追加できます。

## 遊び方

- `index.html` をブラウザで開くだけ（ダブルクリックでOK）
- スマホでも遊べます。タップ操作＋音が出るのでイヤホン推奨
- PCではタップの代わりにスペースキーも使えます（クイズは数字キー1〜4）
- 科目1・2の開始前にルールが分かるプレビューアニメーションがあります

## 科目

| 科目 | 内容 |
|---|---|
| 1. カウントオフ | クリック8回→4拍の沈黙→「1」をタップ。ズレをms採点 |
| 2. 2&4ハイハット | ライドに合わせて2拍と4拍だけ踏み続ける（お手本2小節付き） |
| 3. 耳コーデ | 鳴ったコード（△7/m7/7/m7(♭5)/dim7/m△7/7sus4）を4択で当てる |
| 4. セッション常識 | ジャズ研あるある知識クイズ（16問からランダム8問） |
| 5. ジャイアント・ステップス | 迫るコルトレーン・チェンジを拍で倒す。テンポ無限上昇・外すと即死・**空振りも死ぬ** |

総合成績で段位認定：F「カウントオフで脱落」〜 SS「ジョン・コルトレーン」。
最高段位と直近50件の受験履歴は端末に保存されます。タイトルの「受験履歴」から科目別レーダーチャート付きで見返せます。

## 結果のシェア

- **シェア**：スマホならOSのシェアシート（X/LINE等）が出ます。非対応ブラウザはクリップボードにコピー
- **Xで投稿**：対応端末（スマホ等）は結果画像つきでOSのシェアシートが開きます（Xを選択）。非対応端末は文章のみの投稿画面を開きます
- **ストーリー用画像**：1080×1920の結果画像を生成。対応端末は直接シェア、非対応はダウンロードしてストーリーへ

## 部員に配る方法

- **公開URL**：https://jazzcertify.cilabworks.com/ （GitHub Pages + 独自ドメイン。`main`にpushで自動デプロイ）
- **LINE/Discordで配布**：`index.html` をそのまま送る→各自ブラウザで開く
- ローカルサーバ：`python -m http.server` → `http://localhost:8000`

## 収益化設定

結果画面の「認定推薦図書」リンクと「コーヒーを奢る」ボタンは `index.html` 上部の定数で設定します。

- `AMAZON_ASSOC_TAG`：AmazonアソシエイトのトラッキングIDを入れると推薦図書リンクがアフィリエイト化します（空=通常リンク）
- `DONATE_URL`：Ko-fi等の支援ページURLを入れるとボタンが表示されます（空=非表示）

## 技術メモ

- 依存ゼロのVanilla JS。タイミング判定はAudioContextクロック基準（±ms精度）
- タップ遅延は端末種別で補正済み（タッチ約35ms／PC約12ms）。残りのズレは実力です
- 連打対策：Giant Stepsはコードがラインに重なっていないタイミングのタップも即死

## アクセス解析（設定・公開待ち）

無料の [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/) を任意で利用できます。GitHub Pages の公開先と Cloudflare の DNS only 設定はそのままで、依存パッケージやビルドは追加しません。
**現在 `CF_WEB_ANALYTICS_TOKEN` は空なので、解析スクリプトの取得・データ送信は一切行いません。設定して公開するまで集計は始まりません。**

### 有効にする手順

1. `cilabworks.com` を管理する既存の Cloudflare アカウントで [ダッシュボード](https://dash.cloudflare.com/) に入り、**Web Analytics** を開く。
2. `jazzcertify.cilabworks.com` が既に登録されていればその設定を利用する。未登録なら、このホスト名で **Add a site** を行うかを管理者が判断する。アカウント作成・有料プラン・DNS のプロキシ切り替えは不要。
3. **Manage site** の JS snippet 内にある `data-cf-beacon` の `token` を、`index.html` 末尾の `CF_WEB_ANALYTICS_TOKEN` に入れる。これはページに公開するビーコン識別子。**Cloudflare API token / Global API Key / パスワードは使わず、リポジトリにも入れない。**
4. 差分を確認してから公開を承認し、`main` にマージする。GitHub Pages の自動デプロイ後、本番ページを開いて確認する。

既存アカウントでの対象サイト登録状態・公開用 token は未確認です。DNS only のサイトには [手動の JS snippet 設置](https://developers.cloudflare.com/web-analytics/get-started/) が必要です。自動挿入を別途有効にせず、ビーコンを二重設置しないでください。

### 数字を見る方法

Cloudflare ダッシュボード → **Web Analytics** → **jazzcertify.cilabworks.com** で期間を選択します。

- **Visits**：外部サイトまたは直接リンクからの訪問。個人を識別したユニークユーザー数ではありません。
- **Page views**：ページ閲覧数。受験中の画面切り替えや再挑戦は追加の閲覧として送信しません。
- **Referer**：流入元のホスト名。LINE 等が参照元を渡さない場合は直接アクセスとして表示され、流入元を区別できません。

公開後のアクセスから集計され、過去の訪問は復元できません。反映には数分かかる場合があります。広告ブロッカー、通信失敗、DNT / GPC の有効化などで未計測になるため、全訪問の厳密な件数ではありません。UTM パラメーター別の集計や受験完了数はこの方式の対象外です。

### 送信範囲とローカル動作

- HTTPS の `jazzcertify.cilabworks.com` で、有効な公開用 token を設定した場合だけ公式ビーコンを読み込みます。`file://`、localhost、プレビュー・別ドメインでは読み込みません。
- [公式仕様](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/) のページ URL・参照元・表示性能等を Cloudflare に送信します。Cookie や永続的なユーザー識別子による追跡は使いません。URL のクエリーとフラグメントは公式ビーコンが除去します。
- 回答・点数・段位・ミュート設定・localStorage の受験履歴は解析へ渡しません。独自イベントは追加しません。アクセス元 IP 等の通常のネットワーク情報は通信先に到達しますが、[Cloudflare は訪問者の個人データを収集・利用しない方針](https://developers.cloudflare.com/web-analytics/about/)を示しています。
- 解析がブロックされてもゲームの開始・採点・ローカル保存は動作します。無効化は token を空に戻して公開します。

### 検証

`node --test tests/analytics.test.cjs` で、空/不正 token、ローカル/別ドメイン、DNT / GPC、二重設置、挿入失敗、本番の script 設定を通信なしで検証できます。実際の Cloudflare 集計成功を確認するテストではありません。
子プロセスの起動が制限される環境では Node.js 24 以降の `node --test --test-isolation=none tests/analytics.test.cjs` も使えます。

公開前・公開後にはブラウザで全5科目の開始〜採点、総合段位、スマホ幅表示、音声を確認します。公開後、開発者ツールの Network で `beacon.min.js` が1回だけ読み込まれ、`https://cloudflareinsights.com/cdn-cgi/rum` への POST が成功することを確認します。タブを切り替えると表示性能の追加報告も発生します。Payload に回答・成績・履歴がなく、URL のクエリー/フラグメントが除去されていること、ダッシュボードに閲覧と参照元が反映されることを確認してください。
