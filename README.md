# Copilot Studio 1Day ハンズオン公開テンプレート

[microsoft/mcs-bootcamp-japan](https://github.com/microsoft/mcs-bootcamp-japan) で管理する日本版ハンズオン教材です。

Markdown原稿から、アジェンダ付きトップページとモジュール詳細ページを生成します。複数ワークショップ向けのタブやカテゴリ切り替えは設けていません。

想定アジェンダの基礎①〜⑧に対応する8モジュールを掲載しています。具体的な操作手順・配布ファイル・必要なライセンスや権限は未確定のひな型です。

## アジェンダの採用範囲

入力資料は `BootCampDay1アジェンダ.xlsx` です。Lab・実習枠のある基礎①〜⑧を採用し、オープニング、昼休憩、休憩、発展編、Day2準備は除外しています。Monitorでの消費確認も5分の実習として掲載しています。

| モジュール | 開始 | 全体枠 | Lab・実習 |
| --- | --- | --- | --- |
| エージェントの動き方と構成要素 | 10:15 | 70分 | 45分 |
| Skills | 11:25 | 35分 | 25分 |
| Knowledge & Tools | 13:00 | 40分 | 20分 |
| マルチエージェント | 13:40 | 25分 | 15分 |
| 自然言語でエージェントを作る | 14:05 | 30分 | 20分 |
| 評価 | 14:35 | 30分 | 20分 |
| Workflows | 15:05 | 40分 | 25分 |
| コストの考え方と消費の確認 | 15:55 | 15分 | 5分 |

開始時刻は元資料どおりで、除外した枠を詰め直していません。全体枠は講義・デモなどを含み、Lab・実習時間とは別に表示します。元資料にレベル指定がないため、レベルは未設定です。SharePointは利用できる環境向けのオプション、Work IQ・分類ノード・Human Reviewは採用未確定の候補として記載しています。

## ローカルで確認する

Node.js 22以降を使用します。

```powershell
npm ci
npm start
```

ターミナルに表示されたURLを開きます。MarkdownやCSSの変更は自動で再生成されます。

```powershell
npm run build
npm test
```

生成先は `_site` です。生成済みHTMLは編集・コミットしません。

## 編集する場所

| 対象 | ファイル |
| --- | --- |
| サイト名・説明・仮置きの注意書き | [src/_data/site.json](src/_data/site.json) |
| トップページの概要・参加案内 | [src/index.njk](src/index.njk) |
| モジュール原稿 | [src/modules/](src/modules/) |
| ヘッダー・フッター | [src/_includes/base.njk](src/_includes/base.njk) |
| モジュール共通レイアウト | [src/_includes/module.njk](src/_includes/module.njk) |
| 配色・余白・モバイル表示 | [src/assets/site.css](src/assets/site.css) |
| 本文の共通章立て | [HANDSON-TEMPLATE.md](HANDSON-TEMPLATE.md) |
| 執筆者向けの記法・表示例 | [src/authoring/samples.md](src/authoring/samples.md) |

## モジュールを追加する

1. [演習ひな型](src/modules/01-agent-components.md) を同じフォルダー内に複製します。
2. ファイル名を `09-new-module.md` などの半角英数字とハイフンの名前にします。ファイル名が公開URLになります。
3. 先頭のメタデータを編集します。`order` は重複しない数値にします。
4. 本文を日本独自の演習に置き換えます。[本文テンプレート](HANDSON-TEMPLATE.md) も利用できます。ステップ数は自由に増減できます。

```yaml
---
title: モジュールのタイトル
description: アジェンダに表示する短い説明
order: 9
kind: ハンズオン
duration: 45分
labDuration: 30分
sessionPlan: 講義15分 → Lab30分
startTime: "10:00"
audience: Copilot Studio の基本操作を経験した方
level: 中級
---
```

アジェンダ、モジュール数、モジュール一覧、前後ページへのリンクは原稿から自動生成します。不要なサンプルは削除してください。

`startTime` は任意の開始時刻です。未指定の場合は「時刻未設定」を表示します。アジェンダの左端はハンズオンを青、それ以外を紫で表示し、右側にレベル・所要時間をまとめます。

本文はページタイトルとは別に `## 概要` などの見出しから記述します。教材の内容確定後に [site.json](src/_data/site.json) の `notice` を更新してください。空文字にすると注意書きを非表示にできます。

本文の末尾は「まとめ」→「参考情報」とします。完了確認・トラブルシューティング・後片付け・次のステップの独立したセクションは設けません。

画像は `src/assets/images/` に置き、本文から `../../assets/images/example.png` のような相対パスで参照します。リポジトリ名が付いたGitHub Pagesでも表示できます。画像には内容が分かる代替テキストを付けてください。

画像・補足欄・コピーアイコン付きコードの記法と表示例は、[執筆者向けサンプル原稿](src/authoring/samples.md) にまとめています。[ローカルの表示サンプル](http://localhost:8080/authoring/samples/) で確認できます。公開先ではサイトURLの末尾に `authoring/samples/` を付けて開きます。受講者向けの8モジュールとは独立しており、アジェンダや前後ナビゲーションには含まれません。

実際の画像は [サンプル図](src/assets/images/agent-flow-sample.svg) です。説明や操作手順の直後に、前後に空行を入れて以下のように記述します。テンプレート直下ではなく、公開用モジュール原稿からの相対パスです。

```markdown
![入力・エージェント・出力の流れを示すサンプル図](../../assets/images/agent-flow-sample.svg)

*図：入力から出力までの流れ（配置サンプル）*
```

補足欄はGitHubと同じMarkdown記法を使用できます。`NOTE`・`TIP`・`IMPORTANT`・`WARNING`（大文字）を用途別に青・緑・紫・黄で表示します。本文の太字・リンク・箇条書きなどもMarkdownで書けます。通常の引用は変更されません。

```markdown
> [!TIP]
> **同じプロンプト**で変更前後を比較しましょう。
```

コードは言語名付きのコードフェンスで記述します。公開ページでは各コードブロック右上にコピーアイコンが自動で付き、コード全体をコピーできます。成功時は2秒間チェックマークに切り替わり、失敗時は手動コピーの案内を表示します。アイコンはキーボードでも操作でき、結果はスクリーンリーダーにも通知します。コピー機能はHTTPS（GitHub Pages）またはlocalhostで利用できます。ブラウザーが許可しない場合は手動で選択・コピーしてください。構文ハイライトは未対応です。表示例は必須の演習ではなく、教材完成時に移動・削除できます。

## GitHub Pagesへ公開する

1. このフォルダーの内容をGitHubリポジトリのルートに配置します。`package-lock.json` も含めます。
2. **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
3. `main` ブランチへプッシュします。ブランチ名が異なる場合は [公開ワークフロー](.github/workflows/pages.yml) の `branches` を変更します。
4. Actionsの `Publish workshop to GitHub Pages` が完了したら、PagesのURLを確認します。

公開先のサブパスはワークフローで取得します。カスタムドメインはGitHub Pages側で設定します。この作業ではリポジトリの作成やオンライン公開は行っていません。

## 参考にした構成

- [Deep dive in modern agents](https://microsoft.github.io/mcs-labs/workshops/ghcp-in-a-day/)
- [microsoft/mcs-labs](https://github.com/microsoft/mcs-labs)

元ページのブラウザー表示を確認し、濃紺グラデーションの概要パネル、左端を色分けしたアジェンダ、時刻・レベル・所要時間の配置、淡い背景のモジュール見出し、青い前後ナビゲーションを参考にしています。1Day向けにタブやワークショップ切り替えを省き、独自のHTML・CSSで実装しています。元のアカウント申請・検索・テーマ切り替え・チャット機能は含みません。参考元のコード・画像・具体的な演習内容は複製していません。参考元はJekyllですが、このテンプレートはNode.jsで扱えるEleventyを使用しています。

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit [Contributor License Agreements](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
