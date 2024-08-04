# 概要
楽天家族カード利用のお知らせメールをGmailから取得、整形し、LINE BOT経由で送信するGASのスクリプトです。
本来GASではTypeScriptを使えませんが、[clasp](https://github.com/google/clasp)を使用することにより、ローカルでTypeScriptを用いて開発し、GASにデプロイをすることができるようになります。

![ダウンロード](https://github.com/user-attachments/assets/f4c942a4-510f-4b58-a8f6-5777cb81a8dd)


# セットアップ
#### npmでclaspをインストール
```shell
$ npm i @google/clasp -g
```

#### コマンドを叩くと、ブラウザでタブが開くので、Googleアカウントでログインする。
```shell
$ clasp login
```

#### ライブラリをインストールする。
```shell
$ npm install
```

#### GASにプロジェクトを作成する。
.clasp.jsonが作成される。
```shell
$ clasp create --title "Rakuten Kazoku Card Notify Line" --type standalone
```

#### LINE DevelopersコンソールでチャネルのアクセストークンとLINEグループのグループIDを取得し、GASのスクリプトプロパティ（環境変数的なもの）で設定する。
- [LINE Developersコンソールからチャネルを作成し、チャネルのアクセストークンを取得する](https://developers.line.biz/ja/docs/messaging-api/getting-started/)
- [LINEグループのグループID取得方法で参考になる記事](https://qiita.com/enbanbunbun123/items/2504687e4b6c13a289db)

<img width="1425" alt="スクリーンショット 2024-08-04 22 40 47" src="https://github.com/user-attachments/assets/6a842b54-cda2-429b-8df2-8da9fb2cef98">


#### GASでライブラリ（line-bot-sdk-gas）を設定する。
[line-bot-sdk-gas](https://github.com/kobanyan/line-bot-sdk-gas)を使用しているので、GASにライブラリを追加しなければいけません。
下記スクリプトIDを、GASのプロジェクトのライブラリで設定する。
```
1EvYoqrPLkKgsV8FDgSjnHjW1jLp3asOSfDGEtLFO86pPSIm9PbuCQU7b
```
<img width="1413" alt="スクリーンショット 2024-08-04 22 45 47" src="https://github.com/user-attachments/assets/8549e410-3baf-4b15-bf48-0659ff667a65">


# デプロイ方法
```shell
$ clasp push
```
