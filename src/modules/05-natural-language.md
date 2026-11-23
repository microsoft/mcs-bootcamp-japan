---
title: 自然言語でエージェントを作る
description: 自然言語の要件からスキルとエージェントを作成し、生成内容と動作を確認します。
order: 5
startTime: "14:05"
duration: 30分
labDuration: 20分
sessionPlan: 講師デモ10分 → 実習20分
slides: https://aka.ms/mcsbootcampjp/module5
---

## 概要

情報源と登録先を指定した依頼から始め、作成チャットの確認質問に答えながら、Microsoft 365 Copilot の社内ヘルプデスクエージェントを作成する実習です。

回答の根拠にするナレッジの URL と、問い合わせを登録する SharePoint リストの完全な URL を最初に伝えます。生成後は、指示・ナレッジ・スキル・ツールの構成を確認し、質問への回答と、同意に基づく問い合わせ登録を試します。

> [!IMPORTANT]
> 自然言語による作成では、同じ依頼でも確認質問・選択肢・順序・生成される構成が異なる場合があります。この教材の会話は一度の試行例であり、同じ動作を保証するものではありません。画面や応答が例と異なる場合は、未指定の要件を短い追加メッセージで伝え、実際の生成結果を確認してください。

## 学習目標

- 自然言語を用いて、エージェントの作成、設定の変更、スキルの作成を行う。
- 外部 Web 上の情報や独自ドキュメントなど複数のナレッジを構成する。
- SharePoint リストにアイテムを追加できるツールを使い、利用者の同意後に問い合わせを登録する。

## シナリオと完成イメージ

社内で Microsoft 365 Copilot の利用が始まり、「何に使えるのか」「使えないときに何を確認すればよいか」「ライセンスをどう申請するか」といった相談がヘルプデスクに寄せられています。社員が自分で解決できる相談にはその場で回答し、人の調査が必要な相談は、それまでのやり取りを整理して受け付けるエージェントを開発します。

### 1. 質問に回答する

社員からの質問に対し、公式情報や社内ガイドを根拠に回答します。状況の確認が必要な場合は、社員に質問しながら案内を進めます。

| カテゴリ | 問い合わせ例 | 目指す対応 |
| --- | --- | --- |
| 製品の質問 | Microsoft 365 Copilot で何ができますか？ | 公式情報を参照し、機能や使い方を案内する |
| トラブルシューティング | Word で Copilot が表示されません | 状況を確認し、確認手順を順に案内する |
| ライセンスの質問 | Microsoft 365 Copilot を使うには、どのライセンスが必要ですか？ | 利用条件やライセンス状況の確認方法を案内する |

製品の機能・利用条件・一般的な確認方法の根拠には Microsoft Learn、Microsoft Support、Microsoft 365 公式サイトを指定します。社内のライセンス申請・承認・費用負担・問い合わせ先は、配布する演習用の社内ガイドを参照させます。出典付きで回答することを目指し、製品案内・トラブルシューティング・ライセンス案内の 3 つのスキルを作成チャットで依頼します。

### 2. 回答できない問題をエスカレーションする

手元の情報だけでは回答できない場合や、確認手順を案内しても解決しない場合は、人の担当者へ相談できるようにします。例えば「Word に Copilot が表示されない」という相談で、再起動やサインインし直しを試しても改善しなかった場合は、次の流れで担当窓口への問い合わせを受け付けます。

1. **人への相談を希望するか確認する。** 利用者が希望した場合に、問い合わせ登録へ進みます。質問に答えただけでは登録しません。
2. **相談内容を整理して見せる。** 「Word に Copilot が表示されない」という件名、対象製品、困っている状況、「Word の再起動とサインインし直しを試したが改善しなかった」などの試した対処をまとめ、利用者に確認してもらいます。利用者は内容を修正したり、登録を断ったりできます。
3. **同意を得て問い合わせを登録する。** 利用者が登録に同意したら、リストアイテムを追加できるツールで演習用の問い合わせ一覧に記録します。担当者が後から一覧を見て、利用者に同じ説明を一から求めずに調査を始められる状態を作ります。
4. **受付番号を案内する。** 登録に成功したら、作成されたアイテムの ID を受付番号として伝えます。登録できなかった場合は、受け付けたことにせず、失敗したことを伝えます。

