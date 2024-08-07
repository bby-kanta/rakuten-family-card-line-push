
import { RakutenMailGetter } from './rakutenMailGetter.ts';
import { NoticePaymentHistoryMessage } from './noticePaymentMessage.ts';
import { RakutenMailParser } from './rakutenMailParser.ts';
import { PaymentInfo, PaymentInfoList } from './paymentInfo.ts';

const LINE_GROUP_ID = PropertiesService.getScriptProperties().getProperty("LINE_GROUP_ID");
const LINE_CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN");

const lineClient = new LineBotSDK.Client({
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
});

/**
 * 日時で実行する関数
 * 本日の楽天家族カード利用履歴を取得し、LINEに通知する
 * @returns {void}
 */
function daily(): void {
  const today = formatDate();
  const altText = `【${today.toISOString().split('T')[0]}】家族カード利用速報`;

  const rakutenMailParser = new RakutenMailParser();
  const rakutenMailGetter = new RakutenMailGetter();

  const mails = rakutenMailGetter.getByDate(today);
  if (mails.length > 0) {
    for (const mail of mails) {
      const paymentInfoList = rakutenMailParser.parseMessage(mail.getPlainBody());

      // 家族利用分のみ抽出
      const familyPaymentInfoList = paymentInfoList.extractPerUser("家族");
      Logger.log(familyPaymentInfoList);

      // LINEのフレックスメッセージを作成
      const noticeMessage = new NoticePaymentHistoryMessage(familyPaymentInfoList, altText);

      // LINEにメッセージを送信
      sendLineMessage(noticeMessage, altText);
    }
  }
}

/**
 * 月次で実行する関数
 * 前月分の楽天家族カード利用履歴を取得し、LINEに通知する
 * @returns {void}
 */
function monthly(): void {
  const rakutenMailParser = new RakutenMailParser();
  const rakutenMailGetter = new RakutenMailGetter();

  const today = formatDate();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 20);
  const title = `${today.getFullYear()}年${(today.getMonth() + 1).toString()}月の推定支払金額レポート`;

  const mails = rakutenMailGetter.getByDateRange(startDate, today);
  if (mails.length > 0) {
    const paymentMonth = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;

    const array: PaymentInfo[] = [];
    for (const mail of mails) {
      const paymentInfoList = rakutenMailParser.parseMessage(mail.getPlainBody());

      // 家族利用分のみ抽出
      const familyPaymentInfoList = paymentInfoList.extractPerUser("家族").extractByPaymentMonth(paymentMonth);

      array.push(...familyPaymentInfoList.all());
    }
    const result = new PaymentInfoList(array).sortByDate("asc");
    Logger.log(result);

    const noticeMessage = new NoticePaymentHistoryMessage(result, title);

    sendLineMessage(noticeMessage, title);
  }
}

/**
 * LINEにメッセージを送信する
 * @param {NoticePaymentHistoryMessage} noticeMessage - 送信するメッセージオブジェクト
 */
function sendLineMessage(noticeMessage: NoticePaymentHistoryMessage, altText: string): void {
  const payload = {
    type: "flex",
    altText: altText,
    contents: {
      type: noticeMessage.type,
      header: noticeMessage.header,
      body: noticeMessage.body,
    },
  };

  lineClient.pushMessage(LINE_GROUP_ID, payload);
}


/**
 * 日付を指定された形式で返す。引数がない場合は今日の日付のDateオブジェクトを返す。
 * @param {string} dateString - 例: "2024-08-01"（YYYY-MM-DD形式の文字列）
 * @returns {Date} 指定された日付または今日の日付のDateオブジェクト
 */
function formatDate(dateString?: string): Date {
  if (dateString) {
    // 引数が指定されている場合、YYYY-MM-DD形式の文字列をDateオブジェクトに変換
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // 月は0から始まるため-1
  } else {
    // 引数が指定されていない場合、今日の日付を返す
    return new Date();
  }
}
