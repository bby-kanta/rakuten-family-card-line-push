import { PaymentInfo, PaymentInfoList } from "./paymentInfo";

export class RakutenMailParser {
  /**
   * メール本文から決済履歴の情報を抽出し、決済情報オブジェクトを取得します。
   * @param message メール本文（1つのメールが入るイメージ）
   * @returns 決済情報オブジェクト
   */
  public parseMessage = (message: string): PaymentInfoList => {
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