## 前提条件と事前準備

- Copilot Studio にサインインでき、演習用環境でエージェントを作成できること。
- ホーム画面で、自然言語による作成チャットを利用できること。
- Microsoft 公式の公開 Web サイトをナレッジとして利用できること。
- [Microsoft 365 Copilot 利用・ライセンス申請ガイド（PDF）](../assets/05-natural-language/copilot-license-policy.pdf) をダウンロードし、内容を確認しておくこと。この PDF は演習用の架空の社内ルールであり、実在企業の規程ではありません。
- 配布した社内ガイドを、エージェントのファイルナレッジとして追加できること。
- SharePoint の**マイ リスト**にリストを作成し、SharePoint MCP・Work IQ・SharePoint コネクタなど、リストアイテムを追加できるツールを利用できること。
- 問い合わせの検証には架空の状況を使用し、パスワード・認証コード・機密情報を入力しないこと。

> [!IMPORTANT]
> 自然言語による作成はプレビュー機能です。利用できる画面や機能は環境によって異なります。作成・テスト・評価では Copilot Credits を消費する場合があります。

### エスカレーション登録用のリストを準備する

1. [エスカレーション登録用 SharePoint リスト（スキーマ付き CSV）](../assets/05-natural-language/support-inquiries.csv) をダウンロードします。

