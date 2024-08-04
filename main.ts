
import { RakutenMailGetter } from './rakutenMailGetter.ts';
import { NoticePaymentHistoryMessage } from './noticePaymentMessage.ts';
import { RakutenMailParser } from './rakutenMailParser.ts';

const LINE_GROUP_ID = PropertiesService.getScriptProperties().getProperty("LINE_GROUP_ID");
const LINE_CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN");

const lineClient = new LineBotSDK.Client({
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
});

function daily() {
  const today = formatDate();

  const rakutenMailParser = new RakutenMailParser();
  const rakutenMailGetter = new RakutenMailGetter();

  const mails = rakutenMailGetter.getByDate(today);
  if (mails.length > 0) {
    for (const mail of mails) {
      const paymentInfoList = rakutenMailParser.parseMessage(mail.getPlainBody());
      const familyPaymentInfoList = paymentInfoList.extractPerUser("家族");
      Logger.log(familyPaymentInfoList);

      const noticeMessage = new NoticePaymentHistoryMessage(familyPaymentInfoList);

      // LINEにメッセージを送信
      sendLineMessage(noticeMessage);
    }
  }
}

/**
 * LINEにメッセージを送信する
 * @param {NoticePaymentHistoryMessage} noticeMessage - 送信するメッセージオブジェクト
 */
function sendLineMessage(noticeMessage: NoticePaymentHistoryMessage) {
  const payload = {
    type: "flex",
    altText: "カード利用のお知らせ",
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
