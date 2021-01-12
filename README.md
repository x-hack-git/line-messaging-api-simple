# 目次
- [動画による解説](#動画による解説)
- [使い方](#使い方)
- [完成イメージ](#完成イメージ)
- [必要なアカウント](#必要なアカウント)

---

# 動画による解説
下記のリンク先動画で手順を再現しています  
https://youtu.be/aByTfznhBWs

---

# 使い方

勉強会用の LINE BOT ソースコード です。  
今回は、codenvy(cloud IDE)と、heroku(PaaS)を使用して開発します。  
所要時間は、慣れた人なら10min程度です。  

---

# 完成イメージ
<ul>
  <li>
  今回作成するのは、自動で応答してくれるLINE BOTです<br>
  <img src="https://github.com/x-hack-git/line-messaging-api/blob/master/image/sample_image.gif" height="320px">
  </li>
  <li>
  データベースに接続するとクイズだって作れます<br>
  <img src="https://github.com/x-hack-git/line-messaging-api/blob/master/image/quiz-dayo.gif" height="420px">
  </li>
</ul>

---

# 必要なアカウント

下記のソフトウェアとアカウントが必要なので、事前に取得しておいてください  

- Chromeブラウザ/FireFoxブラウザ
  ブラウザはChromeかFireFoxのどちらかをご利用ください  
  https://www.google.com/intl/ja_ALL/chrome/

- AWSアカウント
  cloud9を利用します。

- Herokuアカウント
  サーバーはherokuを利用します  
  https://id.heroku.com/login

- LINEアカウント
  LINE Messaging API利用登録  
  https://developers.line.me/ja/

---

## LINE Developer Consoleでの作業

- LINE Developers
https://developers.line.biz/ja/

### LINEでの作業
- プロバイダ追加する
- チャネル追加する
- LINE_CHANNEL_SECRET の取得
- LINE_CHANNEL_ACCESS_TOKEN の取得
- Webhook送信 利用するに設定
- Webhook URLをセットする(後述)

---

## Codenvyでの作業

#### STEP-1 ワークスペース作成

  - サイドバーからcreate workspaceを選択
  <img src="https://github.com/x-hack-git/line-messaging-api/blob/master/image/create_workspace.png" height="320px">

#### STEP-2 STACKを選択する

  - 今回はNodeを選択してください
  <img src="https://github.com/x-hack-git/line-messaging-api/blob/master/image/select_node.png" height="320px">

#### STEP-3 PROJECTSでGitURLを指定する

  - 以下のURLをコピペして貼り付けましょう
  ```
  https://github.com/x-hack-git/line-messaging-api.git
  ```
  - 貼り付けたら「Create」を実行します

## Herokuでの作業

- herokuダッシュボードでConfigをセットする

  1. LINE_CHANNEL_SECRETのセット
  2. LINE_CHANNEL_ACCESS_TOKENのセット

---