2. [演習用 SharePoint](https://copilotstudiotraining.sharepoint.com/) を開き、左メニューで**ビルド**をクリックします。

   ![sharepoint_build_menu](../../assets/images/module5/sharepoint_build_menu.png)

3. リストをクリックします。

   ![sharepoint_list_menu](../../assets/images/module5/sharepoint_list_menu.png)

4. インポート元で **CSV** をクリックします。

   ![sharepoint_list_csv_menu](../../assets/images/module5/sharepoint_list_csv_menu.png)

5. ダウンロードした CSV をアップロードし、7 列存在する事を確認し、**次へ**を選択します。`Inquiry`・`TriedActions`・`Summary` は複数行テキスト、`Category` は選択肢です。

   ![sharepoint_list_csv_columns_menu](../../assets/images/module5/sharepoint_list_csv_columns_menu.png)

6. 作成先を**マイ リスト**にし、名前を `support-inquiries` として作成します。

   ![sharepoint_list_save_menu](../../assets/images/module5/sharepoint_list_save_menu.png)

7. リストを開き、7 列とサンプル 4 件を確認します。

   ![sharepoint_list_support_inquries](../../assets/images/module5/sharepoint_list_support_inquries.png)

8. ブラウザーのアドレスバーで、**リストの完全な URL** をアドレスバーからコピーして控えます。

| 列名 | 用途 |
| --- | --- |
| Title | 問い合わせの件名 |
| Product | 対象製品・利用アプリ |
| Inquiry | 問い合わせ内容 |
| TriedActions | 試した対処 |
| Category | 問い合わせの種類。登録時は未分類 |
| Summary | 要約。登録時は空欄 |
| AssignedTeam | 担当窓口。登録時は空欄 |

## ハンズオン

### Step 1: 情報源と登録先を指定して作成を依頼する

1. [Copilot Studio](https://copilotstudio.preview.microsoft.com/) を開き、演習用環境を選択します。

2. `チャット`メニューより `new chat` をクリックします。

   ![new-chat](../../assets/images/module5/new_chat.png)

3. 次の依頼の `[作成したリストの完全な URL]` を、準備で控えた自分のリストの URL に置き換えます。サイトの URL だけではなく、`/Lists/` 以降を含む完全な URL を指定し、ホーム画面の自然言語による作成入力欄に入力して送信します。

   ```text
   Microsoft 365 Copilot の社内ヘルプデスクエージェントを作って。製品、トラブル、ライセンスの質問に日本語で対応したい。
   製品案内・トラブルシューティング・ライセンス案内の 3 つのスキルを作り、それぞれの対応をカスタマイズできるようにして。

   【質問への回答】
   製品の機能・利用条件・一般的な確認方法は、次の URL をナレッジとして追加し、根拠のリンクを示して回答して。
   https://www.microsoft.com/ja-jp/microsoft-365
   https://learn.microsoft.com/ja-jp/microsoft-365
   https://support.microsoft.com/ja-jp/microsoft-365

   社内のライセンス申請・承認・費用負担・問い合わせ先は、作成後にファイルナレッジとして追加する「Microsoft 365 Copilot 利用・ライセンス申請ガイド」を参照して。
   社内ルールと公式の製品情報を区別し、ガイドを追加するまでは社内ルールを推測しないで。

   【解決しない相談のエスカレーション】
   問い合わせの登録先は、次の SharePoint リストにして。
   [作成したリストの完全な URL]

   手元の情報だけでは回答できない場合や、案内しても解決しない場合に、利用者が担当窓口への相談を希望したら、件名・製品・問い合わせ内容・試した対処を整理して提示して。
   利用者に修正の機会を設け、登録への明確な同意を得てから、リストアイテムを追加できるツールで上記のリストに登録して。
   件名を Title、製品を Product、問い合わせ内容を Inquiry、試した対処を TriedActions に入れて。Category は未分類、Summary と AssignedTeam は空欄にし、不明な製品や試した対処は未確認にして。
   成功時は実際に作成されたアイテムの ID を受付番号として伝え、失敗時は登録できなかったことを伝えて。FAQ への質問だけの場合や、同意前・登録を断られた場合は登録しないで。
   登録にはワークフローを使わないで。通知・自動振り分け・ライセンス申請や割り当ては不要。
   ```

   ※ 現在のバージョンではファイルをチャットでアップロードすることはできないため、エージェント作成後に別途ナレッジを追加します。

   ![new_chat_building](../../assets/images/module5/new_chat_building.png)

### Step 2: 生成された構成を確認し、作成チャットで修正する

1. 作成の完了を待ち、生成されたエージェントを別のタブで開きます。

   ![agents](../../assets/images/module5/agents.png)

2. モデルで `Claude Sonnet 5.5` が指定されているか確認します。異なるモデルが設定されている場合、モデルを `Claude Sonnet 5.5` に変更します。

   ![model-selection](../../assets/images/module5/model_selection.png)

3. 「作成」タブで指示・ナレッジ・スキル・ツールを確認します。「M365 Copilot ヘルプデスク」またはそれに相当する名前のエージェントが日本語で対応する構成になり、外部 Web ナレッジと 3 つのスキル、SharePoint リストにアイテムを追加できるツールが追加されていることを確認します。

   | 確認対象 | 確認する内容 |
   | --- | --- |
   | 指示 | 対象製品・3 カテゴリ・日本語での対応が反映されているか |
   | ナレッジ | 外部サイト検索が追加され、Microsoft Learn やサポートのサイトが指定されているか |
   | スキル | 製品の質問、トラブルシューティングおよびライセンス確認の 3 つが存在し、指示と同じ対応範囲を守っているか |
   | ツール | SharePoint MCP・Work IQ・コネクタなど、SharePoint リストにアイテムを追加できるツールを使用できるか |
   | 登録先・列の対応 | 問い合わせ登録を行うスキルに、自分のサイト・リストの URL、列に対応する値、登録時の初期値が指定されているか |
   | 登録の条件 | 登録内容を提示して明確な同意を得た後だけ登録し、成功時は実際の ID を返すか。件名・製品・問い合わせ内容の必須設定と、件名・製品の 255 文字制限に対応しているか |
   | 対応の境界 | 個人のライセンス状況や原因を断定せず、秘密情報・メールアドレスを求めないか。書き込みは自分のリストへの問い合わせ登録に限定し、通知・ライセンス操作を行わないか |

   要件が反映されていない場合は、作成チャットで追加指示を伝え、修正後の構成を確認します。例えば、外部サイトが意図したサイトになっていない場合は具体的な URL を伝え、スキルが不足している場合は追加を依頼します。

4. チャットで指示通りエージェントが作成された場合、問い合わせ登録は`スキル`ではなく`指示`になるため、チャットでスキル化を依頼します。もし既にスキルが 4 つある場合は内容だけ確認します。

   ![initial-skills](../../assets/images/module5/initial-skills.png)

   ```text
   解決しない相談のエスカレーションの内容をスキルにして。
   ```

5. チャットでスキルが追加されたことを確認します。

   ![chat_escalation_skill](../../assets/images/module5/chat_escalation_skill.png)

6. エージェントの画面で更新してスキルが追加されていることを確認します。

   ![agent_escalation_skill](../../assets/images/module5/agent_escalation_skill.png)

#### SharePoint の登録先と列の対応を確認する

問い合わせ登録を行うスキルを開き、指示に指定された登録先が、準備で控えて作成チャットに渡したリストの完全な URL と一致し、自分のマイ リストに作成したリストになっていることを確認します。サイトの URL とリスト名が別々に指定されている場合は、同じリストを指していることを確認します。各列の対応と初期値が依頼どおりであることも確認します。ツールの種類を固定せず、スキルからリストアイテムを追加できるツールを利用する構成になっているかを確認し、未設定・意図と異なる場合だけ、作成チャットで修正を依頼します。

![escalation_skill_detail](../../assets/images/module5/escalation_skill_detail.png)

#### ナレッジ URL の問題を見つける

最初の依頼で指定した次の URL が、ナレッジに反映されているかを確認します。追加されていない場合や、URL が階層制限に合わない場合は、作成チャットでナレッジの追加・修正を依頼します。

| ナレッジ | URL |
| --- | --- |
| Microsoft 365 公式サイト | `https://www.microsoft.com/ja-jp/microsoft-365` |
| Microsoft Learn - Microsoft 365  | `https://learn.microsoft.com/ja-jp/microsoft-365` |
| Microsoft Support - Microsoft 365  | `https://support.microsoft.com/ja-jp/microsoft-365` |

![knowledge_web_1](../../assets/images/module5/knowledge_web_1.png)

> [!WARNING]
> 作成チャットでエージェントを更新した場合は、別タブで開いているエージェントの画面を一度再読み込みしてください。

### Step 3: ナレッジとして社内ドキュメントを追加する

社内ドキュメントはまだナレッジに追加していないため、ここで手動で追加し、ライセンス案内のスキルを更新します。

1. エージェントを開き、**作成**タブで**ナレッジ**の **［＋］** を選択します。

   ![add_knowledge](../../assets/images/module5/add_knowledge.png)

2. `ドラッグ アンド ドロップ、またはクリックしてアップロード` をクリックして [copilot-license-policy.pdf](../assets/05-natural-language/copilot-license-policy.pdf) をアップロードします。

   ![upload_knowledge](../../assets/images/module5/upload_knowledge.png)

3. **エージェントに追加する**を選択します。

   ![add_knowledge_to_agent](../../assets/images/module5/add_knowledge_to_agent.png)

4. 追加されたナレッジを開き、名前に「Microsoft 365 Copilot 利用・ライセンス申請ガイド」、説明に「社内情報：Microsoft 365 Copilot 利用・ライセンス申請ガイド」と入力して、**保存**を選択します。

   ![update_knowledge_source](../../assets/images/module5/update_knowledge_source.png)

5. エージェントの**保存**ボタンを選択して変更を保存します。

   ![save_agent](../../assets/images/module5/save_agent.png)

6. ライセンス案内スキルの内容を確認し、申請ガイドが使われるように指示がされているか確認します。

   ![skill_license_guide](../../assets/images/module5/skill_license_guide.png)

   もし指示が不足している場合、作成チャットに戻り、ライセンス案内のスキルの更新を依頼します。

   ```text
   ナレッジとして「Microsoft 365 Copilot 利用・ライセンス申請ガイド」を追加したので、ライセンスガイドスキルを更新してください。
   ```

   ![skill_license_guide_update](../../assets/images/module5/skill_license_guide_update.png)

7. 処理が完了したら、エージェントの画面を一度再読み込みし、スキルに社内ガイドを参照する指示が反映されていることを確認します。

### Step 4: プレビューでエージェントを試す

1. 内容が確認できたら、エージェントを保存し、**プレビュー** を開きます。

   ![preview](../../assets/images/module5/preview.png)

2. 次の表の 5 件を試します。各ケースは新しい会話で開始してください。

   | 質問案 | 確認する内容 |
   | --- | --- |
   | Microsoft 365 Copilot と Copilot Chat の違いを教えて | 製品案内のスキルを利用し、出典を提示しているか |
   | 会社の Word で Copilot が表示されません | トラブルシューティングのスキルを利用し、状況を確認する追加質問をしているか |
   | 会社で Microsoft 365 Copilot を使うためのライセンス条件を教えて | ライセンス案内のスキルを利用し、公式の利用条件と社内ルールを区別して案内しているか |
   | Word で Copilot が表示されません。ライセンスは割り当て済みで、再起動・再サインインでも直りません。<br>IT 部門への問い合わせを登録したいです。 | 内容の提示・同意前は未登録か。<br>「この内容で登録してください」と答えると、演習用リストに 1 件追加されるか。<br>受付番号は行の ID と一致するか。<br>`Category` は `未分類`、`Summary`・`AssignedTeam` は空欄か。<br>登録失敗時はエラーを伝えるか |
   | 上と同じ依頼を送り、内容の提示後に「登録しないでください」と答える | 登録ツールが実行されず、リストの行も増えないか |

   出典はリンクや参照資料を開き、回答の内容を実際に裏付けていることを確認します。プレビューのアクティビティトレースでスキルの呼び出しや実行内容を確認します。

   ![chat_result1](../../assets/images/module5/chat_result1.png)

意図した動作にならない場合は、次の流れで改善します。

1. プレビューではなく、エージェントを作成した元のチャットに戻り、**入力した質問・実際の動作・期待する動作** を伝えて修正を依頼します。

2. 修正が完了したら、別タブのエージェント画面を再読み込みし、指示やスキルの変更を確認して保存します。

3. プレビューで新しい会話を開始し、同じ質問と会話の流れで再確認します。意図した動作になるまで、チャットでの修正とプレビューでの確認を繰り返します。

## まとめ

- 情報源と登録先の URL を最初の依頼に含め、生成された構成を確認します。
- 回答の情報源や、トラブル診断・ライセンス確認の対話的な手順を指定します。
- 複数のナレッジを必要に応じて作成します。
- 担当窓口への相談が必要な場合は、登録内容を提示して同意を得た後、ツールを使って SharePoint リストに問い合わせを登録します。
- 生成結果の問題を見つけたら、元の作成チャットで修正を依頼し、変更が反映されたことを確認します。

## 参考情報

- [自然言語によるソリューションの作成（プレビュー）](https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/create-automation-natural-language)
- [Microsoft Copilot ハーネスの概要](https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/agents-experience/overview)
- [エージェントへのナレッジ追加](https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/agents-experience/knowledge-add-existing-copilot)
- [AI によるスキルの作成](https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/agents-experience/skills-create)
- [エージェントのプレビューとテスト](https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/agents-experience/preview-overview)
- [SharePoint MCP のツール](https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/mcp-sharepoint-tools)
