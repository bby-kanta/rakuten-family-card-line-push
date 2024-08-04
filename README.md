# 概要
楽天家族カード利用のお知らせメールをGmailから取得、整形し、LINE BOT経由で送信するGASのスクリプトです。
本来GASではTypeScriptを使えませんが、[clasp](https://github.com/google/clasp)を使用することにより、ローカルでTypeScriptを用いて開発し、GASにデプロイをすることができるようになります。

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

#### GASでライブラリ（line-bot-sdk-gas）を設定する。
[line-bot-sdk-gas](https://github.com/kobanyan/line-bot-sdk-gas)を使用しているので、GASにライブラリを追加しなければいけません。
下記スクリプトIDを、GASのプロジェクトのライブラリで設定する。
```
1EvYoqrPLkKgsV8FDgSjnHjW1jLp3asOSfDGEtLFO86pPSIm9PbuCQU7b
```

# デプロイ方法
```shell
$ clasp push
```
