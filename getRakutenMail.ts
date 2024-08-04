import { PaymentInfo, PaymentInfoList } from "./paymentInfo.ts";

/**
 * 指定されたDateオブジェクトの日付の楽天決済案内メールをGmailの受信ボックスから取得します。
 * @param {Date} date - 検索する日付のDateオブジェクト
 * @returns {GoogleAppsScript.Gmail.GmailMessage[]} メール情報の配列
 */
export const getRakutenMailsByDate = (date: Date): GoogleAppsScript.Gmail.GmailMessage[] => {
  // 翌日の日付を取得する
  const nextDateObj = new Date(date);
  nextDateObj.setDate(nextDateObj.getDate() + 1);

  // 引数の日付と翌日の日付を YYYY/MM/DD 形式で取得
  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  const nextDate = `${nextDateObj.getFullYear()}/${String(nextDateObj.getMonth() + 1).padStart(2, '0')}/${String(nextDateObj.getDate()).padStart(2, '0')}`;

  Logger.log(`formattedDate: ${formattedDate}`);
  Logger.log(`nextDate: ${nextDate}`);

  // メールの検索クエリを作成（特定の日付に基づく検索）
  const query = `subject:"カード利用のお知らせ(本人・家族会員ご利用分)" after:${formattedDate} before:${nextDate} -:"速報版"`;
  const threads = GmailApp.search(query);

  // メールメッセージのリストを取得
  const messages: GoogleAppsScript.Gmail.GmailMessage[] = [];
  for (const thread of threads) {
    const threadMessages = thread.getMessages();
    messages.push(...threadMessages);
  }

  return messages;
};

/**
 * メール本文から決済履歴の情報を抽出し、決済情報オブジェクトを取得します。
 * @param message メール本文（1つのメールが入るイメージ）
 * @returns 決済情報オブジェクト
 */
export const parseMessage = (message: string): PaymentInfoList => {
  const paymentInfoList: PaymentInfo[] = [];
  const regex = /■利用日:\s*(\d{4}\/\d{2}\/\d{2})\s*■利用先:\s*(.*?)\s*■利用者:\s*(.*?)\s*■支払方法:\s*(.*?)\s*■利用金額:\s*([\d,]+) 円\s*■支払月:\s*(\d{4}\/\d{2})/g;
  let match;

  while ((match = regex.exec(message)) !== null) {
    const date = match[1];
    const store = match[2];
    const user = match[3];
    const amount = parseFloat(match[5].replace(/,/g, ""));
    const paymentMonth = match[6];

    // PaymentInfoオブジェクトを作成してリストに追加
    paymentInfoList.push(new PaymentInfo(date, store, user, amount, paymentMonth));
  }

  return new PaymentInfoList(paymentInfoList);
}

export class Message {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  private extractPaymentInfo = (prefix: string): string => {
    const matched: RegExpMatchArray | null = this.message.match(`${prefix}.+`);
    return matched ? matched[0].replace(prefix, "").trim() : "";
  };

  getUseDay(): string {
    return this.extractPaymentInfo("■利用日: ");
  }

  getUseStore(): string {
    return this.extractPaymentInfo("■利用先: ");
  }

  getUser(): string {
    return this.extractPaymentInfo("■利用者: ");
  }

  getAmount(): number {
    const amountString = this.extractPaymentInfo("■利用金額: ");
    const amount = parseFloat(amountString.replace(/[^0-9.]/g, ""));
    return isNaN(amount) ? 0 : amount;
  }
}
